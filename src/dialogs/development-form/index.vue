<template>
<v-dialog
  :value="value"
  :width="this.$vuetify.breakpoint.xsOnly ? '' : '1000'"
  persistent
>
  <v-card>
    <v-card-title>Уупс...</v-card-title>
    <v-card-text>
      Данная страница еще находится в процессе разработки... Но скоро мы обязательно представим ее вам!
      Пока вы можете посмотреть другой функционал нашей платформы.
    </v-card-text>

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn text color="primary" @click="goBack">Вернуться назад</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: 'DevelopmentForm',
  props: {
    value: Boolean
  },
  methods: {
    goBack() {
      this.$router.back();
    }
  }
}
</script>
