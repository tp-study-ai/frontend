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
      <tr v-for="(attempt, id) in attempts" :key="id">
        <td>{{ attempts.length - id }}</td>

        <td v-if="attempt.loading" colspan="3"><v-progress-linear indeterminate color="primary" /></td>
        <td v-else>{{ attempt.testsPassed }} / {{ attempt.testsTotal }}</td>

        <td v-if="!attempt.loading">{{ attempt.checkTime }}</td>
        <th v-if="!attempt.loading" :class="getResultColor(attempt.checkResult)">
          {{ getResultMessage(attempt.checkResult) }}
        </th>
        <td>
          <v-btn
            class="pa-0"
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

      <div v-if="attempt.checkMessage !== '' || attempt.loading" class="mx-4">
        <div class="text-subtitle-1 font-weight-bold">Результат проверки</div>

        <v-progress-linear
          v-if="attempt.loading"
          class="mt-2 mb-4"
          indeterminate
          color="primary"
        />
        <v-card-text v-else class="px-0 pt-2">{{ attempt.checkMessage }}</v-card-text>
      </div>

      <div class="text-subtitle-1 font-weight-bold ml-4">Код программы</div>
      <code-editor
        v-model="attempt.code"
        :languages="[['cpp', 'C++']]"
        :copy_code="false"
        read_only
        count_lines
        width="auto"
        height="650px"
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
    }
  }
}
</script>
