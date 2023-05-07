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
            <v-sheet :color="message.type === 'user' ? 'primary' : ''" outlined rounded>
              <v-card flat>
                <v-card-text
                  :class="{ 'ml-auto': message.type === 'user' }"
                  v-html="message.text"
                />
              </v-card>
            </v-sheet>
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
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

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

      const sanitizedString = DOMPurify.sanitize(marked.parse(trimmedString));
      this.inputMessage = '';

      this.messages.push({ type: 'user', text: sanitizedString });
      const params = { task_id: parseInt(this.taskId), message: sanitizedString, code: this.code };

      this.$http.post('/chat_gpt', params)
        .then(({ data: { message } }) => {
          this.messages.push({ type: 'bot', text: DOMPurify.sanitize(marked.parse(message)) });

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

<style>
.messages-container {
  min-height: calc(60vh - 54px - 40px - 18px);
  max-height: calc(60vh - 54px - 40px - 18px);
}

/* Убираем отступ для p тега, который добавляется после использования 'marked.parse' */
.messages-container .v-sheet .v-card .v-card__text p {
  margin-bottom: 0px;
}

/* Переопределяем стандартные стили тега code */
.messages-container .v-sheet .v-card .v-card__text code {
  display: inline-flex;
  padding: 0px;
}
</style>
