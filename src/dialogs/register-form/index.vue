<template>
<v-dialog
  :value="value"
  :width="this.$vuetify.breakpoint.smAndDown ? '' : '500'"
  persistent
  @input="handleInput"
>
  <v-card>
    <div class="d-flex">
      <v-card-title>Регистрация</v-card-title>
      <v-btn class="ml-auto my-auto mr-2" icon @click="() => handleInput(false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-card-text>
      <v-form>
        <v-text-field
          v-model="login"
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
        <v-text-field
          v-model="confirmPassword"
          outlined
          dense
          type="password"
          label="Введите пароль повторно"
        />
      </v-form>
    </v-card-text>

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" text @click="sendRequest">Зарегистрироваться</v-btn>
      <v-btn text color="secondary" @click="showLoginForm">Войти</v-btn>
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
      login: null,
      password: null,
      confirmPassword: null
    };
  },
  methods: {
    handleInput(newValue) {
      this.$emit('input', newValue);
    },
    sendRequest() {

    },
    showLoginForm() {
      this.$emit('show:login-form');
    }
  }
}
</script>
