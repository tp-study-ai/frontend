<template>
  <div :key="formula" ref="mathJaxEl">{{ formula }}</div>
</template>

<script>
export default {
  name: 'VueMathjax',
  props: {
    formula: {
      type: String,
      default: ''
    },
    safe: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    formula() {
      this.$nextTick().then(() => this.renderContent());
    }
  },
  mounted() {
    this.renderContent();
  },
  methods: {
    renderContent() {
      if (this.safe) {
        this.$refs.mathJaxEl.textContent = this.formula;
      } else {
        this.$refs.mathJaxEl.innerHTML = this.formula;
      }
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }
};
</script>
