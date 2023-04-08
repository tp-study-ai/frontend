<template>
<v-dialog
  :value="value"
  :width="this.$vuetify.breakpoint.smAndDown ? '' : '1000'"
  persistent
  @input="handleInput"
>
  <v-card>
    <v-card-title>Привет!</v-card-title>
    <v-card-text>
      <p>
        Study AI - это иновационная платформа для обучения алгоритмам. На этой странице тебе будут
        показываться случайные задачи на алгоритмы. По мере прохождения задач специализированная модель
        будет подбирать тебе наиболее подходящие к твоему уровню задачи.
      </p>

      Чтобы начать решать задачи, нажми кнопку "Начать"!
    </v-card-text>

    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn text color="primary" @click="handleSubmit">Начать</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: 'OnboardingForm',
  props: {
    value: Boolean
  },
  methods: {
    handleInput(newValue) {
      this.$emit('input', newValue);
    },
    handleSubmit() {
      localStorage.setItem('hideStartDialog', 'true');
      this.handleInput(false);
    }
  }
}
</script>
