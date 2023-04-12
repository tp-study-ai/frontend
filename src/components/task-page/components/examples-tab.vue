<template>
<div>
  <div v-for="(example, id) in examples" :key="id">
    <v-card class="mb-2 mx-4 mt-4 pt-2" outlined>
      <div class="ml-4 font-bold">Входные данные</div>
      <v-card-text v-html="example.input" class="pt-2" />

      <div class="ml-4 font-bold">Выходные данные</div>
      <v-card-text v-html="example.output" class="py-2" />
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
