<template>
<v-container class="text-center animate__animated animate__fadeIn">
  <div class="text-h3 mt-sm-10 mb-4">
    Начните учиться вместе с <component :is="titleComponent" class="primary--text">Study AI</component>
  </div>
  <div class="text-subtitle-1 mb-4">Study AI - это инновационная платформа для изучения алгоритмов</div>

  <v-btn
    :block="$vuetify.breakpoint.xsOnly"
    class="mb-10"
    color="primary"
    @click="showRegisterForm"
  >
    Создать аккаунт
  </v-btn>
  <v-divider />

  <div class="text-h4 mt-10 mb-2">Как просто это работает</div>
  <div class="text-subtitle-1 mb-4">Вы быстро войдете в процесс и начнете учиться</div>
  <img src="/steps.png" width="100%" height="350px">

  <div class="text-h4 mt-10 mb-2">Наша платформа помогает обучаться</div>
  <div class="text-subtitle-1 mb-4">Мы проанализировали процесс обучения и сделали его более эффективным</div>

  <v-row>
    <v-col v-for="(feature, index) in features" :key="`feature_${index}`" cols="12" sm="4">
      <v-card class="pa-4" outlined>
        <v-btn fab color="primary"><v-icon>{{ feature.icon }}</v-icon></v-btn>
        <v-card-title class="justify-center">{{ feature.title }}</v-card-title>
        <v-card-subtitle>{{ feature.text }}</v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>

  <v-sheet
    class="mt-10 white--text py-7 px-4 text-sm-left d-sm-flex"
    color="primary"
    width="100%"
    height="130px"
  >
    <div class="text-h5 mb-2 my-sm-auto">Готовы начать?</div>
    <v-btn
      :block="$vuetify.breakpoint.xsOnly"
      class="ml-sm-auto my-sm-auto mt-4"
      color="white"
      @click="showRegisterForm"
    >
      Создать аккаунт
    </v-btn>
  </v-sheet>
</v-container>
</template>

<script>
export default {
  name: 'AboutPage',
  computed: {
    titleComponent() {
      if (this.$vuetify.breakpoint.xsOnly) {
        return 'span';
      }
      return 'div';
    },
    features() {
      return [
        { title: 'Преимущество 1', text: 'Описание преимущества', icon: 'mdi-star' },
        { title: 'Преимущество 2', text: 'Описание преимущества', icon: 'mdi-star' },
        { title: 'Преимущество 3', text: 'Описание преимущества', icon: 'mdi-star' },
        { title: 'Преимущество 4', text: 'Описание преимущества', icon: 'mdi-star' },
        { title: 'Преимущество 5', text: 'Описание преимущества', icon: 'mdi-star' },
        { title: 'Преимущество 6', text: 'Описание преимущества', icon: 'mdi-star' }
      ];
    }
  },
  methods: {
    showRegisterForm() {
      this.$emit('show:register-form');
    }
  }
}
</script>
