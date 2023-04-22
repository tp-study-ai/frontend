<template>
<v-container class="px-0">
  <div class="text-h4 mb-2">Профиль</div>

  <v-card class="mb-4">
    <v-card-text class="pb-0">
      <v-form ref="form">
        <v-text-field
          v-model="username"
          :rules="rules"
          outlined
          dense
          type="text"
          label="Введите логин"
        />
        <v-text-field
          v-model="password"
          :rules="rules"
          outlined
          dense
          type="password"
          label="Введите пароль"
        />
      </v-form>

      <v-divider />
      <v-card-actions>
        <v-btn :loading="loading" color="primary" @click="sendRequest">Сохранить</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>

  <v-card>
    <v-card-title>История активности</v-card-title>

    <v-card-text>
      <v-tooltip v-for="(day, index) in days" :key="index" bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-on="on"
            :color="getColor(day.count_task)"
            class="pa-0 mr-1 mb-1"
            max-height="30px"
            min-height="30px"
            max-width="30px"
            min-width="30px"
            v-bind="attrs"
          />
        </template>
        <span>{{ getDate(day.day) }}</span>
      </v-tooltip>
    </v-card-text>
  </v-card>
</v-container>
</template>

<script>
export default {
  name: 'ProfilePage',
  props: {
    isAuthorized: Boolean
  },
  data() {
    return {
      username: null,
      password: null,
      days: [],
      loading: false
    };
  },
  computed: {
    rules() {
      return [
        (value) => !!value || 'Вы должны заполнить поле',
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
    this.$http.get('/get_user').then(({ data: { username } }) => {
      this.username = username;
    });

    this.$http.get('/calendar').then(({ data: { days } }) => {
      // Для тестов
      // this.days = Array.from(Array(60).keys());
      this.days = days;
    });
  },
  methods: {
    sendRequest() {
      const params = { new_username: this.username, new_password: this.password };

      this.$http.post('/update', params)
        .then(() => {
          this.$emit('show:snackbar', { text: 'Данные обновлены', color: 'success' });
        })
        .finally(() => {
          this.loading = false;
        })
    },
    getColor(count) {
      if (count === 0) {
        return '#8cd98c';
      }
      if (count === 1) {
        return '#66cc66';
      }
      if (count === 2) {
        return '#40bf40';
      }
      if (count === 3) {
        return '#339933';
      }
      if (count === 4) {
        return '#267326';
      }
      return '#194d19';
    },
    getDate(dateString) {
      const milliseconds = Date.parse(dateString);
      return new Date(milliseconds).toLocaleDateString(
        'ru-RU',
        { year: 'numeric', month: 'long', day: 'numeric' }
      );
    }
  }
}
</script>
