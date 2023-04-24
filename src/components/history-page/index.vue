<template>
<v-container class="pa-0">
  <div class="text-h4 mb-2">История</div>

  <v-radio-group v-model="taskStatus" label="Статус">
    <v-radio label="Решена" value="solved" />
    <v-radio label="В процессе" value="started" />
  </v-radio-group>

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
</v-container>
</template>

<script>
export default {
  name: 'HistoryPage',
  props: {
    isAuthorized: Boolean
  },
  data() {
    return {
      loading: true,
      tasks: [],
      taskStatus: 'solved'
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
    },
    taskStatus(value) {
      this.loading = true;
      const url = value === 'solved' ? '/get_done_task' : '/get_not_done_task';

      this.$http
        .get(url)
        .then(({ data: { done_task } }) => {
          this.tasks = done_task ? done_task : [];
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  created() {
    this.$http
      .get('/get_done_task')
      .then(({ data: { done_task } }) => {
        this.tasks = done_task ? done_task : [];
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
