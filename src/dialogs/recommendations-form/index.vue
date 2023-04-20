<template>
<v-dialog
  :value="value"
  :width="this.$vuetify.breakpoint.smAndDown ? '' : '1200'"
  persistent
  @input="handleInput"
>
  <v-card>
    <div class="d-flex">
      <v-card-title>Поздравляем c решением задачи!</v-card-title>
      <v-btn class="ml-auto my-auto mr-2" icon @click="() => handleInput(false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-card-text>
      Мы посмотрели на твой код и количество попыток и подобрали самые близкие задачи
    </v-card-text>

    <v-progress-circular
      v-if="loading"
      class="d-flex align-center mx-auto my-10"
      indeterminate
      color="primary"
    />

    <v-row v-else class="mx-1 mb-1">
      <v-col v-for="task in tasks" :key="task.id" cols="12" md="4">
        <v-card :href="getTaskPath(task)">
          <v-card-title>{{ task.name }}</v-card-title>
          <v-card-subtitle>
            <div class="mb-2">
              <v-chip :color="getRatingColor(task)" small>
                {{ `${getRatingText(task)} (${task.cf_rating})` }}
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

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn text to="/">Вернуться на главную</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: 'RecommendationsForm',
  props: {
    value: Boolean,
    code: String,
    difficulty: Number,
    task: Object
  },
  data() {
    return {
      loading: true,
      tasks: []
    };
  },
  watch: {
    value(newValue) {
      if (!newValue) {
        return;
      }

      this.loading = true;
      const link = this.task.link.replace('https://codeforces.com', '');
      const params = {
        source_code: this.code, problem_url: link,
        rating: this.task.rating, difficulty: this.difficulty
      };

      this.$http
        .post('/get_similar', params)
        .then(({ data: { tasks } }) => {
          this.tasks = tasks.filter((_, index) => index < 6);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  methods: {
    handleInput(newValue) {
      this.$emit('input', newValue);
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
