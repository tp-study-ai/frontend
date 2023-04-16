<template>
<div>
  <v-card
    :class="{ 'mt-4 pt-2': $vuetify.breakpoint.mdAndUp }"
    class="mx-4 pb-2 d-flex justify-space-between"
    flat
  >
    <div class="text-subtitle-1">Ограничение по памяти: {{ memoryLimit }} Мб</div>
    <div class="text-subtitle-1">Ограничение по времени: {{ limits.time_limit }} с</div>
  </v-card>

  <div class="mx-4 py-2 d-flex justify-space-between" outlined>
    <div class="text-subtitle-1">Ввод: стандартный ввод</div>
    <div class="text-subtitle-1">Вывод: стандартный вывод</div>
  </div>

  <div v-if="examples.length > 0">
    <v-card v-for="(example, id) in examples" :key="id" class="mb-2 mx-4 mt-4 py-2 px-4" outlined>
      <div class="text-subtitle-1 font-weight-bold">
        Входные данные
        <v-btn
          v-if="$vuetify.breakpoint.mdAndUp"
          class="ml-1"
          icon
          @click="copyText(example.input)"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </div>
      <v-card-text class="pl-0 pt-0">
        <div v-for="(line, index) in getInputLines(example)" :key="`input_${index}_line`">
          {{ line }}
          <br />
        </div>
      </v-card-text>

      <div class="text-subtitle-1 font-weight-bold">Выходные данные</div>
      <v-card-text class="pl-0 pt-0 pb-0">
        <div v-for="(line, index) in getOutputLines(example)" :key="`output_${index}_line`">
          {{ line }}
          <br />
        </div>
      </v-card-text>
    </v-card>
  </div>

  <div v-else class="text-h6 font-weight-bold mx-4 mt-4">
    Примеров нет
  </div>

  <v-card flat>
    <v-card-text>
      <vue-mathjax :formula="note" :safe="false" />
    </v-card-text>
  </v-card>
</div>
</template>

<script>
import VueMathjax from '@/shared/components/vue-mathjax';

export default {
  name: 'ExamplesTab',
  props: {
    examples: Array,
    limits: Object,
    note: String
  },
  components: {
    'vue-mathjax': VueMathjax
  },
  computed: {
    memoryLimit() {
      return Math.round(this.limits.memory_limit_bytes / (1000 * 1000));
    }
  },
  methods: {
    copyText(text) {
      if (!window.navigator) {
        return;
      }

      const textToCopy = text.replaceAll('<br>', '\n');
      navigator.clipboard.writeText(textToCopy)
      this.$emit('show:snackbar', { text: 'Данные успешно скопированы', color: 'success' });
    },
    getInputLines(example) {
      return example.input.split('\n').filter((line) => line !== '');
    },
    getOutputLines(example) {
      return example.output.split('\n').filter((line) => line !== '');
    }
  }
}
</script>
