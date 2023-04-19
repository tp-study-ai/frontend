<template>
<v-dialog
  :value="value"
  :width="this.$vuetify.breakpoint.smAndDown ? '' : '500'"
  persistent
  @input="handleInput"
>
  <v-card>
    <div class="d-flex">
      <v-card-title>Авторизация</v-card-title>
      <v-btn class="ml-auto my-auto mr-2" icon @click="() => handleInput(false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

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
    </v-card-text>

    <v-divider />
    <v-card-actions class="d-block">
      <div class="mb-2">
        <v-btn :loading="loading" block color="primary" @click="sendRequest">Войти</v-btn>
      </div>
      <div>
        <v-btn
          :loading="loading"
          plain
          block
          color="secondary"
          @click="showRegisterForm"
        >
          <span class="primary--text">Вход</span>&nbsp;|&nbsp;Регистрация
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: 'LoginForm',
  props: {
    value: Boolean
  },
  data() {
    return {
      username: null,
      password: null,
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

      this.loading = true;
      const params = { username: this.username, password: this.password };

      this.$http
        .post('/login', params)
        .then(() => {
          this.$emit('show:snackbar', { text: 'Авторизация прошла успешно', color: 'success' });
          this.$emit('authorize:user', true);
          this.handleInput(false);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    showRegisterForm() {
      this.$emit('show:register-form');
    }
  }
}
</script>
