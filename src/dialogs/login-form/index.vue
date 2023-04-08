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

    <v-card-text>
      <v-form>
        <v-text-field
          v-model="username"
          outlined
          dense
          type="text"
          label="Введите логин"
        />
        <v-text-field
          v-model="password"
          outlined
          dense
          type="password"
          label="Введите пароль"
        />
      </v-form>
    </v-card-text>

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn text color="primary" @click="sendRequest">Войти</v-btn>
      <v-btn text color="secondary" @click="showRegisterForm">Зарегистрироваться</v-btn>
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
      password: null
    };
  },
  methods: {
    handleInput(newValue) {
      this.$emit('input', newValue);
    },
    sendRequest() {
      const params = { username: this.username, password: this.username };

      this.$http
        .post('/login', params)
        .then(({ data: { message } }) => {
          this.$emit('show:snackbar', { text: message, color: 'success' });
          this.handleInput(false);
        });
    },
    showRegisterForm() {
      this.$emit('show:register-form');
    }
  }
}
</script>
