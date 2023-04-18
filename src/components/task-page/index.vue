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
                <v-tooltip top>
                  <template #activator="{ on, attrs }">
                    <v-chip
                      v-on="on"
                      :color="ratingColor"
                      small
                      v-bind="attrs"
                    >
                      {{ task.cf_rating }}
                    </v-chip>
                  </template>
                  <span>{{ ratingText }}</span>
                </v-tooltip>

                <v-btn :disabled="task.liked" class="mx-2" icon @click="likeTask">
                  <v-icon>mdi-thumb-up-outline</v-icon>
                </v-btn>
                <v-btn :disabled="!task.liked" icon @click="deleteLike">
                  <v-icon>mdi-thumb-down-outline</v-icon>
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
              <vue-mathjax :formula="task.note" :safe="false" />
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
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <v-chip
                          v-on="on"
                          :color="ratingColor"
                          small
                          v-bind="attrs"
                        >
                          {{ task.cf_rating }}
                        </v-chip>
                      </template>
                      <span>{{ ratingText }}</span>
                    </v-tooltip>

                    <v-btn :disabled="task.liked" class="mx-2" icon @click="likeTask">
                      <v-icon>mdi-thumb-up-outline</v-icon>
                    </v-btn>
                    <v-btn :disabled="!task.liked" icon @click="deleteLike">
                      <v-icon>mdi-thumb-down-outline</v-icon>
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
            height="80vh"
            border_radius="0px"
            theme="light"
          />

          <v-divider />
          <v-card-actions>
            <v-spacer />

            <v-menu v-if="isTaskSolved" :value="true" :close-on-click="false" offset-y top>
              <template #activator="{}">
                <v-btn text color="primary" @click="showRecommendationsForm">
                  Перейти к следующей задаче
                </v-btn>
              </template>

              <v-alert class="mb-0" dismissible dense type="info">
                Теперь можно перейти к следующей задаче
              </v-alert>
            </v-menu>
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
      code: '// #include <bits/stdc++.h> Won\'t compile!\r\n#include <iostream>\r\n\r\nint main() {\r\n    // Your code will be here\r\n    return 0;\r\n}',
      difficulty: 1,
      checkSolutionLoading: false,
      dialogShown: false,
      selected: null,
      examples: [],
      attempts: [],
      swipeDirection: 'right'
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
        loading: true
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
    likeTask() {
      if (!this.isAuthorized) {
        this.$emit(
          'show:snackbar',
          { text: 'Для совершения этого действия необходимо авторизоваться', color: 'warning' }
        );
        this.$emit('show:login-form');
        return;
      }

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
      if (!this.isAuthorized) {
        this.$emit(
          'show:snackbar',
          { text: 'Для совершения этого действия необходимо авторизоваться', color: 'warning' }
        );
        this.$emit('show:login-form');
        return;
      }

      const params = { task_id: this.task.id };

      this.$http.post('/delete_like', params)
        .then(() => {
          this.$emit('show:snackbar', { text: 'Задача убрана из избранного', color: 'success' });
        })
        .finally(() => {
          this.task.liked = false;
        });
    }
  }
}
</script>

<style>
.left-card {
  min-height: 80vh;
  max-height: 80vh;
}

.right-card {
  min-height: calc(80vh + 48px);
  max-height: calc(80vh + 48px);
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
