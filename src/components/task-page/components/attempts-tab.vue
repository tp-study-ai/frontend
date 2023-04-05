<template>
<div>
  <v-simple-table>
  <thead>
    <tr>
      <th>Номер</th>
      <th>Количество пройденных тестов</th>
      <th>Код программы</th>
    </tr>
  </thead>

  <tbody>
    <tr v-for="(attempt, id) in attempts" :key="id">
      <td>{{ attempts.length - id }}</td>
      <td>{{ attempt.testsPassed }} / {{ attempt.testsTotal }}</td>
      <td>
        <v-btn class="pa-0" text color="primary" @click="showCode(attempt)">Показать</v-btn>
      </td>
    </tr>
  </tbody>
  </v-simple-table>

  <v-dialog v-model="dialogShown">
    <v-card>
      <v-card-title>Код программы к попытке номер {{ attempt.id }}</v-card-title>

      <code-editor
        v-model="attempt.code"
        :languages="[['cpp', 'C++']]"
        read_only
        copy_code
        width="auto"
        height="650px"
        theme="light"
      />
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import CodeEditor from 'simple-code-editor';

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
      dialogShown: false
    };
  },
  methods: {
    showCode(attempt) {
      this.attempt = attempt;
      this.dialogShown = true;
    }
  }
}
</script>
