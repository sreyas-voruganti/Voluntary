<template>
  <div class="container mt-6 px-3" style="max-width: 1200px" v-if="services">
    <div class="mb-4 is-flex is-flex-direction-row">
      <input
        class="input"
        type="text"
        placeholder="Search for a tag"
        v-model="tag"
      />
      <a class="button ml-1" :href="tag ? `?t=${tag}` : ''" :disabled="!tag"
        >Search</a
      >
    </div>
    <p class="is-size-3 tag" v-show="$route.query.t">
      <i class="fas fa-tags mr-2"></i> {{ $route.query.t }}
    </p>
    <p class="is-size-5" v-if="$route.query.t">
      {{ services.length }} services have this tag
    </p>
    <p class="is-size-5" v-else>Search for a Tag</p>
    <div class="service-grid">
      <SmallService
        v-for="service in services"
        :key="service._id"
        :service="service"
      />
    </div>
  </div>
</template>

<script>
import SmallService from "@/components/SmallService.vue";
export default {
  name: "ServiceTags",
  components: {
    SmallService,
  },
  data() {
    return {
      services: [],
      tag: null,
    };
  },
  created() {
    this.$http
      .get(`/services/tags?t=${this.$route.query.t}`)
      .then((res) => (this.services = res.data))
      .catch((err) => alert(`An error occurred: ${err}`));
  },
};
</script>

<style scoped>
@media (min-width: 600px) {
  .service-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 360px);
    grid-gap: 20px;
  }
}
</style>
