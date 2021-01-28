<template>
  <div class="has-text-centered mt-6">
    <p class="title is-3">404 - Page Not Found</p>
    <p class="title is-5" v-if="$route.query.msg">{{ $route.query.msg }}</p>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>
