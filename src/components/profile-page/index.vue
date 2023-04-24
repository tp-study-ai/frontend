<template>
<v-container class="pa-0">
  <div class="text-h4 mb-2">Профиль</div>

  <v-card class="mb-4">
    <v-card-text class="pb-0">
      <v-form ref="form">
        <v-text-field
          v-model="username"
          :rules="loginRules"
          outlined
          dense
          type="text"
          label="Введите логин"
        />
        <v-text-field
          v-model="password"
          :rules="passwordRules"
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

    <v-card-text v-if="days.length > 0">
      <v-tooltip v-for="(day, index) in days" :key="index" bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-on="on"
            :color="getColor(day.count_task)"
            class="pa-0 mr-1 mb-1"
            max-height="26px"
            min-height="26px"
            max-width="26px"
            min-width="26px"
            v-bind="attrs"
          />
        </template>
        <span>{{ getDate(day.day) }}</span>
      </v-tooltip>
    </v-card-text>

    <v-card-text v-else>
      Активность не найдена
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
    loginRules() {
      return [
        (value) => !!value || 'Заполните поле',
        (value) => {
          return value && value.length >= 5 && value.length <= 31 ||
            'Логин должен быть длиной от 5 до 31 символов';
        },
        (value) => /^([a-z0-9]{5,31})$/.test(value) || 'Используйте буквы (a-z, A-Z) и/или цифры'
      ];
    },
    passwordRules() {
      return [
        (value) => !!value || 'Заполните поле',
        (value) => value && value.length >= 8 || 'Используйте не менее 8 символов',
        (value) => {
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value) ||
            'Используйте буквы (a-z, A-Z) и цифры';
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
    this.$http.get('/get_user').then(({ data: { username } }) => {
      this.username = username;
    });

    this.$http.get('/calendar').then(({ data: { days } }) => {
      this.days = days;
    });
  },
  methods: {
    sendRequest() {
      this.loading = true;
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
        return '#ffffff';
      }
      if (count === 1) {
        return '#8cd98c';
      }
      if (count === 2) {
        return '#66cc66';
      }
      if (count === 3) {
        return '#40bf40';
      }
      if (count === 4) {
        return '#339933';
      }
      if (count === 5) {
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
