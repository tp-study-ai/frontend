<template>
<v-container class="px-0" fluid>
  <div v-if="loading" class="d-flex justify-center">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <div v-else>
    <v-row>
      <v-col cols="12" md="6">
        <v-card v-if="$vuetify.breakpoint.smAndDown">
          <v-card-title>{{ task.title }}</v-card-title>
          <v-card-text>
            <vue-mathjax :formula="task.description" :safe="false" />
            <vue-mathjax :formula="task.input" :safe="false" />
            <vue-mathjax :formula="task.output" :safe="false" />
            <vue-mathjax :formula="task.note" :safe="false" />
          </v-card-text>
        </v-card>

        <v-card v-else>
          <v-tabs v-model="selected">
            <v-tab href="#task">Описание</v-tab>
            <v-tab href="#examples">Примеры</v-tab>
            <v-tab :disabled="attempts.length === 0" href="#attempts">Посылки</v-tab>
          </v-tabs>

          <v-tabs-items v-model="selected">
            <v-tab-item value="task">
              <v-card class="overflow-y-auto left-card" flat>
                <v-card-title>{{ task.title }}</v-card-title>
                <v-card-text>
                  <vue-mathjax :formula="task.description" :safe="false" />
                  <vue-mathjax :formula="task.input" :safe="false" />
                  <vue-mathjax :formula="task.output" :safe="false" />
                  <vue-mathjax :formula="task.note" :safe="false" />
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item value="examples">
              <v-card class="overflow-y-auto left-card" flat>
                <examples-tab :examples="examples" />
              </v-card>
            </v-tab-item>

            <v-tab-item value="attempts">
              <v-card class="overflow-y-auto left-card" flat>
                <attempts-tab :attempts="attempts" />
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>

      <v-col v-if="!$vuetify.breakpoint.smAndDown" cols="12" md="6">
        <v-card class="right-card">
          <code-editor
            v-model="code"
            :languages="[['cpp', 'C++']]"
            copy_code
            width="auto"
            height="650px"
            theme="light"
          />

          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn :loading="checkSolutionLoading" text color="primary" @click="checkSolution">
              Проверить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <recommendations-form v-model="dialogShown" />
</v-container>
</template>

<script>
import { VueMathjax } from 'vue-mathjax';
import CodeEditor from 'simple-code-editor';
import RecommendationsForm from '@/dialogs/recommendations-form';
import ExamplesTab from './components/examples-tab';
import AttemptsTab from './components/attempts-tab';

export default {
  name: 'TaskPage',
  props: {
    id: String,
  },
  components: {
    'vue-mathjax': VueMathjax,
    CodeEditor,
    RecommendationsForm,
    ExamplesTab,
    AttemptsTab
  },
  data() {
    return {
      loading: true,
      task: {},
      code: '// #include <what_you_use>\r\n\r\nint main() {\r\n    // your code here\r\n    return 0;\r\n}',
      checkSolutionLoading: false,
      dialogShown: false,
      selected: null,
      examples: [],
      attempts: []
    };
  },
  created() {
    this.$http
      .get(`/get_task_by_id?id=${this.id}`)
      .then(({ data }) => {
        let description = data.task_ru === '' ? data.description : data.task_ru;
        description = description.replaceAll('$$$', '$');
        description = description.replaceAll(String.fromCharCode(92,92), String.fromCharCode(92));

        this.task = {
          id: data.id,
          title: data.name,
          description,
          input: data.input,
          output: data.output,
          note: data.note
        };

        for(let i = 1; i < data.public_tests.length; i += 4) {
          const input = data.public_tests[i].replaceAll('\n', '<br>');
          const output = data.public_tests[i + 2].replaceAll('\n', '<br>');
          this.examples.push({ input, output });
        }
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    checkSolution() {
      this.checkSolutionLoading = true;
      const params = {
        task_id: parseInt(this.id),
        solution: this.code
      };

      this.$http
        .post('/check_solution', params)
        .then(({ data: { testsPassed, testsTotal, buildTime, checkTime } }) => {
          this.attempts.unshift({ testsPassed, testsTotal, buildTime, checkTime, code: this.code });

          const text = testsPassed === testsTotal
            ? 'Все тесты прошли'
            : `Прошло ${testsPassed} из ${testsTotal} тестов`;
          const color = testsPassed === testsTotal
            ? 'success'
            : 'warning';

          this.$emit('show:snackbar', { text, color });
          this.dialogShown = testsPassed === testsTotal;
        })
        .finally(() => {
          this.selected = 'attempts';
          this.checkSolutionLoading = false;
        });
    }
  }
}
</script>

<style>
.left-card {
  min-height: 655.5px;
  max-height: 655.5px;
}

.right-crad {
  min-height: 700px;
  max-height: 700px;
}

.section-title {
  font-size: 115%;
  font-weight: bold
}
</style>
