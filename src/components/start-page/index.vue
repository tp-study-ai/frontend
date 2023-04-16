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
        <v-tooltip v-for="tag in task.cf_tags_RU" :key="tag" top>
          <template #activator="{ on, attrs }">
            <v-chip
              v-on="on"
              :to="getTagPath(tag)"
              class="mr-2 mb-2"
              small
              v-bind="attrs"
            >
              {{ tag }}
            </v-chip>
          </template>
          <span>Перейти к задачам по тегу {{ tag }}</span>
        </v-tooltip>
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
            cf_tags_RU: data.cf_tags_RU,
            cf_tags_ID: data.cf_tags_ID
          };
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getTagPath(tag) {
      const index = this.task.cf_tags_RU.indexOf(tag);
      if (index === -1) {
        return '';
      }

      const id = this.task.cf_tags_ID[index];
      return `/tasks?tags=${id}`;
    },
  }
}
</script>

<style scoped>
.card {
  max-height: 75vh;
}
</style>
