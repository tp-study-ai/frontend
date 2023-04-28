<template>
<v-dialog
  :value="value"
  :width="this.$vuetify.breakpoint.xsOnly ? '' : '500'"
  @input="handleInput"
>
  <v-card outlined>
    <div class="d-flex">
      <v-card-title>Регистрация</v-card-title>
      <v-btn class="ml-auto my-auto mr-2" icon @click="() => handleInput(false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

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
        <v-text-field
          v-model="confirmPassword"
          :rules="passwordRules"
          outlined
          dense
          type="password"
          label="Введите пароль повторно"
        />
      </v-form>
    </v-card-text>

    <v-divider />
    <v-card-actions class="d-block">
      <div class="mb-2">
        <v-btn :loading="loading" block color="primary" @click="sendRequest">Зарегистрироваться</v-btn>
      </div>
      <div>
        <v-btn
          :loading="loading"
          text
          block
          color="secondary"
          @click="showLoginForm"
        >
          Вход&nbsp;|&nbsp;<span class="primary--text">Регистрация</span>
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: 'RegisterForm',
  props: {
    value: Boolean
  },
  data() {
    return {
      username: null,
      password: null,
      confirmPassword: null,
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
    value(newValue) {
      if (!newValue) {
        return;
      }
      this.$refs.form?.reset();
    }
  },
  methods: {
    handleInput(newValue) {
      this.$emit('input', newValue);
    },
    sendRequest() {
      if (!this.$refs.form.validate()) {
        this.$emit('show:snackbar', { text: 'Не все поля заполнены', color: 'warning' });
        return;
      }
      this.$refs.form.resetValidation();

      if (this.password !== this.confirmPassword) {
        this.$emit('show:snackbar', { text: 'Пароли не совпадают', color: 'warning' });
        return;
      }

      this.loading = true;
      const params = { username: this.username, password: this.password };

      this.$http
        .post('/register', params)
        .then(() => {
          this.$emit('show:snackbar', { text: 'Авторизация прошла успешно', color: 'success' });
          this.$emit('authorize:user', true);
          this.handleInput(false);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    showLoginForm() {
      this.$emit('show:login-form');
    }
  }
}
</script>
