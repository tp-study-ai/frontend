<template>
<v-container>
  <div v-if="loading" class="d-flex justify-center">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <div v-else>
    <v-card outlined>
      <div :class="{ 'd-flex align-center': $vuetify.breakpoint.smAndUp }">
        <v-card-title>{{ task.title }}</v-card-title>

        <v-divider v-if="$vuetify.breakpoint.xsOnly" />
        <div v-if="$vuetify.breakpoint.xsOnly" class="d-flex justify-space-between mx-2">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn v-on="on" icon color="secondary" @click="setDifficulty(task, 1)" v-bind="attrs">
                <v-icon>mdi-arrow-down-bold</v-icon>
              </v-btn>
            </template>
            <span>Пропустить и получить задачу попроще</span>
          </v-tooltip>
          <v-btn :to="taskPath" text color="primary">Перейти к задаче</v-btn>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn v-on="on" icon color="secondary" @click="setDifficulty(task, -1)" v-bind="attrs">
                <v-icon>mdi-arrow-up-bold</v-icon>
              </v-btn>
            </template>
            <span>Пропустить и получить задачу посложнее</span>
          </v-tooltip>
        </div>

        <div v-else class="ml-auto">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn v-on="on" text color="secondary" @click="setDifficulty(task, 1)" v-bind="attrs">
                <span>Проще</span>
                <v-icon right>mdi-arrow-down-bold</v-icon>
              </v-btn>
            </template>
            <span>Пропустить и получить задачу попроще</span>
          </v-tooltip>
          <v-btn :to="taskPath" text color="primary">Перейти к задаче</v-btn>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn
                v-on="on"
                class="mr-4"
                text
                color="secondary"
                @click="setDifficulty(task, -1)"
                v-bind="attrs"
              >
                <span>Сложнее</span>
                <v-icon right>mdi-arrow-up-bold</v-icon>
              </v-btn>
            </template>
            <span>Пропустить и получить задачу посложнее</span>
          </v-tooltip>
        </div>
      </div>
      <v-divider />

      <v-card :class="{ 'card': $vuetify.breakpoint.mdAndUp }" class="overflow-y-auto" flat>
        <v-card-subtitle>
          <div class="mb-2">
            <v-chip :color="ratingColor" small>
              {{ ratingText + (task.cf_rating ? ` (${task.cf_rating})` : '') }}
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

        <v-card-text>
          <vue-mathjax :formula="task.description" :safe="false" />
        </v-card-text>
      </v-card>
    </v-card>

    <v-card class="mt-4" outlined>
      <v-card-title>
        Прогресс решения
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" class="ml-1" icon small v-on="on">
              <v-icon>mdi-comment-question-outline</v-icon>
            </v-btn>
          </template>
          <span>Для начала использования рекомендаций необходимо решить 10 задач по разным темам</span>
        </v-tooltip>
      </v-card-title>
      <v-progress-linear :value="progressLength" height="20">
        <template #default="{ value }">
          {{ value }}%
        </template>
      </v-progress-linear>
    </v-card>
  </div>
</v-container>
</template>

<script>
import VueMathjax from '@/shared/components/vue-mathjax';

export default {
  name: 'ColdStartPage',
  props: {
    isAuthorized: Boolean,
    isColdStartPassed: Boolean
  },
  components: {
    'vue-mathjax': VueMathjax
  },
  data() {
    return {
      loading: true,
      task: {},
      progress: []
    };
  },
  computed: {
    taskPath() {
      return `/task/${this.task.id}`;
    },
    ratingColor() {
      const { cf_rating } = this.task;
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
    ratingText() {
      const { cf_rating } = this.task;
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
    progressLength() {
      return (this.progress.filter(({ done }) => done).length / this.progress.length) * 100;
    }
  },
  created() {
    this.getTask();
  },
  methods: {
    getTask() {
      this.loading = true;

      this.$http
        .get('/cold_start')
        .then(({ data: { task, progress, finished } }) => {
          const description = task.task_ru === '' ? task.description : task.task_ru;
          const title = task.name_ru === '' ? task.name.split('_')[1] : task.name_ru;

          this.task = {
            id: task.id,
            title,
            description,
            cf_rating: task.cf_rating,
            cf_tags_RU: task.cf_tags_RU
          };

          this.progress = progress;
          this.$nextTick(() => {
            if (!finished) {
              return;
            }

            this.$router.push('/recommendations');
            this.$emit('update:cold-start');
          });
        })
        .catch(() => {
          if (!this.isAuthorized) {
            this.$router.push('/about');
            return;
          }
          if (this.isColdStartPassed) {
            this.$router.push('/recommendations');
            return;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setDifficulty(task, difficulty) {
      if (!this.isAuthorized) {
        this.$emit(
          'show:snackbar',
          { text: 'Для совершения этого действия необходимо авторизоваться', color: 'warning' }
        );
        this.$emit('show:login-form');
        return;
      }

      this.loading = true;
      const params = { task_id: task.id, difficulty };

      this.$http.post('/set_difficulty', params).then(() => {
        this.getTask();
        this.$emit('show:snackbar', { text: 'Задача была оценена', color: 'success' });
      });
    }
  }
}
</script>

<style scoped>
.card {
  max-height: 70vh;
}
</style>
