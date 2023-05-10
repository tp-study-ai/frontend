import Vue from 'vue';

import http from '@/lib/http';

import router from '@/plugins/router';
import vuetify from '@/plugins/vuetify';

import App from '@/app';

import 'animate.css';
import 'typeface-roboto'
import './registerServiceWorker'

Vue.config.productionTip = false;
Vue.prototype.$http = http;

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');
