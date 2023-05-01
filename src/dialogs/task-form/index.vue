<template>
<v-dialog
  :value="value"
  :width="this.$vuetify.breakpoint.xsOnly ? '' : '1000'"
  @input="handleInput"
>
  <v-card outlined>
    <div class="d-flex">
      <v-card-title>{{ taskTitle }}</v-card-title>
      <v-btn class="ml-auto my-auto mr-2" icon @click="() => handleInput(false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-card-subtitle>
      <div class="mb-2">
        <v-chip :color="ratingColor" small>
          {{ ratingText + (task.cf_rating ? ` (${task.cf_rating})` : '') }}
        </v-chip>
      </div>

      <v-chip
        v-for="tag in task.cf_tags_RU"
        :key="tag"
        class="mr-2 mb-2"
        small
      >
        {{ tag }}
      </v-chip>
    </v-card-subtitle>

    <v-card-text>
      <vue-mathjax :formula="taskDescription" :safe="false" />
    </v-card-text>

    <v-divider />
    <v-card-actions v-if="$vuetify.breakpoint.xsOnly" class="justify-space-between mx-2">
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn v-on="on" icon color="secondary" @click="setDifficulty(task, -1)" v-bind="attrs">
            <v-icon>mdi-arrow-down-bold</v-icon>
          </v-btn>
        </template>
        <span>Оценить задачу как сложную</span>
      </v-tooltip>
      <v-btn :to="taskPath" text color="primary">Перейти к задаче</v-btn>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn v-on="on" icon color="secondary" @click="setDifficulty(task, 1)" v-bind="attrs">
            <v-icon>mdi-arrow-up-bold</v-icon>
          </v-btn>
        </template>
        <span>Оценить задачу как простую</span>
      </v-tooltip>
    </v-card-actions>

    <v-card-actions v-else>
      <v-spacer />
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn v-on="on" text color="secondary" @click="setDifficulty(task, -1)" v-bind="attrs">
            <span>Проще</span>
              <v-icon right>mdi-arrow-down-bold</v-icon>
          </v-btn>
        </template>
        <span>Оценить задачу как сложную</span>
      </v-tooltip>
      <v-btn :to="taskPath" text color="primary">Перейти к задаче</v-btn>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn v-on="on" text color="secondary" @click="setDifficulty(task, 1)" v-bind="attrs">
            <span>Сложнее</span>
              <v-icon right>mdi-arrow-up-bold</v-icon>
          </v-btn>
        </template>
        <span>Оценить задачу как простую</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import VueMathjax from '@/shared/components/vue-mathjax';

export default {
  name: 'LoginForm',
  props: {
    value: Boolean,
    task: Object
  },
  components: {
    'vue-mathjax': VueMathjax,
  },
  data() {
    return {
      username: null,
      password: null,
      loading: false
    };
  },
  computed: {
    taskTitle() {
      return this.task.name_ru === '' ? this.task.name.split('_')[1] : this.task.name_ru;
    },
    taskDescription() {
      return this.task.task_ru === '' ? this.task.description : this.task.task_ru;
    },
    ratingColor() {
      const { cf_rating } = this.task;
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
    ratingText() {
      const { cf_rating } = this.task;
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
    },
    taskPath() {
      return `/task/${this.task.id}`;
    }
  },
  methods: {
    handleInput(newValue) {
      this.$emit('input', newValue);
    },
    setDifficulty(task, difficulty) {
      this.$emit('set:defficulty', task,difficulty);
    }
  }
}
</script>
