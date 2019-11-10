<template>
    <div>
      <ul>
        <li class="list-group-item" v-for="repo in repos" v-bind:key="repo.id" >
          {{ repo.name }} {{repo.url}}
          <router-link :to="{ name: 'repoPage', params: { repoName: repo.name }}">
            browse
          </router-link>
        </li>
      </ul>
    </div>
</template>

<script>
export default {
  name: 'Repos',
  created() {
    this.fetchData();
  },
  data() {
    return {
      loading: false,
      repos: [],
    };
  },
  methods: {
    fetchData() {
      // eslint-disable-next-line no-multi-assign=
      this.loading = true;
      fetch('http://localhost:5000/repos/')
        .then(res => res.json())
        .then((resJson) => {
          this.loading = false;
          this.repos = resJson;
          return resJson;
        });
    },
  },
};
</script>

<style scoped>

</style>
