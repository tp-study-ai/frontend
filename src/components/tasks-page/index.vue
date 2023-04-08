<template>
<v-container class="pa-0">
  <v-data-table
    :headers="tableHeaders"
    :items="tasks"
    :items-per-page="15"
    :loading="loading"
    hide-default-footer
    @update:sort-desc="updateSorting"
  >
    <template #item="{ item, isMobile }">
      <v-card v-if="isMobile" class="mb-4">
        <v-card-title>{{ item.name }}</v-card-title>
        <v-card-text>
          <div>Сложность: {{ item.difficulty }}</div>
          <div>Рейтинг: {{ item.cf_rating - 6 }}</div>
        </v-card-text>

        <v-card-actions>
          <v-btn :to="getTaskPath(item)" text color="primary">Перейти</v-btn>
        </v-card-actions>
      </v-card>

      <tr v-else>
        <td>
          <router-link :to="getTaskPath(item)">{{ item.name }}</router-link>
        </td>
        <td>{{ item.difficulty }}</td>
        <td>{{ item.cf_rating - 6 }}</td>
      </tr>
    </template>
  </v-data-table>

  <v-pagination v-model="page" :length="522" />
</v-container>
</template>

<script>
export default {
  name: 'TasksPage',
  data() {
    return {
      loading: true,
      page: 1,
      sort: 'rating_up',
      tasks: []
    };
  },
  computed: {
    tableHeaders() {
      return [
        {
          text: 'Название',
          sortable: false
        },
        {
          text: 'Сложность',
          sortable: false
        },
        {
          text: 'Рейтинг',
          sortable: true
        }
      ];
    }
  },
  watch: {
    page() {
      this.getTasks();
    }
  },
  created() {
    if (this.$route.query.page) {
      this.page = parseInt(this.$route.query.page);
    }
    if (this.$route.query.sort) {
      this.sort = this.$route.query.sort;
    }
    this.getTasks();
  },
  methods: {
    getTasks() {
      const query = {};
      if (this.$route.query.page !== this.page.toString()) {
        query.page = this.page;
      }
      if (this.$route.query.sort !== this.sort) {
        query.sort = this.sort;
      }

      if (Object.keys(query).length > 0) {
        this.$router.push({ path: 'tasks', query });
      }

      this.loading = true;
      const params = { page: this.page - 1, sort: this.sort };

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
    },
    updateSorting(sorting) {
      this.sort = sorting ? 'rating_down' : 'sorting_up';
      this.getTasks();
    }
  }
}
</script>
