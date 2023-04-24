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
          v-for="tag in tags"
          :key="tag.tags_id"
          :color="tag.color"
          class="mr-1 mb-1"
          @click="handleTag(tag)"
        >
          {{ tag.tags_ru }}
        </v-chip>
      </div>
    </div>

    <v-row>
      <v-col v-for="task in tasks" :key="task.id" cols="12" sm="4">
        <v-card :to="getTaskPath(task)" height="100%">
          <v-card-title>
            {{ task.name_ru === '' ? task.name.split('_')[1] : task.name_ru }}
          </v-card-title>
          <v-card-subtitle>
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
          </v-card-subtitle>
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
      selected: 0,
      tasks: [],
      tags: [],
      choosedTags: []
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
    selected() {
      this.getTasks();
    },
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

    this.getTags();
    this.getTasks();
  },
  methods: {
    getTags() {
      this.$http
        .get('/get_tags')
        .then(({ data: { tags } }) => {
          this.tags = tags.map((tag) => {
            const color = this.choosedTags.includes(tag.tags_id) ? 'primary' : 'normal';
            return { ...tag, color };
          });
        });
    },
    getTasks() {
      const params = { page: this.selected };

      this.$http
        .get('/tasks_list', { params })
        .then(({ data: { tasks } }) => {
          this.tasks = tasks;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleTag(tag) {
      this.page = 1;

      if (tag.color === 'normal') {
        tag.color = 'primary';
        this.choosedTags.push(tag.tags_id);
        this.getTasks();
      } else {
        tag.color = 'normal';
        const index = this.choosedTags.indexOf(tag.tags_id);
        if (index !== -1) {
          this.choosedTags.splice(index, 1);
        }
        this.getTasks();
      }
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
    }
  }
}
</script>
