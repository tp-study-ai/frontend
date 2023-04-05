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
            <th>Рейтинг</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>
              <router-link :to="getTaskPath(task)">{{ task.name }}</router-link>
            </td>
            <td>{{ task.difficulty - 6 }}</td>
            <td>{{ task.cf_rating }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-container>

    <v-card v-else width="1000">
      <v-tabs v-model="selected" vertical background-color="primary" dark>
        <v-tab v-for="(topic, id) in topics" :key="id">{{ topic }}</v-tab>

        <v-tab-item v-for="(topic, id) in topics" :key="id">
          <v-simple-table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Сложность</th>
                <th>Рейтинг</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="task in tasks" :key="task.id">
                <td>
                  <router-link :to="getTaskPath(task)">{{ task.name }}</router-link>
                </td>
                <td>{{ task.difficulty - 6 }}</td>
                <td>{{ task.cf_rating }}</td>
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
  name: 'RecommendationsPage',
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
        'Топик 1',
        'Топик 2',
        'Топик 3',
        'Топик 4',
        'Топик 5',
        'Топик 6',
        'Топик 7',
        'Топик 8',
        'Топик 9',
        'Топик 10'
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
    this.loading = true;
    this.getTasks();
  },
  methods: {
    getTasks() {
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