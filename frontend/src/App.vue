<template>
  <div id="app">
    <nav class="navbar navbar-light bg-light mb-2">
      <a class="navbar-brand" href="/">
        <router-link to="/repos">
          Helm Notifier
        </router-link>
      </a>
    </nav>
    <router-view />
  </div>
</template>
