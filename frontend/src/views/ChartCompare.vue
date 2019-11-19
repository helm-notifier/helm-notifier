<template>

  <div class="container">

    <div v-if="loading">
      Loading...
    </div>
    <VersionSelectorCompare
      v-if="versions.length"
      v-on:versionCompareChange="messageReceived"
      :version="left"
      :left="left"
      :right="right"
      :versions="versions"
      :side="'left'"
    />
    <VersionSelectorCompare
      v-if="versions.length"
      v-on:versionCompareChange="messageReceived"
      :version="right"
      :left="left"
      :right="right"
      :versions="versions"
      :side="'right'"
    />
    <pre v-text="diff"></pre>
  </div>
</template>

<script>
import VersionSelectorCompare from '@/components/VersionSelectorCompare.vue';

export default {
  name: 'ChartCompare',
  components: { VersionSelectorCompare },
  created() {
    this.fetchData();
    this.fetchDiff();
  },
  data() {
    const { versions } = this.$route.params;
    let left = '';
    let right = '';
    if (versions) {
      [left, right] = versions.split('...');
    }
    return {
      loading: false,
      versions: [],
      left,
      right,
      diff: '',
    };
  },
  methods: {
    messageReceived(side, version) {
      if (side === 'left') {
        this.left = version;
      } else if (side === 'right') {
        this.right = version;
      }
      this.fetchDiff();
    },
    fetchDiff() {
      if (this.left !== this.right) {
        const { chartName, repoName, versions } = this.$route.params;
        fetch(`https://api.helm-notifier.com/repos/${repoName}/${chartName}/compare/${versions}`)
          .then(res => res.text())
          .then((resText) => {
            this.diff = resText;
            return resText;
          });
      } else {
        this.diff = '';
      }
    },
    fetchData() {
      this.loading = true;
      const { chartName, repoName, version } = this.$route.params;
      fetch(`https://api.helm-notifier.com/repos/${repoName}/${chartName}/${version === 'latest' ? '' : version || ''}`)
        .then(res => res.json())
        .then((resJson) => {
          this.loading = false;
          this.versions = resJson.chart.versions;
          this.left = this.versions[0].version;
          this.right = this.versions[0].version;
          return resJson;
        });
    },
  },
};
</script>

<style scoped>

</style>
