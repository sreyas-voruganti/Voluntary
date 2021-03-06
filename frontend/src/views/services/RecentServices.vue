<template>
  <div class="container mt-6 p-3">
    <span class="is-size-3" v-if="!services.length"
      >You haven't submitted a session for a service yet, find one
      <router-link to="/services/explore">here</router-link>.</span
    >
    <span class="is-size-3" v-else>Recent Services</span>
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
  name: "RecentServices",
  components: {
    SmallService,
  },
  data() {
    return {
      services: [],
    };
  },
  created() {
    this.$http
      .get("/services/recent")
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
