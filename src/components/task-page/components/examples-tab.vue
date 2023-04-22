<template>
<div>
  <v-card :class="{ 'mt-4': $vuetify.breakpoint.mdAndUp }" flat>
    <v-card-text class="d-flex justify-space-between pb-0">
      <div class="text-subtitle-1">Ограничение по памяти: {{ memoryLimit }} Мб</div>
      <div class="text-subtitle-1">Ограничение по времени: {{ limits.time_limit }} с</div>
    </v-card-text>
  </v-card>

  <v-card class="d-flex justify-space-between" flat>
    <v-card-text class="d-flex justify-space-between pb-2">
      <div class="text-subtitle-1">Ввод: стандартный ввод</div>
      <div class="text-subtitle-1">Вывод: стандартный вывод</div>
    </v-card-text>
  </v-card>

  <div v-if="examples.length > 0">
    <v-card v-for="(example, id) in examples" :key="id" class="mx-4 mt-4" outlined>
      <v-card-text class="pb-0">
        <div class="text-subtitle-1 font-weight-bold px-0">
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
        <div v-for="(line, index) in getInputLines(example)" :key="`input_${index}_line`">
          {{ line }}
          <br />
        </div>
      </v-card-text>

      <v-card-text>
        <div class="text-subtitle-1 font-weight-bold">
          Выходные данные
          <v-btn
            v-if="$vuetify.breakpoint.mdAndUp"
            class="ml-1"
            icon
            @click="copyText(example.output)"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </div>
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

      navigator.clipboard.writeText(text)
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
