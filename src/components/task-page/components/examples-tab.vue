<template>
<div>
  <div v-for="(example, id) in examples" :key="id">
    <v-card class="mb-2 mx-4 mt-4">
      <div class="ml-4 font-bold">Входные данные</div>
      <v-card-text v-html="example.input" />

      <div class="ml-4 font-bold">Выходные данные</div>
      <v-card-text v-html="example.output" />
    </v-card>
  </div>
</div>
</template>

<script>
export default {
  name: 'ExamplesTab',
  props: {
    examples: Array
  }
}
</script>
