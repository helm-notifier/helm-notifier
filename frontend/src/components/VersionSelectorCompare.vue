<template>
  <div class="btn-group mr-1">
    <button
      class="btn btn-secondary btn-sm dropdown-toggle"
      type="button"
      :id="'test'+side"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      {{version}}
    </button>
    <div class="dropdown-menu" :aria-labelledby="'test'+side">
      <div class="px-2 py-1">
        <input v-model="searchClient" type="search">
      </div>
      <div class="dropdown-divider"></div>
      <div
        class="dropdown-item"
        v-for="version in filteredVersions"
        v-bind:key="version.id+compSide"
        v-on:click="sendVersionChange(version.version)"
      >
        <router-link :to="{name: 'chartCompare', params: {
                repoName: $route.params.repoName,
                chartName: $route.params.chartName,
                versions: side === 'left' ?
                `${version.version}...${right}`
                :
                `${left}...${version.version}`
                }}">
          {{version.version}}
        </router-link>

      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'VersionSelectorCompare',
  props: {
    versions: Array,
    left: String,
    right: String,
    side: String,
    version: String,
  },
  data() {
    return {
      searchClient: '',
    };
  },
  methods: {
    sendVersionChange(version) {
      this.$emit('versionCompareChange', this.compSide, version);
    },
  },
  computed: {
    compSide() {
      console.log(this.side);
      return this.side;
    },
    filteredVersions() {
      const search = this.searchClient;
      if (!search) return this.versions.slice(0, this.limit);
      return this.versions
        .filter(c => c.version.toLowerCase()
          .indexOf(search) > -1)
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
