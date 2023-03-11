import Vue from 'vue';
import VueRouter from 'vue-router';

import components from '@/components';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: components.StartPage,
  },
  {
    path: '/task/:id',
    component: components.TaskPage,
    props: true
  }
];

const options = {
  routes,
  mode: 'history',
};

export default new VueRouter(options);
