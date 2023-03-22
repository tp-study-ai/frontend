<template>
<div>
  <div v-if="loading">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <div v-else>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="overflow-y-auto card">
          <v-card-title>{{ task.title }}</v-card-title>
          <v-card-text>
            <vue-mathjax :formula="task.description" :safe="false" />
            <vue-mathjax :formula="task.input" :safe="false" />
            <vue-mathjax :formula="task.output" :safe="false" />
            <vue-mathjax :formula="task.note" :safe="false" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="!$vuetify.breakpoint.smAndDown" cols="12" sm="6">
        <v-card class="card">
          <code-editor
            v-model="code"
            :languages="[['cpp', 'C++']]"
            width="auto"
            height="650px"
            theme="light"
          />

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="sendFakeRequst">Проверить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</div>
</template>

<script>
import { VueMathjax } from 'vue-mathjax';
import CodeEditor from 'simple-code-editor';

export default {
  name: 'TaskPage',
  props: {
    id: String,
  },
  components: {
    'vue-mathjax': VueMathjax,
    CodeEditor
  },
  data() {
    return {
      loading: false,
      task: {},
      code: '// #include <what_you_use>\r\n\r\nint main() {\r\n    // your code here\r\n    return 0;\r\n}'
    };
  },
  created() {
    this.loading = true;

    this.$http
      .get(`/get_task/details/${this.id}`)
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
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    sendFakeRequst() {

    }
  }
}
</script>

<style>
.card {
  min-height: 700px;
  max-height: 700px;
}

.section-title {
  font-size: 115%;
  font-weight: bold
}
</style>
