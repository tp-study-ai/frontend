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

      <v-btn class="pa-0 mx-5" text to="/recommendation">Рекомендации</v-btn>
      <v-btn class="pa-0" text to="/tasks">Все задачи</v-btn>
      <v-spacer />

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
          <v-list-item v-for="(item, i) in menuItems" :key="i" :to="item.to" @click="handleAction(item.action)">
            <v-icon left>{{ item.icon }}</v-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
      <v-container class="justify-center align-center" fluid fill-height>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showDrawer: false
    };
  },
  computed: {
    menuItems() {
      return [
        { title: 'Профиль', icon: 'mdi-star-box', to: '/profile' },
        { title: 'Посылки', icon: 'mdi-clipboard-list', to: '/attempts' },
        { title: 'Избранное', icon: 'mdi-heart-outline', to: '/favourites' },
        { title: 'Выйти', icon: 'mdi-logout', action: this.logout.bind(this) }
      ];
    },
    mobileMenuItems() {
      return [
        { title: 'Рекомендации', to: '/recommendation' },
        { title: 'Все задачи', to: '/tasks' },
        { divider: true },
        { title: 'Профиль', icon: 'mdi-star-box', to: '/profile' },
        { title: 'Посылки', icon: 'mdi-clipboard-list', to: '/attempts' },
        { title: 'Избранное', icon: 'mdi-heart-outline', to: '/favourites' },
        { title: 'Выйти', icon: 'mdi-logout', action: this.logout.bind(this) }
      ];
    }
  },
  methods: {
    handleAction(action) {
      if (typeof action !== 'function') {
        return;
      }
      action();
    },
    logout() {
      this.$router.push('/');
    }
  }
}
</script>
