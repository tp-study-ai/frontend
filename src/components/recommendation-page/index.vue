<template>
<div>
  <div v-if="loading">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <div v-else>
    <v-container class="px-0" fluid v-if="$vuetify.breakpoint.smAndDown">
      <v-select
        v-model="selected"
        :items="mobileTopics"
        label="Выберите топик"
        outlined
        dense
        hide-details
      />

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
    </v-container>

    <v-card v-else width="1000">
      <v-tabs v-model="selected" vertical>
        <v-tab v-for="(topic, id) in topics" :key="id">{{ topic }}</v-tab>

        <v-tab-item v-for="(topic, id) in topics" :key="id">
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
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</div>
</template>

<script>
export default {
  name: 'RecommendationPage',
  data() {
    return {
      loading: true,
      selected: 0,
      tasks: []
    };
  },
  computed: {
    topics() {
      return [
        'Пример 1',
        'Пример 2',
        'Пример 3',
        'Пример 4',
        'Пример 5',
        'Пример 6',
        'Пример 7',
        'Пример 8',
        'Пример 9',
        'Пример 10'
      ]
    },
    mobileTopics() {
      return this.topics.map((topic, index) => ({ text: topic, value: index }));
    }
  },
  watch: {
    selected() {
      this.getTasks();
    }
  },
  created() {
    this.getTasks();
  },
  methods: {
    getTasks() {
      this.loading = true;
      const params = { page: this.selected };

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
