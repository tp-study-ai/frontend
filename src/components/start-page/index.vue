<template>
<div>
  <div v-if="loading">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <v-card v-else>
    <v-card-title>{{ task.title }}</v-card-title>
    <v-card-text class="pb-0">
      <vue-mathjax :formula="task.description" :safe="false" />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn :to="taskPath" color="primary">Перейти к задаче</v-btn>
      <v-btn @click="getTask">Пропустить</v-btn>
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
