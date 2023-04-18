<template>
<v-container class="px-0">
  <v-card :loading="loading">
    <div :class="{ 'd-flex align-center': $vuetify.breakpoint.mdAndUp }">
      <v-card-title>{{ task.title }}</v-card-title>

      <v-divider v-if="$vuetify.breakpoint.smAndDown" />
      <v-btn :to="taskPath" class="ml-auto" text color="primary">Перейти к задаче</v-btn>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn
            v-on="on"
            class="ml-2 mr-4"
            text
            color="secondary"
            @click="getTask"
            v-bind="attrs"
          >
            Пропустить
          </v-btn>
        </template>
        <span>Пропустить задачу и получить следующую</span>
      </v-tooltip>
    </div>
    <v-divider />

    <v-card :class="{ 'card': $vuetify.breakpoint.mdAndUp }" class="overflow-y-auto" flat>
      <v-card-subtitle>
        <div class="mb-2">
          <v-chip :color="ratingColor" small>{{ ratingText }}</v-chip>
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

  <onboarding-form v-model="dialogShown" />
</v-container>
</template>

<script>
import OnboardingForm from '@/dialogs/onboarding-form';
import VueMathjax from '@/shared/components/vue-mathjax';

export default {
  name: 'ColdStartPage',
  props: {
    isAuthorized: Boolean
  },
  components: {
    'vue-mathjax': VueMathjax,
    OnboardingForm
  },
  data() {
    return {
      loading: true,
      task: {},
      dialogShown: false
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
        return 'red lighten-1';
      }
      return '';
    },
    ratingText() {
      const { cf_rating } = this.task;
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
  },
  created() {
    this.dialogShown = localStorage.getItem('hideStartDialog') !== 'true' && !this.isAuthorized;
    this.getTask();
  },
  methods: {
    getTask() {
      this.loading = true;

      this.$http
        .get('/get_task')
        .then(({ data }) => {
          const description = data.task_ru === '' ? data.description : data.task_ru;

          this.task = {
            id: data.id,
            title: data.name,
            description,
            cf_rating: data.cf_rating,
            cf_tags_RU: data.cf_tags_RU
          };
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
}
</script>

<style scoped>
.card {
  max-height: 75vh;
}
</style>
