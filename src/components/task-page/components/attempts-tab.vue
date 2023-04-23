<template>
<div>
  <v-simple-table>
    <thead>
      <tr>
        <th>Номер</th>
        <th>Пройдено тестов</th>
        <th>Общее время тестирования</th>
        <th>Вердикт</th>
        <th>Отчет</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(attempt, id) in attempts.slice().reverse()" :key="id">
        <td>{{ attempts.length - id }}</td>

        <td v-if="attempt.loading" colspan="3"><v-progress-linear indeterminate color="primary" /></td>
        <td v-else>{{ attempt.testsPassed }} / {{ attempt.testsTotal }}</td>

        <td v-if="!attempt.loading">{{ attempt.checkTime }}</td>
        <th v-if="!attempt.loading" :class="getResultColor(attempt.checkResult)">
          {{ getResultMessage(attempt.checkResult) }}
        </th>
        <td>
          <v-btn
            :class="{ 'animate__animated animate__flash animate__infinite' : attempt.highlightButton }"
            class="px-0"
            text
            color="primary"
            @click="showCode(attempt, attempts.length - id)"
          >
            Показать
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-simple-table>

  <v-dialog v-model="dialogShown">
    <v-card>
      <div class="d-flex">
        <v-card-title>Отчет о посылке №{{ attemptReversedId }}</v-card-title>
        <v-btn class="ml-auto my-auto mr-2" icon @click="dialogShown = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-card-text class="pb-1">
        <div v-if="attempt.checkMessage !== '' || attempt.loading">
          <div class="text-subtitle-1 font-weight-bold mb-1">Результат проверки</div>

          <v-progress-linear
            v-if="attempt.loading"
            indeterminate
            color="primary"
          />
          <div v-for="(line, index) in checkMessageLines" :key="`line_of_message_${index}`">
            {{ line }}
            <br />
          </div>
        </div>

        <div class="text-subtitle-1 font-weight-bold mt-4">
          Код программы
          <v-btn
            v-if="$vuetify.breakpoint.mdAndUp"
            class="ml-1"
            x-small
            icon
            @click="copyText(attempt.code)"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </div>
      </v-card-text>

      <code-editor
        v-model="attempt.code"
        :languages="[['cpp', 'C++']]"
        :copy_code="false"
        read_only
        count_lines
        width="auto"
        border_radius="0px"
        theme="light"
      />
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import CodeEditor from 'simple-code-editor/project/package/CodeEditor';

export default {
  name: 'AttemptsTab',
  props: {
    attempts: Array
  },
  components: {
    CodeEditor
  },
  data() {
    return {
      attempt: {},
      attemptReversedId: 0,
      dialogShown: false
    };
  },
  computed: {
    checkMessageLines() {
      if (!this.attempt.checkMessage) {
        return [];
      }

      return this.attempt.checkMessage.split('\n').filter((line) => line !== '');
    }
  },
  methods: {
    getResultColor(checkResult) {
      switch(checkResult) {
        case 0:
          return 'success--text';
        case 2:
        case 3:
        case 4:
          return 'error--text';
        case 6:
        case 7:
          return 'warning--text';
        default:
          return '';
      }
    },
    getResultMessage(checkResult) {
      switch(checkResult) {
        case 0:
          return 'Успех';
        case 2:
          return 'Ошибка компиляции';
        case 3:
          return 'Ошибка во время исполнения';
        case 4:
          return 'Неверный ответ';
        case 6:
          return 'Превышено время исполнения';
        case 7:
          return 'Превышено время компиляции';
        default:
          return '';
      }
    },
    showCode(attempt, attemptReversedId) {
      this.attempt = attempt;
      this.attemptReversedId = attemptReversedId;
      this.dialogShown = true;
    },
    copyText(text) {
      if (!window.navigator) {
        return;
      }

      navigator.clipboard.writeText(text)
      this.$emit('show:snackbar', { text: 'Данные успешно скопированы', color: 'success' });
    },
  }
}
</script>
