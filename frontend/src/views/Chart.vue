<template>
  <div class="container">
    <div v-if="loading">
      Loading...
    </div>
    <VersionSelector v-bind:versions="versions"></VersionSelector>
    <router-link class="ml-1 btn btn-sm btn-success" :to="{name: 'chartCompare', params: {
                repoName: $route.params.repoName,
                chartName: $route.params.chartName,
                }}">compare</router-link>

    <FileBrowser v-bind:chartTree="chartTree" v-bind:loading="loading"/>
    <Markdown v-bind:markdown="readmeFile.content" v-bind:loading="loading" />
  </div>
</template>
<script>
// @ is an alias to /src
import FileBrowser from '@/components/FileBrowser.vue';
import Markdown from '@/components/Markdown.vue';
import VersionSelector from '@/components/VersionSelector.vue';


export default {
  name: 'home',
  components: {
    FileBrowser,
    Markdown,
    VersionSelector,
  },
  created() {
    this.fetchData();
  },
  data() {
    return {
      loading: false,
      error: null,
      chartTree: {},
      readmeFile: {},
      versions: [],
    };
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    fetchData() {
      // eslint-disable-next-line no-multi-assign=
      this.loading = true;
      const { chartName, repoName, version } = this.$route.params;
      fetch(`https://api.helm-notifier.com/repos/${repoName}/${chartName}/${version === 'latest' ? '' : version || ''}`)
        .then(res => res.json())
        .then((resJson) => {
          this.loading = false;
          this.chartTree = resJson.chartTree;
          this.versions = resJson.chart.versions;
          this.readmeFile = resJson.chartTree.children.find(file => file.name.toLowerCase() === 'readme.md');
          return resJson;
        });
    },
  },
};
</script>
