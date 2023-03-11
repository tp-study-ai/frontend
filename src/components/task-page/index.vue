<template>
<div>
  <v-card v-if="loading">

  </v-card>

  <div v-else>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>{{ task.title }}</v-card-title>
          <v-card-text v-html="task.description" />
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title>{{ task.title }}</v-card-title>
          <v-card-text v-html="task.description" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</div>
</template>

<script>
export default {
  name: 'TaskPage',
  data() {
    return {
      loading: false,
      task: {}
    };
  },
  created() {
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
  },
}
</script>
