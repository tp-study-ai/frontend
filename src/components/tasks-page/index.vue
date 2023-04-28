<template>
<v-container>
  <div class="text-h4 mb-2">Все задачи</div>

  <div v-if="tags.length > 0">
    <div class="text-subtitle-1">Теги для поиска</div>
    <div class="d-flex flex-wrap pt-2 overflow-y-auto menu-card">
      <v-chip
        v-for="tag in tags"
        :key="tag.tags_id"
        :color="tag.color"
        class="mr-1 mb-1"
        @click="handleTag(tag)"
      >
        {{ tag.tags_ru }}
      </v-chip>
    </div>
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
      <v-card v-if="isMobile" class="mb-4" :to="getTaskPath(item)">
        <v-card-title>
          {{ item.name_ru === '' ? item.name.split('_')[1] : item.name_ru }}
        </v-card-title>
        <v-card-subtitle>
          <div class="mb-2">
            <v-chip :color="getRatingColor(item)" small>
              {{ getRatingText(item) + (item.cf_rating ? ` (${item.cf_rating})` : '') }}
            </v-chip>
          </div>

          <v-chip
            v-for="tag in item.cf_tags_RU"
            :key="tag"
            class="mr-2 mb-2"
            small
          >
            {{ tag }}
          </v-chip>
        </v-card-subtitle>
      </v-card>

      <tr v-else>
        <td>
          <router-link :to="getTaskPath(item)">
            {{ item.name_ru === '' ? item.name.split('_')[1] : item.name_ru }}
          </router-link>
        </td>
        <td>{{ getTagsByTask(item) }}</td>
        <td>
          <v-chip :color="getRatingColor(item)" small>
            {{ getRatingText(item) + (item.cf_rating ? ` (${item.cf_rating})` : '') }}
          </v-chip>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-pagination v-model="page" :length="paginationLength" @input="getTasks" />
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
      paginationLength: 0,
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
          text: 'Рейтинг',
          sortable: true
        }
      ];
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
      this.choosedTags = this.$route.query.tags.split(',').map((id) => parseInt(id));
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

      const query = { page: this.page, sort: this.sort };
      if (choosedTagsString !== '') {
        query.tags = choosedTagsString;
      }

      if (query.page !== parseInt(this.$route.query.page) || query.sort !== this.$route.query.sort ||
        query.tags !== this.$route.query.tags) {
        this.$router.push({ path: 'tasks', query });
      }

      this.loading = true;
      const params = { page: this.page - 1, sort: this.sort };
      if (choosedTagsString !== '') {
        params.tags = choosedTagsString;
      }

      this.$http
        .get('/tasks_list', { params })
        .then(({ data: { tasks, task_count } }) => {
          this.tasks = tasks;
          this.paginationLength = Math.ceil(task_count / 15);
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
      this.page = 1;

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
      if (!task.cf_tags_RU) {
        return '';
      }

      return task.cf_tags_RU.join(', ');
    },
    getRatingColor(task) {
      const { cf_rating } = task;
      if (cf_rating <= 1200) {
        return 'purple lighten-2';
      }
      if (cf_rating <= 1600) {
        return 'indigo lighten-2';
      }
      if (cf_rating <= 1900) {
        return 'blue lighten-1';
      }
      if (cf_rating <= 2200) {
        return 'green';
      }
      if (cf_rating <= 2500) {
        return 'yellow';
      }
      if (cf_rating <= 2900) {
        return 'orange';
      }
      if (cf_rating <= 3500) {
        return 'red lighten-2';
      }
      return '';
    },
    getRatingText(task) {
      const { cf_rating } = task;
      if (!cf_rating) {
        return 'рейтинг неизвестен';
      }
      if (cf_rating <= 1200) {
        return 'новичок';
      }
      if (cf_rating <= 1600) {
        return 'ученик';
      }
      if (cf_rating <= 1900) {
        return 'эксперт';
      }
      if (cf_rating <= 2200) {
        return 'элита';
      }
      if (cf_rating <= 2500) {
        return 'мастер';
      }
      if (cf_rating <= 2900) {
        return 'гроссмейстер';
      }
      if (cf_rating <= 3500) {
        return 'глобальная элита';
      }
      return '';
    }
  }
}
</script>

<style>
/* Используется еще на странице рекомендаций */
.menu-card {
  min-height: 120px;
  max-height: 120px;
}
</style>
