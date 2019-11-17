<template>
  <div class="dropdown pb-1">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      id="dropdownMenuButton"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      Selected Version: {{ this.$route.params.version || versions[0].version}}
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <div class="px-2 py-1">
        <input v-model="searchClient" type="search">
      </div>
      <div class="dropdown-divider"></div>
      <router-link class="dropdown-item" v-for="version in filteredVersions" :key="version.id"
                   :to="'/repos/stable/grafana/'+version.version"
      >
        {{version.version}}
      </router-link>
    </div>
  </div>
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
      if (!search) return this.versions;
      console.log(search);
      return this.versions.filter(c => c.version.toLowerCase().indexOf(search) > -1);
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
