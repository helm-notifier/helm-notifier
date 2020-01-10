<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">
        <router-link :to="{name: 'chartView', params: {
                repoName: chart.repo_name || chart.repo.name ,
                chartName:chart.name
                }}">
          {{ chart.repo_name || chart.repo.name }}/{{ chart.name }}
        </router-link>
      </h5>
      <h6 class="card-subtitle mb-2 text-muted">Chart Version: {{chart.version}}</h6>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chartListItem',
  props: {
    chart: Object,
  },
};
</script>

<style scoped>

</style>
