import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/repos' },
  {
    path: '/repos',
    name: 'reposPage',
    component: () => import(/* webpackChunkName: "repos" */ '../views/Repos'),
  },
  {
    path: '/repos/:repoName',
    name: 'repoPage',
    component: () => import(/* webpackChunkName: "repo" */ '../views/Repo'),
  },
  {
    path: '/repos/:repoName/:chartName/compare/:versions?',
    name: 'chartCompare',
    component: () => import(/* webpackChunkName: "ChartCompare" */ '../views/ChartCompare.vue'),
  },
  {
    path: '/repos/:repoName/:chartName/:version?/:path?',
    name: 'chartView',
    component: () => import(/* webpackChunkName: "chartName" */ '../views/Chart.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
