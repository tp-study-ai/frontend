<template>
<v-container class="pa-0">
  <div v-if="tags.length > 0" class="d-flex flex-wrap pt-2 overflow-y-auto menu-card">
    <v-chip
      v-for="tag in tags"
      :key="tag.tags_id"
      :color="tag.color"
      class="mr-1"
      @click="handleTag(tag)"
    >
      {{ tag.tags_ru }}
    </v-chip>
  </div>

  <v-data-table
    :headers="tableHeaders"
    :items="tasks"
    :items-per-page="15"
    :loading="loading"
    hide-default-footer
    no-data-text="Задачи не найдены"
    loading-text="Идет загрузка задач..."
    @update:options="updateOptions"
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
      sort: 'rating_down',
      tasks: [],
      tags: [],
      choosedTags: []
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
    if (this.$route.query.tags) {
      this.choosedTags = this.$route.query.tags.replace('"', '').split(',').map((id) => parseInt(id));
    }

    this.getTags();
    this.getTasks();
  },
  methods: {
    getTags() {
      this.$http
        .get('/get_tags')
        .then(({ data: { tags } }) => {
          this.tags = tags.map((tag) => {
            const color = this.choosedTags.includes(tag.tags_id) ? 'primary' : 'normal';
            return { ...tag, color };
          });
        });
    },
    getTasks() {
      let choosedTagsString = this.choosedTags.join(',');
      if (choosedTagsString !== '""' && !choosedTagsString.includes(',')) {
        choosedTagsString = choosedTagsString + ',';
      }
      choosedTagsString = `"${this.choosedTags}"`;

      const query = { page: this.page, sort: this.sort };
      if (choosedTagsString !== '""') {
        query.tags = choosedTagsString;
      }

      if (query.page !== parseInt(this.$route.query.page) || query.sort !== this.$route.query.sort ||
        query.tags !== this.$route.query.tags) {
        this.$router.push({ path: 'tasks', query });
      }

      this.loading = true;
      const params = { page: this.page - 1, sort: this.sort };
      if (choosedTagsString !== '""') {
        params.tags = choosedTagsString;
      }

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
    updateOptions({ sortDesc }) {
      this.sort = sortDesc[0] ? 'rating_up' : 'rating_down';
      this.getTasks();
    },
    handleTag(tag) {
      if (tag.color === 'normal') {
        tag.color = 'primary';
        this.choosedTags.push(tag.tags_id);
        this.getTasks();
      } else {
        tag.color = 'normal';
        const index = this.choosedTags.indexOf(tag.tags_id);
        if (index !== -1) {
          this.choosedTags.splice(index, 1);
        }
        this.getTasks();
      }
    },
    getTagsByTask(task) {
      if (!task.cf_tags_ID) {
        return '';
      }

      return this.tags
        .filter((tag) => task.cf_tags_ID.includes(tag.tags_id))
        .map((tag) => tag.tags_ru)
        .join(', ');
    }
  }
}
</script>

<style scoped>
.menu-card {
  min-height: 200px;
  max-height: 200px;
}
</style>
