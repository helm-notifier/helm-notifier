<template>
  <div id="app">
    <nav class="navbar navbar-light bg-light mb-2">
      <router-link to="/repos" class="navbar-brand">
        Helm Notifier
      </router-link>
      <div class="form-inline">
        <input class="form-control mr-sm-2" type="search" placeholder="search"/>
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'ChartCompare',
  components: {},
  data() {
    return {
      loading: false,
      versions: [],
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
      const { chartName, repoName, versions } = this.$route.params;
      fetch(`https://api.helm-notifier.com/repos/${repoName}/${chartName}/`)
        .then(res => res.json())
        .then((resJson) => {
          this.loading = false;
          this.versions = resJson.chart.versions;
          if (!versions) {
            this.left = this.versions[0].version;
            this.right = this.versions[0].version;
          }
          return resJson;
        });
    },
  },
};
</script>
