<template>
<v-container class="px-0" fluid>
  <div v-if="loading" class="d-flex justify-center">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <div v-else>
    <v-row v-touch="swipeOptions">
      <v-col cols="12" md="6">
        <div v-if="$vuetify.breakpoint.smAndDown">
          <v-card v-if="swipeDirection === 'right'">
            <v-card-title>{{ task.title }}</v-card-title>
            <v-card-subtitle>
              <div class="mb-2">
                <v-chip :color="ratingColor" small>{{ `${ratingText} (${task.cf_rating})` }}</v-chip>

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

          <v-card v-else>
            <v-card-title>Примеры тестов</v-card-title>
            <examples-tab
              :examples="examples"
              :limits="limits"
              :note="task.note"
              @show:snackbar="(options) => $emit('show:snackbar', options)"
            />
          </v-card>
        </div>

        <v-card v-else>
          <v-tabs v-model="selected">
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
                    <v-chip :color="ratingColor" small>{{ `${ratingText} (${task.cf_rating})` }}</v-chip>

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
            width="auto"
            height="calc(82vh - 5px)"
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
      code: '// #include <bits/stdc++.h> Won\'t compile!\r\n#include <iostream>\r\n\r\nint main() {\r\n    // Your code will be here\r\n    return 0;\r\n}\r\n',
      difficulty: 1,
      checkSolutionLoading: false,
      dialogShown: false,
      selected: null,
      examples: [],
      attempts: [],
      swipeDirection: 'right',
      highlightButton: false
    };
  },
  computed: {
    isTaskSolved() {
      if (this.attempts.length === 0) {
        return false;
      }

      const latAttempt = this.attempts[0];
      return !latAttempt.loading && latAttempt.testsPassed === latAttempt.testsTotal;
    },
    checkSolutionButtonColor() {
      if (this.isTaskSolved) {
        return 'secondary';
      }
      return 'primary';
    },
    swipeOptions() {
      return {
        left: () => this.swipe('left'),
        right: () => this.swipe('right')
      };
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
        return 'red lighten-1';
      }
      return '';
    },
    ratingText() {
      const { cf_rating } = this.task;
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

        this.task = {
          id: data.id,
          title: data.name,
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
      }, 500);

      const params = {
        task_id: parseInt(this.id),
        solution: this.code
      };

      this.attempts.unshift({
        testsPassed: 0,
        testsTotal: 0,
        checkTime: 0,
        checkResult: 0,
        checkMessage: '',
        code: this.code,
        loading: true,
        highlightButton: false
      });
      const attempt = this.attempts[0];

      this.selected = 'attempts';
      this.$http
        .post('/check_solution', params)
        .then(({ data: { testsPassed, testsTotal, checkTime, checkResult, checkMessage } }) => {
          this.$set(attempt, 'testsPassed', testsPassed);
          this.$set(attempt, 'testsTotal', testsTotal);
          this.$set(attempt, 'checkTime', checkTime);
          this.$set(attempt, 'checkResult', checkResult);
          this.$set(attempt, 'checkMessage', checkMessage);

          const reversedIndex = this.attempts.length - this.attempts.indexOf(attempt);

          const text = testsPassed === testsTotal
            ? `В посылке №${reversedIndex} все тесты прошли успешно`
            : `В посылке №${reversedIndex} прошло ${testsPassed} из ${testsTotal} тестов`;
          const color = testsPassed === testsTotal
            ? 'success'
            : 'warning';

          this.$emit('show:snackbar', { text, color });
          if (this.highlightButton) {
            return;
          }

          // Запускаем мерцание
          this.$nextTick(() => {
            this.highlightButton = true;
            if (!this.isTaskSolved) {
              this.$set(attempt, 'highlightButton', this.highlightButton);
            }
          });

          // Останавливаем мерцание
          setTimeout(() => {
            this.highlightButton = false;
            this.$set(attempt, 'highlightButton', this.highlightButton);
          }, 5000);
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
    swipe(swipeDirection) {
      this.swipeDirection = swipeDirection;
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
  min-height: calc(82vh + 48px);
  max-height: calc(82vh + 48px);
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
