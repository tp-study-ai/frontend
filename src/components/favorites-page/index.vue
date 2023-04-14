<template>
<v-container class="px-0">
  <development-form :value="developmentDialogShown" />
</v-container>
</template>

<script>
import DevelopmentForm from '@/dialogs/development-form';

export default {
  name: 'FavouritesPage',
  components: {
    DevelopmentForm
  },
  data() {
    return {
      developmentDialogShown: true
    };
  }
}
</script>
