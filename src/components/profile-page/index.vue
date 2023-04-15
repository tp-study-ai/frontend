<template>
<v-container class="px-0">
  <development-form :value="developmentDialogShown" />
</v-container>
</template>

<script>
import DevelopmentForm from '@/dialogs/development-form';

export default {
  name: 'ProfilePage',
  props: {
    isAuthorized: Boolean
  },
  components: {
    DevelopmentForm
  },
  data() {
    return {
      developmentDialogShown: true
    };
  },
  created() {
    if (!this.isAuthorized) {
      this.$emit(
        'show:snackbar',
        { text: 'Для перехода на эту страницу необходимо авторизоваться', color: 'warning' }
      );
      this.$router.push('/');
      this.$emit('show:login-form');
      return;
    }
  }
}
</script>
