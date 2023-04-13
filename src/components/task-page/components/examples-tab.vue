<template>
<div>
  <v-card class="mx-4 py-2 px-4 my-4 d-flex justify-space-between" outlined>
    <div class="text-subtitle-1">Ограничение по памяти: {{ memoryLimit }} Мб</div>
    <div class="text-subtitle-1">Ограничение по времени: {{ limits.time_limit }} с</div>
  </v-card>

  <v-card class="mx-4 py-2 px-4 d-flex justify-space-between" outlined>
    <div class="text-subtitle-1">Ввод: стандартный ввод</div>
    <div class="text-subtitle-1">Вывод: стандартный вывод</div>
  </v-card>

  <v-card v-for="(example, id) in examples" :key="id" class="mb-2 mx-4 mt-4 py-2 px-4" outlined>
    <div class="text-subtitle-1">Входные данные</div>
    <v-card-text v-html="example.input" class="pl-0 pt-0" />

    <div class="text-subtitle-1">Выходные данные</div>
    <v-card-text v-html="example.output" class="pl-0 pt-0 pb-0" />
  </v-card>
</div>
</template>

<script>
export default {
  name: 'ExamplesTab',
  props: {
    examples: Array,
    limits: Object
  },
  computed: {
    memoryLimit() {
      return Math.round(this.limits.memory_limit_bytes / (1024 * 1024));
    }
  }
}
</script>
