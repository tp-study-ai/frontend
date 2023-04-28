<template>
<v-container>
  <div v-if="loading" class="d-flex justify-center">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <div v-else>
    <div class="text-h4 mb-2">Задачи для вас</div>

    <div v-if="tags.length > 0" class="mb-4">
      <div class="text-subtitle-1">
        Теги для прокачки
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" class="ml-1" icon small v-on="on">
              <v-icon>mdi-comment-question-outline</v-icon>
            </v-btn>
          </template>
          <span>Зеленый цвет - наиболее приоритетный тег, серый цвет - наименее приоритетный тег</span>
        </v-tooltip>
      </div>

      <div class="d-flex flex-wrap pt-2 overflow-y-auto menu-card">
        <v-chip
          v-for="(tag, index) in tags"
          :key="`tag_${index}`"
          :color="getTagColor(tag)"
          class="mr-1 mb-1"
          @click="handleTag(tag)"
        >
          {{ tag.recommended_tag }}
        </v-chip>
      </div>
    </div>

    <v-row v-if="tasks.length > 0">
      <v-col v-for="task in tasks" :key="`task_${task.id}`" cols="12" sm="4">
        <v-card :id="`id_task_${task.id}`" class="d-flex flex-column" height="100%">
          <div class="d-flex">
            <v-card-title>{{ task.name_ru === '' ? task.name.split('_')[1] : task.name_ru }}</v-card-title>
            <v-btn class="ml-auto my-auto mr-2" icon @click="() => showTaskForm(task)">
              <v-icon>mdi-arrow-expand</v-icon>
            </v-btn>
          </div>
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
                <v-btn v-on="on" icon color="secondary" @click="setDifficulty(task, -1)" v-bind="attrs">
                  <v-icon>mdi-arrow-down-bold</v-icon>
                </v-btn>
              </template>
              <span>Оценить задачу как простую</span>
            </v-tooltip>
            <v-btn :to="getTaskPath(task)" text color="primary">Перейти к задаче</v-btn>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn v-on="on" icon color="secondary" @click="setDifficulty(task, 1)" v-bind="attrs">
                  <v-icon>mdi-arrow-up-bold</v-icon>
                </v-btn>
              </template>
              <span>Оценить задачу как сложную</span>
            </v-tooltip>
          </v-card-actions>

          <v-card-actions v-else>
            <v-spacer />
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn v-on="on" icon color="secondary" @click="setDifficulty(task, -1)" v-bind="attrs">
                  <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
              </template>
              <span>Оценить задачу как простую</span>
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
                <v-btn v-on="on" icon color="secondary" @click="setDifficulty(task, 1)" v-bind="attrs">
                  <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
              </template>
              <span>Оценить задачу как сложную</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <div v-else class="text-subtitle-1">Рекомендаций пока для вас нет. Заходите позже!</div>

    <task-form v-model="taskFormShown" :task="taskToShow" @set:defficulty="setDifficulty" />
  </div>
</v-container>
</template>

<script>
import TaskForm from '@/dialogs/task-form';

export default {
  name: 'RecommendationsPage',
  props: {
    isAuthorized: Boolean
  },
  components: {
    TaskForm
  },
  data() {
    return {
      loading: true,
      tasks: [],
      tags: [],
      allTasks: [],
      choosedTags: [],
      taskFormShown: false,
      taskToShow: {}
    };
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
        });

        this.tasks = [...new Map(this.tasks.map((task) => [task['id'], task])).values()];
        this.allTasks = this.tasks.slice();
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    getTagColor(tag) {
      if (tag.color) {
        return tag.color;
      }

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
    handleTag(tag) {
      if (tag.color === 'primary') {
        this.$delete(tag, 'color');
        const index = this.choosedTags.indexOf(tag.recommended_tag);
        if (index !== -1) {
          this.choosedTags.splice(index, 1);
        }
      } else {
        this.$set(tag, 'color', 'primary');
        this.choosedTags.push(tag.recommended_tag);
      }

      if (this.choosedTags.length === 0) {
        this.tasks = this.allTasks.slice();
        return;
      }

      this.tasks = this.allTasks.filter((task) => {
        return task.cf_tags_RU.some((name) => this.choosedTags.includes(name));
      });
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
    setDifficulty(task, difficulty) {
      this.taskFormShown = false;
      const params = { task_id: task.id, difficulty };

      this.$http.post('/set_difficulty', params).then(() => {
        const index = this.tasks.findIndex((taskToFind) => taskToFind.id === task.id);
        if (index === -1) {
          return;
        }

        const animateClass = difficulty === -1 ? 'animate__bounceOutDown' : 'animate__bounceOutUp';

        const element = document.getElementById(`id_task_${task.id}`);
        element.classList.add('animate__animated', animateClass);
        element.addEventListener('animationend', () => {
          this.tasks.splice(index, 1);

          if (this.tasks.length === 0) {
            this.$router.go();
            return;
          }

          this.$emit(
            'show:snackbar',
            { text: 'Задача была оценена. Для получения новых рекомендаций обновите страницу', color: 'success' }
          );
        });
      });
    },
    showTaskForm(task) {
      this.taskFormShown = true;
      this.taskToShow = task;
    }
  }
}
</script>
