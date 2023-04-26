<template>
<v-container class="pa-0">
  <div v-if="loading" class="d-flex justify-center">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <div v-else>
    <div class="text-h4 mb-2">Рекомендованные задачи</div>

    <div v-if="tags.length > 0" class="mb-4">
      <div class="text-subtitle-1">Теги для прокачки</div>
      <div class="d-flex flex-wrap pt-2 overflow-y-auto menu-card">
        <v-chip
          v-for="(tag, index) in tags"
          :key="`tag_${index}`"
          :color="getTagColor(tag)"
          class="mr-1 mb-1"
        >
          {{ tag.recommended_tag }}
        </v-chip>
      </div>
    </div>

    <v-row>
      <v-col v-for="task in tasks" :key="`task_${task.id}`" cols="12" sm="4">
        <v-card :id="`id_task_${task.id}`" class="d-flex flex-column" height="100%">
          <v-card-title>
            {{ task.name_ru === '' ? task.name.split('_')[1] : task.name_ru }}
          </v-card-title>
          <v-card-text>
            <div class="mb-2">
              <v-chip :color="getRatingColor(task)" small>
                {{ getRatingText(task) + (task.cf_rating ? ` (${task.cf_rating})` : '') }}
              </v-chip>
            </div>

            <v-chip
              v-for="tag in task.cf_tags_RU"
              :key="tag"
              class="mr-2 mb-2"
              small
            >
              {{ tag }}
            </v-chip>
          </v-card-text>

          <v-divider class="mt-auto" />
          <v-card-actions v-if="$vuetify.breakpoint.xsOnly" class="justify-space-between mx-2">
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn v-on="on" icon color="secondary" @click="setDifficaulty(task, -1)" v-bind="attrs">
                  <v-icon>mdi-arrow-down-bold</v-icon>
                </v-btn>
              </template>
              <span>Пропустить и получить задачу попроще</span>
            </v-tooltip>
            <v-btn :to="getTaskPath(task)" text color="primary">Перейти к задаче</v-btn>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn v-on="on" icon color="secondary" @click="setDifficaulty(task, 1)" v-bind="attrs">
                  <v-icon>mdi-arrow-up-bold</v-icon>
                </v-btn>
              </template>
              <span>Пропустить и получить задачу посложнее</span>
            </v-tooltip>
          </v-card-actions>

          <v-card-actions v-else>
            <v-spacer />
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn v-on="on" icon color="secondary" @click="setDifficaulty(task, -1)" v-bind="attrs">
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
              </template>
              <span>Пропустить и получить задачу попроще</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn v-on="on" :to="getTaskPath(task)" class="mx-2" icon color="primary" v-bind="attrs">
                  <v-icon>mdi-xml</v-icon>
                </v-btn>
              </template>
              <span>Перейти к задаче</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn v-on="on" icon color="secondary" @click="setDifficaulty(task, 1)" v-bind="attrs">
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
              </template>
              <span>Пропустить и получить задачу посложнее</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</v-container>
</template>

<script>
export default {
  name: 'RecommendationsPage',
  props: {
    isAuthorized: Boolean
  },
  data() {
    return {
      loading: true,
      tasks: [],
      tags: []
    };
  },
  computed: {
    topics() {
      return [
        'Топик 1',
        'Топик 2',
        'Топик 3',
        'Топик 4',
        'Топик 5',
        'Топик 6',
        'Топик 7',
        'Топик 8',
        'Топик 9',
        'Топик 10'
      ]
    },
    mobileTopics() {
      return this.topics.map((topic, index) => ({ text: topic, value: index }));
    }
  },
  watch: {
    isAuthorized(value) {
      if (value) {
        return;
      }

      this.$router.push('/');

      this.$emit(
        'show:snackbar',
        { text: 'Для перехода на эту страницу необходимо авторизоваться', color: 'error' }
      );
      this.$emit('show:login-form');
    }
  },
  created() {
    this.loading = true;

    this.$http.get('/recommendations')
      .then(({ data: { rec } }) => {
        rec.forEach(({ recommended_tag, priority, problems }) => {
          this.tags.push({ recommended_tag, priority });
          this.tasks = this.tasks.concat(problems);
        })

        this.tasks = [...new Map(this.tasks.map((task) => [task['id'], task])).values()];
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    getTagColor(tag) {
      const { priority } = tag;
      if (priority === 1) {
        return '#267326';
      }
      if (priority === 2) {
        return '#339933';
      }
      if (priority === 3) {
        return '#40bf40';
      }
      if (priority === 4) {
        return '#66cc66';
      }
      if (priority === 5) {
        return '#8cd98c';
      }
      return 'normal';
    },
    getTaskPath(task) {
      return `/task/${task.id}`;
    },
    getRatingColor(task) {
      const { cf_rating } = task;
      if (cf_rating <= 1200) {
        return 'purple lighten-2';
      }
      if (cf_rating <= 1600) {
        return 'indigo lighten-2';
      }
      if (cf_rating <= 1900) {
        return 'blue lighten-1';
      }
      if (cf_rating <= 2200) {
        return 'green';
      }
      if (cf_rating <= 2500) {
        return 'yellow';
      }
      if (cf_rating <= 2900) {
        return 'orange';
      }
      if (cf_rating <= 3500) {
        return 'red lighten-2';
      }
      return '';
    },
    getRatingText(task) {
      const { cf_rating } = task;
      if (!cf_rating) {
        return 'рейтинг неизвестен';
      }
      if (cf_rating <= 1200) {
        return 'новичок';
      }
      if (cf_rating <= 1600) {
        return 'ученик';
      }
      if (cf_rating <= 1900) {
        return 'эксперт';
      }
      if (cf_rating <= 2200) {
        return 'элита';
      }
      if (cf_rating <= 2500) {
        return 'мастер';
      }
      if (cf_rating <= 2900) {
        return 'гроссмейстер';
      }
      if (cf_rating <= 3500) {
        return 'глобальная элита';
      }
      return '';
    },
    setDifficaulty(task, difficulty) {
      const params = { task_id: task.id, difficulty };

      this.$http.post('/set_difficulty', params).then(() => {
        const index = this.tasks.findIndex((taskToFind) => taskToFind.id === task.id);
        if (index !== -1) {
          const animateClass = difficulty === -1 ? 'animate__bounceOutDown' : 'animate__bounceOutUp';

          const element = document.getElementById(`id_task_${task.id}`);
          element.classList.add('animate__animated', animateClass);
          element.addEventListener('animationend', () => this.tasks.splice(index, 1));
        }

        this.$emit(
          'show:snackbar',
          { text: 'Задача была оценена. Для получения новых рекомендаций обновите страницу', color: 'success' }
        );
      });
    }
  }
}
</script>
