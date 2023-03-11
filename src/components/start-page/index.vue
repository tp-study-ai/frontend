<template>
<div>
  <v-card v-if="loading">
    <v-card-title>Подбираем задачу для вас...</v-card-title>
    <v-progress-linear indeterminate />
  </v-card>

  <v-card v-else>
    <v-card-title>{{ task.title }}</v-card-title>
    <v-card-text class="pb-0" v-html="task.description" />

    <v-card-actions>
      <v-spacer />
      <v-btn :to="taskPath" color="primary">Перейти к задаче</v-btn>
      <v-btn @click="sendFakeRequst">Пропустить</v-btn>
    </v-card-actions>
  </v-card>
</div>
</template>

<script>
export default {
  name: 'ColdStartPage',
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
    this.sendFakeRequst();
  },
  methods: {
    sendFakeRequst() {
      this.loading = true;

      setTimeout(() => {
        this.loading = false;

        this.task = {
          id: 1,
          title: '1. Two Sum',
          description: `
            <p>Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.</p>
            <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
            <p>You can return the answer in any order.</p>
          `
        };
      }, 300);
    }
  }
}
</script>
