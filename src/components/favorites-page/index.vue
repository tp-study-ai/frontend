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
        <td>
          <v-chip :color="getRatingColor(item)" small>
            {{ `${getRatingText(item)} (${item.cf_rating})` }}
          </v-chip>
        </td>
        <td>
          <v-btn icon color="error" @click="showDialog(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>

  <v-dialog
    v-model="dialogShown"
    :width="this.$vuetify.breakpoint.smAndDown ? '' : '1000'"
  >
    <v-card>
      <div class="d-flex">
        <v-card-title>
          Вы действительно хотите удалить задачу {{ taskToRemove.name }} из избранного?
        </v-card-title>
        <v-btn class="ml-auto my-auto mr-2" icon @click="dialogShown = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-actions>
        <v-spacer />

        <v-btn
          :loading="deleteLoading"
          text
          color="error"
          @click="deleteLike"
        >
          Убрать
        </v-btn>
        <v-btn
          :loading="deleteLoading"
          text
          @click="dialogShown = false"
        >
          Отмена
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-container>
</template>

<script>
export default {
  name: 'FavouritesPage',
  props: {
    isAuthorized: Boolean
  },
  data() {
    return {
      loading: true,
      tasks: [],
      dialogShown: false,
      taskToRemove: {},
      deleteLoading: false
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
          sortable: false
        },
        {
          text: 'Удалить',
          sortable: false
        }
      ];
    }
  },
  watch: {
    isAuthorized(value) {
      if (value) {
        return;
      }

      this.$router.push('/');

      this.$emit(
        'show:snackbar',
        { text: 'Для перехода на эту страницу необходимо авторизоваться', color: 'error' }
      );
      this.$emit('show:login-form');
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
    },
    showDialog(task) {
      this.dialogShown = true;
      this.taskToRemove = task;
    },
    deleteLike() {
      const params = { task_id: this.taskToRemove.id };

      this.$http.post('/delete_like', params)
        .then(() => {
          const index = this.tasks.indexOf(this.taskToRemove);
          if (index !== -1) {
            this.tasks.splice(index, 1);
          }

          this.$emit('show:snackbar', { text: 'Задача удалена из избранного', color: 'success' });
        })
        .finally(() => {
          this.dialogShown = false;
        });
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
