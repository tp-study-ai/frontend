<template>
<v-container class="px-0">
  <div v-if="loading || dialogShown" class="d-flex justify-center">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <v-card v-else>
    <v-card-title>{{ task.title }}</v-card-title>
    <v-card-text>
      <vue-mathjax :formula="task.description" :safe="false" />
    </v-card-text>

    <v-divider />
    <v-card-actions>
      <v-spacer />

      <v-btn :to="taskPath" text color="primary">Перейти к задаче</v-btn>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn
            v-on="on"
            text
            color="secondary"
            @click="getTask"
            v-bind="attrs"
          >
            Пропустить
          </v-btn>
        </template>
        <span>Пропустить задачу и перейти к следующей</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>

  <onboarding-form v-model="dialogShown" />
</v-container>
</template>

<script>
import OnboardingForm from '@/dialogs/onboarding-form';
import VueMathjax from '@/shared/components/vue-mathjax';

export default {
  name: 'ColdStartPage',
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
    }
  },
  created() {
    this.dialogShown = localStorage.getItem('hideStartDialog') !== 'true';
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
            description
          };
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
}
</script>
