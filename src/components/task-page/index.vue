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
            <v-tab href="#task">Описание задачи</v-tab>
            <v-tab href="#examples">Примеры тестов</v-tab>
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
                <examples-tab :examples="examples" :limits="limits" />
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
        <v-card class="d-flex right-card flex-column justify-space-between">
          <code-editor
            v-model="code"
            :languages="[['cpp', 'C++']]"
            :copy_code="false"
            count_lines
            spellcheck
            width="auto"
            height="771px"
            border_radius="0px"
            theme="light"
          />

          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              v-if="isTaskSolved"
              text
              color="primary"
              @click="showRecommendationsForm"
            >
              Перейти к следующей задаче
            </v-btn>
            <v-btn
              :loading="checkSolutionLoading"
              :color="checkSolutionButtonColor"
              text
              @click="checkSolution"
            >
              Проверить решение
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <recommendations-form
    v-model="dialogShown"
    :code="code"
    :difficulty="difficulty"
    :task="task"
  />
</v-container>
</template>

<script>
import CodeEditor from 'simple-code-editor/project/package/CodeEditor';
import RecommendationsForm from '@/dialogs/recommendations-form';
import VueMathjax from '@/shared/components/vue-mathjax';
import ExamplesTab from './components/examples-tab';
import AttemptsTab from './components/attempts-tab';

export default {
  name: 'TaskPage',
  props: {
    id: String,
    isAuthorized: Boolean
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
      limits: {},
      code: '// #include <what_you_use>\r\n\r\nint main() {\r\n    // your code here\r\n    return 0;\r\n}',
      difficulty: 1,
      checkSolutionLoading: false,
      dialogShown: false,
      selected: null,
      examples: [],
      attempts: []
    };
  },
  computed: {
    isTaskSolved() {
      if (this.attempts.length === 0) {
        return false;
      }

      const lastAttempt = this.attempts[0];
      return lastAttempt.testsPassed === lastAttempt.testsTotal && !lastAttempt.loading;
    },
    checkSolutionButtonColor() {
      if (this.isTaskSolved) {
        return 'secondary';
      }
      return 'primary';
    }
  },
  created() {
    this.$http
      .get(`/get_task_by_id?id=${this.id}`)
      .then(({ data }) => {
        const description = data.task_ru === '' ? data.description : data.task_ru;

        this.task = {
          id: data.id,
          title: data.name,
          description,
          input: data.input,
          output: data.output,
          note: data.note,
          link: data.link,
          rating: data.cf_rating
        };

        this.limits = {
          memory_limit_bytes: data.memory_limit_bytes,
          time_limit: data.time_limit
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
      if (!this.isAuthorized) {
        this.$emit(
          'show:snackbar',
          { text: 'Для совершения этого действия необходимо авторизоваться', color: 'warning' }
        );
        this.$emit('show:login-form');
        return;
      }

     this.checkSolutionLoading = true;
      setTimeout(() => {
        this.checkSolutionLoading = false;
      }, 300);

      const params = {
        task_id: parseInt(this.id),
        solution: this.code
      };

      this.attempts.unshift({
        testsPassed: 0,
        testsTotal: 0,
        buildTime: 0,
        checkTime: 0,
        code: this.code,
        loading: true
      });
      const attempt = this.attempts[0];

      this.selected = 'attempts';
      this.$http
        .post('/check_solution', params)
        .then(({ data: { testsPassed, testsTotal, buildTime, checkTime } }) => {
          this.$set(attempt, 'testsPassed', testsPassed);
          this.$set(attempt, 'testsTotal', testsTotal);
          this.$set(attempt, 'buildTime', buildTime);
          this.$set(attempt, 'checkTime', checkTime);

          const reversedIndex = this.attempts.length - this.attempts.indexOf(attempt);

          const text = testsPassed === testsTotal
            ? `В посылке ${reversedIndex} все тесты прошли успешно`
            : `В посылке ${reversedIndex} прошло ${testsPassed} из ${testsTotal} тестов`;
          const color = testsPassed === testsTotal
            ? 'success'
            : 'warning';

          this.$emit('show:snackbar', { text, color });
        })
        .finally(() => {
          this.$set(attempt, 'loading', false);
        });
    },
    showRecommendationsForm() {
      if (this.attempts.length < 4) {
        this.difficulty = 2;
      } else if (this.attempts.length < 10) {
        this.difficulty = 1;
      } else {
        this.difficulty = 0;
      }

      this.dialogShown = true;
    }
  }
}
</script>

<style>
.left-card {
  min-height: 82vh;
  max-height: 82vh;
}

.right-card {
  min-height: 87vh;
  max-height: 87vh;
}

/* Используется для стилизации заголовков внутри описания задачи */
.section-title {
  font-size: 115%;
  font-weight: bold;
}

/* Используется для решения проблем с отображением нумерации трехзначных цифр */
.code_editor > .editor > .line-numbers {
  width: 30px;
}
</style>
