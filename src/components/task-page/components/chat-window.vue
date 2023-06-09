<template>
<div>
  <v-menu
    v-model="chatOpened"
    :close-on-content-click="false"
    top
    offset-y
    left
    nudge-top="10"
  >
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" fab small color="primary" v-on="on">
        <v-icon>{{ chatOpened ? 'mdi-close' : 'mdi-chat' }}</v-icon>
      </v-btn>
    </template>

    <v-card class="d-flex flex-column justify-space-between" width="350" height="60vh">
      <div class="d-flex">
        <v-card-subtitle class="font-weight-bold">Онлайн помощник</v-card-subtitle>
        <v-btn class="ml-auto my-auto mr-2" icon @click="chatOpened = false">
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
        :append-icon="this.trimmedString === '' ? undefined : 'mdi-send'"
        class="pa-2"
        type="text"
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
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

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
  computed: {
    trimmedString() {
      return this.inputMessage.trim();
    }
  },
  methods: {
    sendMessage() {
      if (this.trimmedString === '') {
        return;
      }

      this.loading = true;

      const sanitizedString = DOMPurify.sanitize(marked.parse(this.trimmedString));
      this.inputMessage = '';

      this.messages.push({ type: 'user', text: sanitizedString });
      this.scroll();

      const params = { task_id: parseInt(this.taskId), message: sanitizedString, code: this.code };

      this.$http.post('/chat_gpt', params)
        .then(({ data: { message } }) => {
          this.messages.push({ type: 'bot', text: DOMPurify.sanitize(marked.parse(message)) });
          this.scroll();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    scroll() {
      this.$nextTick(() => {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
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
.messages-container .v-sheet > .v-card > .v-card__text p {
  margin-bottom: 0px;
}

/* Переопределяем стандартные стили тега code для красивого отображения кода */
.messages-container .v-sheet > .v-card > .v-card__text pre > code {
  display: inline-flex;
  padding: 0px;
}
</style>
