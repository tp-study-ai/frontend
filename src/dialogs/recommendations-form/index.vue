<template>
<v-dialog :value="value" persistent @input="handleInput">
  <v-card>
    <div class="d-flex">
      <v-card-title>Поздравляем c решением задачи!</v-card-title>
      <v-btn class="ml-auto my-auto mr-2" icon @click="() => handleInput(false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-card-text>Мы подготовили для вас ряд аналогичных задач по этой теме</v-card-text>

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
          <v-card-text class="card-text pb-1">
            {{ task.description }}
          </v-card-text>
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
    value: Boolean
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
      const params = { page: 0 };

      this.$http
        .get('/tasks_list', { params })
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
    }
  }
}
</script>

<style scoped>
.card-text {
  display: -webkit-box;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
