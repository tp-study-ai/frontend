<template>
<div id="app">
  <v-app>
    <v-app-bar v-if="$vuetify.breakpoint.xsOnly" app flat outlined style="border-width: 0px 0px 1px 0px">
      <v-app-bar-nav-icon @click="showDrawer = true" />

      <router-link class="d-flex align-center mx-auto" to="/" tag="div" style="cursor: pointer">
        <img class="mr-2" src="/logo.png" width="45" height="45" />
        <v-toolbar-title>Study AI</v-toolbar-title>
      </router-link>
    </v-app-bar>

    <v-app-bar v-else app height="56px" flat outlined style="border-width: 0px 0px 1px 0px">
      <v-container class="d-flex align-center">
        <router-link class="d-flex align-center mr-5" to="/" tag="div" style="cursor: pointer">
          <img class="mr-2" src="/logo.png" width="45" height="45" />
          <v-toolbar-title>Study AI</v-toolbar-title>
        </router-link>

        <v-btn text to="/tasks">Все задачи</v-btn>
        <v-spacer />

        <div v-if="isAuthorized">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn v-on="on" text :color="isTaskSolvedToday ? 'error' : undefined" v-bind="attrs">
                <v-icon class="mr-1">mdi-fire</v-icon>
                {{ shockMode }}
              </v-btn>
            </template>
            <span>{{ shockModeText }}</span>
          </v-tooltip>

          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" text v-on="on">
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
        <v-btn v-else text @click="showLoginForm">
          <v-icon class="mr-1">mdi-login</v-icon>
          Войти
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-if="$vuetify.breakpoint.xsOnly" v-model="showDrawer" app>
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
      <router-view
        :is-authorized="isAuthorized"
        :is-cold-start-passed="isColdStartPassed"
        @show:login-form="showLoginForm"
        @show:snackbar="showSnackbar"
        @update:shock-mode="updateShockMode"
        @update:cold-start="updateColdStart"
      />
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
      isAuthorized: null,
      shockMode: 0,
      isTaskSolvedToday: false,
      isColdStartPassed: false
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
      let items = [
        { title: 'Все задачи', to: '/tasks' },
        { divider: true }
      ];

      return this.isAuthorized
        ? items.concat(this.menuItems)
        : items.concat([{ title: 'Войти', icon: 'mdi-login', action: this.showLoginForm.bind(this) }]);
    },
    shockModeText() {
      if (this.shockMode === 0) {
        return 'Решайте задачи каждый день';
      }
      if (this.shockMode === 1) {
        return `Вы в ударе уже ${this.shockMode} день`;
      }

      const x = this.shockMode % 100; // Предпоследняя цифра
      const y = this.shockMode % 10; // Последняя цифра

      if (x === 1) {
        return `Вы в ударе уже ${this.shockMode} дней`;
      }
      if (y === 0 || y >= 5) {
        return `Вы в ударе уже ${this.shockMode} дней`;
      }
      if (y >= 2 && y <= 4) {
        return `Вы в ударе уже ${this.shockMode} дня`;
      }
      if (y === 1) {
        return `Вы в ударе уже ${this.shockMode} день`;
      }

      return '';
    }
  },
  created() {
    document.addEventListener('show:snackbar', (e) => this.showSnackbar(e.detail));

    this.$http
      .get('/get_user')
      .then(({ data: { id, cold_start } }) => {
        if (!id) {
          this.isAuthorized = false;
          return;
        }

        this.isAuthorized = true;
        this.isColdStartPassed = cold_start;

        this.updateShockMode();
      })
      .catch(() => {
        this.isAuthorized = false;
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
        this.$router.push('/about');
      });
    },
    showSnackbar(options) {
      this.snackbarShown = true;
      const timeout = options.color === 'error' ? 5000 : 3000;
      this.snackbarOptions = { ...options, timeout };
    },
    authorizeUser(isAuthorized) {
      this.isAuthorized = isAuthorized;

      if (this.isAuthorized) {
        this.updateShockMode();
        if (window.location.pathname === '/about') {
          this.$router.push('/');
        }
      }
    },
    updateShockMode() {
      this.$http('/shock_mode').then(( { data: { chock_mode, today } }) => {
        this.shockMode = chock_mode;
        this.isTaskSolvedToday = today;
      });
    },
    updateColdStart() {
      this.isColdStartPassed = true;
    }
  }
}
</script>
