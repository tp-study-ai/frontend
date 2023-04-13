<template>
<div>
  <v-simple-table>
    <thead>
      <tr>
        <th>Номер</th>
        <th>Пройдено тестов</th>
        <th>Общее время тестирования</th>
        <th>Код программы</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(attempt, id) in attempts" :key="id">
        <td>{{ attempts.length - id }}</td>

        <td v-if="attempt.loading"><v-progress-linear indeterminate color="primary" /></td>
        <td v-else :class="getTextClass(attempt)">{{ attempt.testsPassed }} / {{ attempt.testsTotal }}</td>

        <td>{{ attempt.checkTime }}</td>
        <td>
          <v-btn class="pa-0" text color="primary" @click="showCode(attempt)">Показать</v-btn>
        </td>
      </tr>
    </tbody>
  </v-simple-table>

  <v-dialog v-model="dialogShown">
    <v-card>
      <div class="d-flex">
        <v-card-title>Код программы</v-card-title>
        <v-btn class="ml-auto my-auto mr-2" icon @click="dialogShown = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <code-editor
        v-model="attempt.code"
        :languages="[['cpp', 'C++']]"
        :copy_code="false"
        read_only
        count_lines
        spellcheck
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
      dialogShown: false
    };
  },
  methods: {
    getTextClass(attempt) {
      if (attempt.testsPassed === attempt.testsTotal) {
        return 'success--text';
      }
      return 'warning--text';
    },
    showCode(attempt) {
      this.attempt = attempt;
      this.dialogShown = true;
    }
  }
}
</script>
