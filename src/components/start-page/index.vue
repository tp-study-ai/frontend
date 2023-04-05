<template>
<div>
  <div v-if="loading">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <v-card v-else :width="this.$vuetify.breakpoint.smAndDown ? '' : '1000'">
    <v-card-title>{{ task.title }}</v-card-title>
    <v-card-text class="card-text">
      <vue-mathjax :formula="task.description" :safe="false" />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn :to="taskPath" text color="primary">Перейти к задаче</v-btn>
      <v-btn text @click="getTask">Пропустить</v-btn>
    </v-card-actions>
  </v-card>
</div>
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
      task: {}
    };
  },
  computed: {
    taskPath() {
      return `/task/${this.task.id}`;
    }
  },
  created() {
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
    }
  }
}
</script>

<style scoped>
.card-text {
  display: -webkit-box;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
