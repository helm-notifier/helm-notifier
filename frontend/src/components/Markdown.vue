<template>
  <div>
    <div v-if="markdown">
      <span v-html="markdownHtml"></span>
    </div>
  </div>
</template>

<script>
import marked from 'marked';

export default {
  name: 'Markdown',
  props: {
    markdown: String,
  },
  computed: {
    markdownHtml() {
      return marked(this.markdown);
    },
  },
  data() {
    return {
      error: null,
    };
  },
};
</script>
