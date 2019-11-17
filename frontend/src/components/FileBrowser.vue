<template>
 <div>
   <div v-if="compChartTree" class="content">
     <ul class="list-group" v-if="compChartTree.children">
       <li class="list-group-item" v-if="this.$route.params.path">
         <a @click="$router.go(-1)">back</a>
       </li>
       <li class="list-group-item" v-for="item in compChartTree.children" v-bind:key="item.path" >
        <router-link :to="{name: 'chartView', params: {
                repoName: $route.params.repoName,
                chartName: $route.params.chartName,
                path: item.path,
                version: $route.params.version || 'latest',
                }}">
          <img src="/iconic/folder.svg" alt="folder" v-if="item.type === 'directory'">
          <img src="/iconic/file.svg" alt="folder" v-if="item.type === 'file'">
          {{ item.name }}
        </router-link>
       </li>
     </ul>
     <div v-if="compChartTree.type === 'file'">
       <pre v-text="compChartTree.content"></pre>
     </div>
   </div>
 </div>
</template>

<script>
import marked from 'marked';

function findFolder(tree, path) {
  if (tree.path !== path) {
    if (tree.children) {
      return tree.children.map(child => findFolder(child, path));
    }
    return undefined;
  }
  return tree;
}
export default {
  name: 'HelloWorld',
  props: {
    chartTree: Object,
  },
  computed: {
    compChartTree() {
      if (this.chartTree.path) {
        if (this.$route.params.path) {
          // eslint-disable-next-line no-debugger
          // debugger;
          const tree = findFolder(this.chartTree, this.$route.params.path);
          const result = tree.flat(Infinity).filter(el => el != null);
          console.log(result[0]);
          return result[0];
        }
        return this.chartTree;
      }
      return undefined;
    },
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
