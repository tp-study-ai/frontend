<template>
<v-container class="text-center animate__animated animate__fadeIn">
  <div class="text-h3 mt-sm-10 mb-4">
    Начните учиться эффективно вместе с <div class="primary--text">Study AI</div>
  </div>
  <div class="text-subtitle-1 mb-4">Твой персональный путь в изучении программирования</div>

  <v-btn
    :block="$vuetify.breakpoint.xsOnly"
    color="primary"
    @click="showRegisterForm"
  >
    Создать аккаунт
  </v-btn>
  <v-divider class="my-10" />

  <div class="text-h4 mb-2">Подберем индивидуальный план обучения</div>
  <div class="text-subtitle-1">Нейросетевой алгоритм для анализа ВАШИХ знаний</div>
  <img src="/pc-photo.svg" width="100%">

  <v-row>
    <v-col class="text-left" cols="12" sm="6">
      <div class="text-h4 mt-10 mb-2">Наши преимущества</div>
      <div class="text-subtitle-1 mb-4">Уникальные функции для комфортного обучения</div>

      <div v-for="(feature, index) in mainFeatures" :key="`main_feature_${index}`" class="mb-2">
        <v-card outlined @click="showImage(feature)">
          <v-card-title>{{ feature.title }}</v-card-title>
          <v-card-subtitle class="text-left">{{ feature.text }}</v-card-subtitle>
        </v-card>
      </div>
    </v-col>

    <v-col cols="12" sm="6">
      <img :src="imageSrc" width="60%">
    </v-col>
  </v-row>
  <!-- <v-divider class="my-10" /> -->

  <!-- <div class="text-h4 mb-2">Наша платформа помогает обучаться</div> -->
  <!-- <div class="text-subtitle-1 mb-4">Мы проанализировали процесс обучения и сделали его более эффективным</div> -->

  <!-- <v-row>
    <v-col v-for="(feature, index) in features" :key="`feature_${index}`" cols="12" sm="4">
      <v-card class="pt-4" outlined>
        <v-btn fab color="primary"><v-icon>{{ feature.icon }}</v-icon></v-btn>
        <v-card-title class="justify-center">{{ feature.title }}</v-card-title>
        <v-card-subtitle>{{ feature.text }}</v-card-subtitle>
      </v-card>
    </v-col>
  </v-row> -->

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
  data() {
    return {
      imageSrc: ''
    };
  },
  computed: {
    mainFeatures() {
      return [
        {
          title: 'Индивидуальная образовательная траектория',
          text: 'Нейросетевой алгоритм, анализирующий ваши знания',
          src: '/logo.png'
        },
        {
          title: 'Онлайн ИИ-помощник',
          text: 'Ваш личный помощник на базе ChatGPT',
          src: '/logo.png'
        },
        {
          title: 'Обучение в потоке',
          text: 'Контекстные рекомендации для непрерывного изучения определенной темы',
          src: '/logo.png'
        }
      ];
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
  created() {
    this.showImage(this.mainFeatures[0]);
  },
  methods: {
    showRegisterForm() {
      this.$emit('show:register-form');
    },
    showImage(feature) {
      this.imageSrc = feature.src;
    }
  }
}
</script>
