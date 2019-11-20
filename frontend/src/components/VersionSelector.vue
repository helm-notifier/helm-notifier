<template>
      <button
      class="btn btn-secondary btn-sm dropdown-toggle"
      type="button"
      id="dropdownMenuButton"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      Selected Version: {{ this.$route.params.version || versions[0].version}}
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <div class="px-2 py-1">
            <input v-model="searchClient" type="search">
          </div>
          <div class="dropdown-divider"></div>
          <router-link
            class="dropdown-item"
            v-for="version in filteredVersions"
            :key="version.id"
            :to="{name: 'chartView', params: {
                repoName: $route.params.repoName,
                chartName: $route.params.chartName,
                version: version.version
                }}"
          >
            {{version.version}}
          </router-link>
        </div>
    </button>
  </template>

<script>
export default {
  name: 'VersionSelector.vue',
  props: {
    versions: Array,
  },
  data() {
    return {
      searchClient: '',
    };
  },
  computed: {
    filteredVersions() {
      const search = this.searchClient;
      if (!search) return this.versions.slice(0, this.limit);
      return this.versions
        .filter(c => c.version.toLowerCase().indexOf(search) > -1)
        .slice(0, this.limit);
    },
    limit() {
      let limit = 10;
      if (this.versions.length <= limit) {
        limit = this.versions.length;
      }
      return limit;
    },
  },
};
</script>

<style scoped>

</style>
