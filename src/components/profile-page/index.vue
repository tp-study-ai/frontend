<template>
<v-container class="px-0">
  <div class="text-h4 mb-2">Профиль</div>

  <v-card class="mb-4">
    <v-card-text class="pb-0">
      <v-form ref="form">
        <v-text-field
          v-model="username"
          :rules="rules"
          disabled
          outlined
          dense
          type="text"
          label="Введите логин"
        />
        <v-text-field
          v-model="password"
          :rules="rules"
          disabled
          outlined
          dense
          type="password"
          label="Введите пароль"
        />
      </v-form>

      <v-divider />
      <v-card-actions>
        <v-btn :loading="loading" disabled color="primary" @click="sendRequest">Сохранить</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>

  <v-card>
    <v-card-title>История активности</v-card-title>

    <v-card-text>
      <v-btn
        v-for="(day, index) in days"
        :key="index"
        :color="getColor(day)"
        class="pa-0 mr-1 mb-1"
        max-height="34px"
        min-height="34px"
        max-width="34px"
        min-width="34px"
      />
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
  created() {
    if (!this.isAuthorized) {
      this.$router.push('/');

      this.$emit(
        'show:snackbar',
        { text: 'Для перехода на эту страницу необходимо авторизоваться', color: 'error' }
      );
      this.$emit('show:login-form');
      return;
    }

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

    },
    getColor(day) {
      if (day === 0) {
        return '#8cd98c';
      }
      if (day === 1) {
        return '#66cc66';
      }
      if (day === 2) {
        return '#40bf40';
      }
      if (day === 3) {
        return '#339933';
      }
      if (day === 4) {
        return '#267326';
      }
      return '#194d19';
    }
  }
}
</script>
