<template>
  <div>
    <div class="row">
      <div class="col-sm-3" v-for="chart in charts" v-bind:key="chart.id">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              <router-link :to="{name: 'chartView', params: {
                repoName: chart.repo_name,
                chartName:chart.name
                }}">
                {{ chart.repo_name }}/{{ chart.name }}
              </router-link>
            </h5>
            <h6 class="card-subtitle mb-2 text-muted">Chart Version: {{chart.version}}</h6>
<!--            <a href="/repos/<%= chart.repo.name %>/<%= chart.name %>" class="card-link">-->
<!--              Chart Versions-->
<!--            </a>-->
<!--            <a href="/subscriptions/chartVersionUpdate/<%= chart.id %>" class="card-link">-->
<!--              Subscribe-->
<!--            </a>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Repo',
  created() {
    this.fetchData();
  },
  data() {
    return {
      loading: false,
      charts: [],
    };
  },
  methods: {
    fetchData() {
      // eslint-disable-next-line no-multi-assign=
      this.loading = true;
      const { repoName } = this.$route.params;

      fetch(`https://api.helm-notifier.com/repos/${repoName}`)
        .then(res => res.json())
        .then((resJson) => {
          this.loading = false;
          this.charts = resJson;
          return resJson;
        });
    },
  },
};
</script>

<style scoped>

</style>
