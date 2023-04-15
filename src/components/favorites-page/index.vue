<template>
<v-container class="px-0">
  <div class="text-h4 mb-2">Избранное</div>

  <v-data-table
    :headers="tableHeaders"
    :items="tasks"
    :items-per-page="15"
    :loading="loading"
    hide-default-footer
    no-data-text="Задачи не найдены"
    loading-text="Идет загрузка задач..."
  >
    <template #item="{ item, isMobile }">
      <v-card v-if="isMobile" class="mb-4">
        <v-card-title>{{ item.name }}</v-card-title>
        <v-card-text>
          <div>Теги: {{ getTagsByTask(item) }}</div>
          <div>Сложность: {{ item.difficulty - 6 }}</div>
          <div>Рейтинг: {{ item.cf_rating }}</div>
        </v-card-text>

        <v-card-actions>
          <v-btn :to="getTaskPath(item)" text color="primary">Перейти</v-btn>
        </v-card-actions>
      </v-card>

      <tr v-else>
        <td>
          <router-link :to="getTaskPath(item)">{{ item.name }}</router-link>
        </td>
        <td>{{ getTagsByTask(item) }}</td>
        <td>{{ item.difficulty - 6 }}</td>
        <td>{{ item.cf_rating }}</td>
      </tr>
    </template>
  </v-data-table>
</v-container>
</template>

<script>
export default {
  name: 'FavouritesPage',
  data() {
    return {
      loading: true,
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
          text: 'Теги',
          sortable: false
        },
        {
          text: 'Сложность',
          sortable: false
        },
        {
          text: 'Рейтинг',
          sortable: false
        }
      ];
    }
  },
  created() {
    this.$http
      .get('/get_like_tasks')
      .then(({ data: { tasks } }) => {
        this.tasks = tasks ? tasks : [];
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    getTaskPath(task) {
      return `/task/${task.id}`;
    },
    getTagsByTask(task) {
      if (!task.cf_tags_RU) {
        return '';
      }

      return task.cf_tags_RU.join(', ');
    }
  }
}
</script>
