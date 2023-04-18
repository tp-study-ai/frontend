<template>
<div id="app">
  <v-app>
    <v-app-bar v-if="$vuetify.breakpoint.smAndDown" app>
      <v-app-bar-nav-icon @click="showDrawer = true" />

      <router-link class="d-flex align-center mx-auto" to="/" tag="div" style="cursor: pointer">
        <img class="mr-2" src="/logo.png" width="50" height="50" />
        <v-toolbar-title>Study AI</v-toolbar-title>
      </router-link>
    </v-app-bar>

    <v-app-bar v-else app>
      <v-spacer />
      <router-link class="d-flex align-center" to="/" tag="div" style="cursor: pointer">
        <img class="mr-2" src="/logo.png" width="50" height="50" />
        <v-toolbar-title>Study AI</v-toolbar-title>
      </router-link>

      <v-btn v-if="isAuthorized" class="pa-0 ml-5" text to="/recommendations">Рекомендованные задачи</v-btn>
      <v-btn class="pa-0 ml-5" text to="/tasks">Все задачи</v-btn>
      <v-spacer />

      <div v-if="isAuthorized">
        <v-btn class="mr-5" icon>
          <v-icon left>mdi-fire</v-icon>
          0
        </v-btn>

        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" icon v-on="on">
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, i) in menuItems"
              :key="i"
              :to="item.to"
              @click="handleAction(item.action)"
            >
              <v-icon left>{{ item.icon }}</v-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <v-btn v-else class="pa-0" text @click="showLoginForm">Войти</v-btn>

      <v-spacer />
    </v-app-bar>

    <v-navigation-drawer v-if="$vuetify.breakpoint.smAndDown" v-model="showDrawer" app>
      <v-list>
        <template v-for="(item, i) in mobileMenuItems">
          <v-divider v-if="item.divider" :key="i" />

          <v-list-item v-else :key="i" :to="item.to" @click="handleAction(item.action)">
            <v-icon left>{{ item.icon }}</v-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view
          :isAuthorized="isAuthorized"
          @show:login-form="showLoginForm"
          @show:snackbar="showSnackbar"
        />
      </v-container>
    </v-main>

    <login-form
      v-model="loginFormShown"
      @show:register-form="showRegisterForm"
      @show:snackbar="showSnackbar"
      @authorize:user="authorizeUser"
    />
    <register-form
      v-model="registerFormShown"
      @show:login-form="showLoginForm"
      @show:snackbar="showSnackbar"
      @authorize:user="authorizeUser"
    />

    <v-snackbar
      v-model="snackbarShown"
      :color="snackbarOptions.color"
      :timeout="snackbarOptions.timeout"
    >
      {{ snackbarOptions.text }}

      <template #action="{ attrs }">
        <v-btn
          icon
          v-bind="attrs"
          @click="snackbarShown = false"
        >
          <v-icon dark>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</div>
</template>

<script>
import LoginForm from '@/dialogs/login-form';
import RegisterForm from '@/dialogs/register-form';

export default {
  name: 'App',
  components: {
    LoginForm,
    RegisterForm
  },
  data() {
    return {
      showDrawer: false,
      snackbarShown: false,
      snackbarOptions: {},
      loginFormShown: false,
      registerFormShown: false,
      isAuthorized: false
    };
  },
  computed: {
    menuItems() {
      return [
        { title: 'Профиль', icon: 'mdi-star-box', to: '/profile' },
        { title: 'История', icon: 'mdi-history', to: '/history' },
        { title: 'Избранное', icon: 'mdi-heart-outline', to: '/favorites' },
        { title: 'Выйти', icon: 'mdi-logout', action: this.logout.bind(this) }
      ];
    },
    mobileMenuItems() {
      const items = [
        { title: 'Рекомендованные задачи', to: '/recommendations' },
        { title: 'Все задачи', to: '/tasks' },
        { divider: true }
      ];

      return items.concat(
        this.isAuthorized
          ? this.menuItems
          : [{ title: 'Войти', icon: 'mdi-login', action: this.showLoginForm.bind(this) }]
      );
    }
  },
  created() {
    document.addEventListener('show:snackbar', (e) => this.showSnackbar(e.detail));

    this.$http.get('/get_user').then(({ data: { id } }) => {
      if (id) {
        this.isAuthorized = true;
      }
    });
  },
  destroyed() {
    document.removeEventListener('show:snackbar', (e) => this.showSnackbar(e.detail));
  },
  methods: {
    handleAction(action) {
      if (typeof action !== 'function') {
        return;
      }
      action();
    },
    showLoginForm() {
      this.loginFormShown = true;
      this.registerFormShown = false;
    },
    showRegisterForm() {
      this.loginFormShown = false;
      this.registerFormShown = true;
    },
    logout() {
      this.$http.get('/logout').finally(() => {
        this.authorizeUser(false);
        this.$router.push('/');
      });
    },
    showSnackbar(options) {
      this.snackbarShown = true;
      const timeout = options.color === 'error' ? 5000 : 3000;
      this.snackbarOptions = { ...options, timeout };
    },
    authorizeUser(isAuthorized) {
      this.isAuthorized = isAuthorized;
    }
  }
}
</script>
