<template>
<v-container class="px-0">
  <div v-if="loading || startDialogShown">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <v-card v-else>
    <v-card-title>{{ task.title }}</v-card-title>
    <v-card-text class="pb-1">
      <vue-mathjax :formula="task.description" :safe="false" />
    </v-card-text>

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn :to="taskPath" text color="primary">Перейти к задаче</v-btn>
      <v-btn text @click="getTask">Пропустить</v-btn>
    </v-card-actions>
  </v-card>

  <v-dialog
    v-model="startDialogShown"
    persistent
    :width="this.$vuetify.breakpoint.smAndDown ? '' : '1000'"
  >
    <v-card>
      <v-card-title>Привет!</v-card-title>
      <v-card-text>
        <p>
          Study AI - это иновационная платформа для обучения алгоритмам. На этой странице тебе будут
          показываться случайные задачи на алгоритмы. По мере прохождения задач специализированная модель
          будет подбирать тебе наиболее подходящие к твоему уровню задачи.
        </p>

        Чтобы начать решать задачи, нажми кнопку "Начать"!
      </v-card-text>

      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="hideStartDialog">Начать</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-container>
</template>

<script>
import { VueMathjax } from 'vue-mathjax';

export default {
  name: 'ColdStartPage',
  components: {
    'vue-mathjax': VueMathjax
  },
  data() {
    return {
      loading: true,
      task: {},
      startDialogShown: false
    };
  },
  computed: {
    taskPath() {
      return `/task/${this.task.id}`;
    }
  },
  created() {
    this.startDialogShown = localStorage.getItem('hideStartDialog') !== 'true';
    this.getTask();
  },
  methods: {
    getTask() {
      this.loading = true;

      this.$http
        .get('/get_task')
        .then(({ data }) => {
          let description = data.task_ru === '' ? data.description : data.task_ru;
          description = description.replaceAll('$$$', '$');
          description = description.replaceAll(String.fromCharCode(92,92), String.fromCharCode(92));

          this.task = {
            id: data.id,
            title: data.name,
            description
          };
        })
        .finally(() => {
          this.loading = false;
        });
    },
    hideStartDialog() {
      this.startDialogShown = false;
      localStorage.setItem('hideStartDialog', 'true');
    }
  }
}
</script>
