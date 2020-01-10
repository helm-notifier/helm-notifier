<template>
  <div>
    <div class="row">
      <div class="col-sm-3" v-for="chart in charts" v-bind:key="chart.id">
        <ChartListItem :chart="chart"/>
      </div>
    </div>
  </div>
</template>

<script>
import ChartListItem from '@/components/chartListItem.vue';

export default {
  name: 'Repo',
  components: { ChartListItem },
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
      console.log('test');
      const { repoName } = this.$route.params;
      const { query } = this.$route.query;
      console.log(this.$route.query);
      if (repoName) {
        fetch(`https://api.helm-notifier.com/repos/${repoName}`)
          .then(res => res.json())
          .then((resJson) => {
            this.loading = false;
            this.charts = resJson;
            return resJson;
          });
      } else {
        fetch(`https://api.helm-notifier.com/search?query=${query}`)
          .then(res => res.json())
          .then((resJson) => {
            this.loading = false;
            this.charts = resJson;
            return resJson;
          });
      }
    },
  },
};
</script>

<style scoped>

</style>
