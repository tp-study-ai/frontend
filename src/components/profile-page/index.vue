<template>
<v-container class="px-0">
  <development-form :value="dialogShown" />
</v-container>
</template>

<script>
import DevelopmentForm from '@/dialogs/development-form';

export default {
  name: 'ProfilePage',
  components: {
    DevelopmentForm
  },
  data() {
    return {
      dialogShown: true
    };
  }
}
</script>
