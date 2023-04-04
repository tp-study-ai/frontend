<template>
<div>
  <div v-if="loading">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <div v-else>
    <v-simple-table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Сложность</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>
            <router-link :to="getTaskPath(task)">{{ task.name }}</router-link>
          </td>
          <td>{{ task.difficulty }}</td>
        </tr>
      </tbody>
    </v-simple-table>

    <v-pagination v-model="page" :total-visible="totalLength" :length="100" />
  </div>
</div>
</template>

<script>
export default {
  name: 'TasksPage',
  data() {
    return {
      loading: false,
      page: 1,
      tasks: []
    };
  },
  computed: {
    totalLength() {
      if (this.$vuetify.breakpoint.xsAndDown) {
        return 7;
      }
      if (this.$vuetify.breakpoint.smAndDown) {
        return 15;
      }
      return 20;
    }
  },
  watch: {
    page() {
      this.getTasks();
    }
  },
  created() {
    this.getTasks();
  },
  methods: {
    getTasks() {
      if (this.loading) {
        return;
      }

      this.loading = true;
      const params = { page: this.page - 1 };

      this.$http
        .get('/tasks_list', { params })
        .then(({ data: { tasks } }) => {
          this.tasks = tasks;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getTaskPath(task) {
      return `/task/${task.id}`;
    }
  }
}
</script>
