<template>
 <div>
   <div v-if="chartTree" class="content">
     <ul class="list-group">
       <li class="list-group-item" v-for="item in chartTree.children" v-bind:key="item.path" >
         <img src="/iconic/folder.svg" alt="folder" v-if="item.type === 'directory'">
         <img src="/iconic/file.svg" alt="folder" v-if="item.type === 'file'">
         {{ item.name }}
       </li>
     </ul>
   </div>

 </div>
</template>

<script>
import marked from 'marked';

export default {
  name: 'HelloWorld',
  props: {
    chartTree: Object,
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
