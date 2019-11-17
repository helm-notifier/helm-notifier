<template>
  <div id="app">
    <nav class="navbar navbar-light bg-light mb-2">
      <a class="navbar-brand" href="/">
        Helm Notifier
      </a>
      <form class="form-inline" action="/search">
        <input class="form-control mr-sm-2" type="search" aria-label="Search" name="query">
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </form>
    </nav>
    <router-view />
  </div>
</template>
