<template>
  <span ref="mathJaxEl">{{ formula }}</span>
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
      default: true,
    }
  },
  watch: {
    formula() {
      this.renderMathJax();
    },
  },
  mounted() {
    this.renderMathJax();
  },
  methods: {
    renderContent() {
      if (this.safe) {
        this.$refs.mathJaxEl.textContent = this.formula;
      } else {
        this.$refs.mathJaxEl.innerHTML = this.formula;
      }
    },
    renderMathJax() {
      this.renderContent();
      window.MathJax.Hub.Config({
        tex2jax: {inlineMath: [['$$$','$$$']], displayMath: [['$$$$$$','$$$$$$']]}
      });
    },
  },
};
</script>
