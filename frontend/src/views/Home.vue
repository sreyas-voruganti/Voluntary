<template>
  <div>
    <div class="notification m-5 is-primary is-light">
      <p class="title is-4">
        Welcome to Voluntary, <u>{{ total_contrib }}</u> Total Hours Contributed
      </p>
    </div>
    <div
      class="container my-5 is-flex has-flex-direction-row"
      v-if="featured_service"
    >
      <div class="container" style="max-width: 50%">
        <p class="title is-4 mb-3">
          <i class="fas fa-award"></i> Today's Featured Service:
        </p>
        <FeaturedService :service="featured_service" />
      </div>
      <div class="container" style="max-width: 50%">
        <p class="title is-4 mb-3">
          <i class="fas fa-fire"></i> Popular Services:
        </p>
        <PopularServices :services="popular_services" />
      </div>
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
      total_contrib: 0,
    };
  },
  created() {
    this.$http
      .get("/services/home")
      .then((res) => {
        this.featured_service = res.data.featured_service;
        this.popular_services = res.data.popular_services;
        this.total_contrib = res.data.total_contrib;
      })
      .catch((err) => alert(`An error occurred: ${err}`));
  },
};
</script>
