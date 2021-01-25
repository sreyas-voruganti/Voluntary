<template>
  <div class="container mt-6">
    <span class="is-size-3" v-if="!services.length"
      >You don't have any services yet, create one
      <router-link to="/services/create">here</router-link>.</span
    >
    <span class="is-size-3" v-else>Your Services</span>
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
  name: "OwnServices",
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
      .get(`/users/${localStorage.getItem("user_id")}/services`)
      .then((res) => (this.services = res.data))
      .catch((err) => alert(`An error occurred: ${err}`));
  },
};
</script>

<style scoped>
.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 360px);
  grid-gap: 20px;
}
</style>
