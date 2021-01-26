<template>
  <div
    class="container my-5 is-flex has-flex-direction-row"
    v-if="featured_service"
  >
    <div class="container" style="max-width: 50%">
      <p class="title is-3 mb-3">Featured Service:</p>
      <FeaturedService :service="featured_service" />
    </div>
    <div class="container" style="max-width: 50%">
      <p class="title is-3 mb-3">Popular Services:</p>
      <PopularServices :services="popular_services" />
    </div>
  </div>
</template>

<script>
import FeaturedService from "@/components/services/FeaturedService.vue";
import PopularServices from "@/components/services/PopularServices.vue";
export default {
  name: "Home",
  components: {
    FeaturedService,
    PopularServices,
  },
  data() {
    return {
      featured_service: null,
      popular_services: [],
    };
  },
  created() {
    this.$http
      .get("/services/home")
      .then((res) => {
        this.featured_service = res.data.featured_service;
        this.popular_services = res.data.popular_services;
      })
      .catch((err) => alert(`An error occurred: ${err}`));
  },
};
</script>
