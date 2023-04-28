<template>
<v-container fluid>
  <div v-if="loading" class="d-flex justify-center">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <div v-else>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card class="right-card" outlined>
          <v-tabs v-model="selected" :show-arrows="$vuetify.breakpoint.smAndDown" height="44px">
            <v-tab href="#task">Описание задачи</v-tab>
            <v-tab href="#examples">Примеры тестов</v-tab>
            <v-tab :disabled="attempts.length === 0" href="#attempts">Посылки</v-tab>
          </v-tabs>

          <v-tabs-items v-model="selected" touchless>
            <v-tab-item value="task">
              <v-card class="overflow-y-auto left-card" flat>
                <v-card-title>{{ task.title }}</v-card-title>
                <v-card-subtitle>
                  <div class="mb-2">
                    <v-chip :color="ratingColor" small>
                      {{ ratingText + (task.cf_rating ? ` (${task.cf_rating})` : '') }}
                    </v-chip>

                    <v-btn class="mx-2" icon color="red" @click="likeHandler">
                      <v-icon>{{ task.liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                    </v-btn>
                  </div>

                  <v-tooltip v-for="tag in task.cf_tags_RU" :key="tag" top>
                    <template #activator="{ on, attrs }">
                      <v-chip
                        v-on="on"
                        :to="getTagPath(tag)"
                        class="mr-2 mb-2"
                        small
                        v-bind="attrs"
                      >
                        {{ tag }}
                      </v-chip>
                    </template>
                    <span>Перейти к задачам по тегу {{ tag }}</span>
                  </v-tooltip>
                </v-card-subtitle>

                <v-card-text>
                  <vue-mathjax :formula="task.description" :safe="false" />
                  <vue-mathjax :formula="task.input" :safe="false" />
                  <vue-mathjax :formula="task.output" :safe="false" />
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item value="examples">
              <v-card class="overflow-y-auto left-card" flat>
                <examples-tab
                  :examples="examples"
                  :limits="limits"
                  :note="task.note"
                  @show:snackbar="(options) => $emit('show:snackbar', options)"
                />
              </v-card>
            </v-tab-item>

            <v-tab-item value="attempts">
              <v-card class="overflow-y-auto left-card" flat>
                <attempts-tab
                  :attempts="attempts"
                  @show:snackbar="(options) => $emit('show:snackbar', options)"
                />
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>

      <v-col v-if="!$vuetify.breakpoint.xsOnly" cols="12" sm="6">
        <v-card class="d-flex right-card flex-column justify-space-between" outlined>
          <v-card-actions>
            <v-spacer />
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn v-on="on" text color="secondary" @click="setDifficulty(task, -1)" v-bind="attrs">
                  <span>Проще</span>
                  <v-icon right>mdi-arrow-down-bold</v-icon>
                </v-btn>
              </template>
              <span>Пропустить и получить задачу попроще</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn v-on="on" text color="secondary" @click="setDifficulty(task, 1)" v-bind="attrs">
                  <span>Сложнее</span>
                  <v-icon right>mdi-arrow-up-bold</v-icon>
                </v-btn>
              </template>
              <span>Пропустить и получить задачу посложнее</span>
            </v-tooltip>
          </v-card-actions>
          <v-divider />

          <code-editor
            v-model="code"
            :languages="[['cpp', 'C++']]"
            :copy_code="false"
            count_lines
            width="auto"
            height="calc(100vh - 56px - 24px - 44px - 5px - 52px - 7px)"
            border_radius="0px"
            theme="light"
          />

          <v-divider />
          <v-card-actions>
            <v-btn text color="secondary" @click="$refs.fileInput.click()">
              <v-icon left>mdi-upload</v-icon>
              Загрузить файл
            </v-btn>
            <input
              ref="fileInput"
              class="d-none"
              type="file"
              accept=".cpp"
              @change="handleFileChange"
            >

            <div class="ml-auto">
              <v-btn
                v-if="isTaskSolved"
                :class="{ 'animate__animated animate__flash animate__infinite' : highlightButton }"
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
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <recommendations-form
    v-model="dialogShown"
    :code="lastAttempt.code"
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

const DEFAULT_CODE = '// #include <bits/stdc++.h> Won\'t compile!\r\n#include <iostream>\r\n\r\nint main() {\r\n    // Your code will be here\r\n    return 0;\r\n}\r\n';

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
      code: DEFAULT_CODE,
      difficulty: 1,
      checkSolutionLoading: false,
      dialogShown: false,
      selected: null,
      examples: [],
      attempts: [],
      highlightButton: false
    };
  },
  watch: {
    code(value) {
      if (value === DEFAULT_CODE) {
        return;
      }

      window.addEventListener('beforeunload', this.handleReload, { capture: true });
    }
  },
  computed: {
    isTaskSolved() {
      if (this.attempts.length === 0) {
        return false;
      }
      return !this.lastAttempt.loading && this.lastAttempt.testsPassed === this.lastAttempt.testsTotal;
    },
    lastAttempt() {
      return this.attempts.length === 0 ? {} : this.attempts[this.attempts.length - 1];
    },
    checkSolutionButtonColor() {
      return this.isTaskSolved ? 'secondary' : 'primary';
    },
    ratingColor() {
      const { cf_rating } = this.task;
      if (cf_rating <= 1200) {
        return 'purple lighten-2';
      }
      if (cf_rating <= 1600) {
        return 'indigo lighten-2';
      }
      if (cf_rating <= 1900) {
        return 'blue lighten-1';
      }
      if (cf_rating <= 2200) {
        return 'green';
      }
      if (cf_rating <= 2500) {
        return 'yellow';
      }
      if (cf_rating <= 2900) {
        return 'orange';
      }
      if (cf_rating <= 3500) {
        return 'red lighten-2';
      }
      return '';
    },
    ratingText() {
      const { cf_rating } = this.task;
      if (!cf_rating) {
        return 'рейтинг неизвестен';
      }
      if (cf_rating <= 1200) {
        return 'новичок';
      }
      if (cf_rating <= 1600) {
        return 'ученик';
      }
      if (cf_rating <= 1900) {
        return 'эксперт';
      }
      if (cf_rating <= 2200) {
        return 'элита';
      }
      if (cf_rating <= 2500) {
        return 'мастер';
      }
      if (cf_rating <= 2900) {
        return 'гроссмейстер';
      }
      if (cf_rating <= 3500) {
        return 'глобальная элита';
      }
      return '';
    }
  },
  created() {
    this.$http
      .get(`/get_task_by_id?id=${this.id}`)
      .then(({ data }) => {
        const description = data.task_ru === '' ? data.description : data.task_ru;
        const title = data.name_ru === '' ? data.name.split('_')[1] : data.name_ru;

        this.task = {
          id: data.id,
          title,
          description,
          input: data.input,
          output: data.output,
          note: data.note,
          link: data.link,
          rating: data.cf_rating,
          cf_rating: data.cf_rating,
          cf_tags_RU: data.cf_tags_RU,
          cf_tags_ID: data.cf_tags_ID,
          liked: false
        };

        this.limits = {
          memory_limit_bytes: data.memory_limit_bytes,
          time_limit: data.time_limit
        };

        for(let i = 1; i < data.public_tests.length; i += 4) {
          const input = data.public_tests[i];
          const output = data.public_tests[i + 2];
          if (input === '' && output === '') {
            continue;
          }

          this.examples.push({ input, output });
        }

        if (!this.isAuthorized) {
          return;
        }

        this.$http
          .get('/get_like_tasks')
          .then(({ data: { tasks } }) => {
            if (!tasks) {
              return;
            }

            const id = parseInt(this.id);
            const liked = tasks.findIndex(((task) => task.id === id)) !== -1;
            this.$set(this.task, 'liked', liked);
          });

        this.$http
          .get(`/get_send_tasks_by_task_id?id=${this.id}`)
          .then(({ data: { tasks } }) => {
            this.attempts = tasks.map((task) => {
              return {
                testsPassed: task.tests_passed,
                testsTotal: task.tests_total,
                checkTime: task.check_time,
                checkResult: task.check_result,
                checkMessage: task.check_message,
                code: task.code_text,
                loading: false,
                highlightButton: false
              };
            });
          });
      })
      .finally(() => {
        this.loading = false;
      });
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleReload, { capture: true });
  },
  methods: {
    handleReload(e) {
      if (!window.location.pathname.startsWith('/task/')) {
        return;
      }

      e.preventDefault();
      return e.returnValue = '';
    },
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
      }, 500);

      const params = {
        task_id: parseInt(this.id),
        solution: this.code
      };

      this.attempts.push({
        testsPassed: 0,
        testsTotal: 0,
        checkTime: 0,
        checkResult: 0,
        checkMessage: '',
        code: this.code,
        loading: true,
        highlightButton: false
      });
      const attempt = this.attempts[this.attempts.length - 1];

      this.selected = 'attempts';
      this.$http
        .post('/check_solution', params)
        .then(({ data: { testsPassed, testsTotal, checkTime, checkResult, checkMessage } }) => {
          this.$set(attempt, 'testsPassed', testsPassed);
          this.$set(attempt, 'testsTotal', testsTotal);
          this.$set(attempt, 'checkTime', checkTime);
          this.$set(attempt, 'checkResult', checkResult);
          this.$set(attempt, 'checkMessage', checkMessage);

          const attemptIndex = this.attempts.indexOf(attempt);

          const text = testsPassed === testsTotal
            ? `В посылке №${attemptIndex} все тесты прошли успешно`
            : `В посылке №${attemptIndex} прошло ${testsPassed} из ${testsTotal} тестов`;
          const color = testsPassed === testsTotal
            ? 'success'
            : 'warning';

          this.$emit('show:snackbar', { text, color });
          if (testsPassed === testsTotal) {
            this.$emit('update:shock-mode');
          }

          if (this.highlightButton) {
            return;
          }

          // Запускаем мерцание
          this.$nextTick().then(() => {
            const timeout = 1500;

            setTimeout(() => {
              this.highlightButton = true;
              if (!this.isTaskSolved) {
                this.$set(attempt, 'highlightButton', this.highlightButton);
              }
            }, timeout);

            // Останавливаем мерцание
            setTimeout(() => {
              this.highlightButton = false;
              this.$set(attempt, 'highlightButton', this.highlightButton);
            }, timeout + 4000);
          });
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
    },
    getTagPath(tag) {
      const index = this.task.cf_tags_RU.indexOf(tag);
      if (index === -1) {
        return '';
      }

      const id = this.task.cf_tags_ID[index];
      return `/tasks?tags=${id}`;
    },
    likeHandler() {
      if (!this.isAuthorized) {
        this.$emit(
          'show:snackbar',
          { text: 'Для совершения этого действия необходимо авторизоваться', color: 'warning' }
        );
        this.$emit('show:login-form');
        return;
      }

      if (this.task.liked) {
        this.deleteLike();
      } else {
        this.likeTask();
      }
    },
    likeTask() {
      const params = { task_id: this.task.id };

      this.$http.post('/like_task', params)
        .then(() => {
          this.$emit('show:snackbar', { text: 'Задача добавлена в избранное', color: 'success' });
        })
        .finally(() => {
          this.task.liked = true;
        });
    },
    deleteLike() {
      const params = { task_id: this.task.id };

      this.$http.post('/delete_like', params)
        .then(() => {
          this.$emit('show:snackbar', { text: 'Задача удалена из избранного', color: 'success' });
        })
        .finally(() => {
          this.task.liked = false;
        });
    },
    handleFileChange(e) {
      const file = e.target.files[0];
      if (!file.name.endsWith('.cpp')) {
        this.$emit('show:snackbar', { text: 'Файл должен иметь следующее расширение - cpp', color: 'error' });
        return;
      }

      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        this.code = e.target.result;
        this.$emit(
          'show:snackbar',
          { text: 'Файл успешно загружен', color: 'success' }
        );
      };
      fileReader.onerror = () => {
        this.$emit(
          'show:snackbar',
          { text: 'В ходе загрузки файла произошла неизвестная ошибка', color: 'error' }
        );
      };

      fileReader.readAsText(file);
    },
    setDifficulty(task, difficulty) {
      if (!this.isAuthorized) {
        this.$emit(
          'show:snackbar',
          { text: 'Для совершения этого действия необходимо авторизоваться', color: 'warning' }
        );
        this.$emit('show:login-form');
        return;
      }

      const params = { task_id: task.id, difficulty };

      this.$http.post('/set_difficulty', params).then(() => {
        this.$emit('show:snackbar', { text: 'Задача была оценена', color: 'success' });
        this.$router.push('/');
      });
    }
  }
}
</script>

<style>
.left-card {
  min-height: 100%;
  max-height: 100%;
}

.right-card {
  min-height: 100%;
  max-height: 100%;
}

/* Используется для стилизации заголовков внутри описания задачи */
.section-title {
  font-size: 115%;
  font-weight: bold;
}

/* Используется для решения проблем с отображением нумерации трехзначных цифр */
.code_editor > .editor > .line-numbers {
  width: 38px;
  padding-right: 5px;
  font-family: Consolas, Monaco, monospace;
}

/* Используется для отображения цвета нумерации */
.code_editor > .editor > .line-numbers > span::before {
  color: #a0a1a7;
}
</style>
