<template>
<div>
  <v-menu
    v-model="chatOpened"
    :close-on-content-click="false"
    top
    offset-y
    left
    offset-x
  >
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" fab small color="primary" v-on="on">
        <v-icon>{{ chatOpened ? 'mdi-close' : 'mdi-chat' }}</v-icon>
      </v-btn>
    </template>

    <v-card class="d-flex flex-column justify-space-between" width="350" height="60vh">
      <div class="d-flex">
        <v-card-subtitle class="font-weight-bold">Онлайн помощник</v-card-subtitle>
        <v-btn class="ml-auto my-auto mr-2" icon small @click="chatOpened = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-divider />

      <div class="messages-container overflow-y-auto pa-2 pb-0" ref="messagesContainer">
        <v-row no-gutters>
          <v-col
            v-for="(message, index) in messages"
            :key="`message_${index}`"
            :class="{ 'text-right': message.type === 'user' }"
            class="mb-2"
            cols="12"
          >
            <v-card outlined>
              <v-card-text :class="{ 'ml-auto': message.type === 'user' }">{{ message.text }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <v-divider />
      <v-text-field
        v-model="inputMessage"
        :disabled="loading"
        :loading="loading"
        class="pa-2"
        type="text"
        append-icon="mdi-send"
        placeholder="Задайте любой вопрос по задаче..."
        dense
        hide-details
        outlined
        @keydown.enter.prevent="sendMessage"
        @click:append="sendMessage"
      />
    </v-card>
  </v-menu>
</div>
</template>

<script>
export default {
  name: 'ChatWindow',
  props: {
    taskId: String,
    code: String
  },
  data() {
    return {
      chatOpened: false,
      messages: [
        { type: 'bot', text: 'Привет! Чем я могу тебе помочь?' },
      ],
      loading: false,
      inputMessage: ''
    };
  },
  methods: {
    sendMessage() {
      const trimmedString = this.inputMessage.trim()
      if (trimmedString === '') {
        return;
      }

      this.loading = true;

      this.messages.push({ type: 'user', text: trimmedString });
      const params = { task_id: parseInt(this.taskId), message: trimmedString, code: this.code };
      this.inputMessage = '';

      this.$http.post('/chat_gpt', params)
        .then(({ data: { message } }) => {
          this.messages.push({ type: 'bot', text: message });

          this.$nextTick(() => {
            this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
          });
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
}
</script>

<style scoped>
.messages-container {
  min-height: calc(60vh - 54px - 40px - 18px);
  max-height: calc(60vh - 54px - 40px - 18px);
}
</style>
