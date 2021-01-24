<template>
  <div class="container mt-6" v-if="services">
    <div class="is-flex has-flex-direction-row">
      <input
        class="input mr-2"
        type="text"
        placeholder="Search for services"
        v-model="search"
      />
    </div>
    <div>
      <span class="is-size-4" v-show="isLoading">Loading your results...</span>
      <div v-show="!isLoading" class="service-grid">
        <SmallService
          v-for="service in services"
          :key="service._id"
          :service="service"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SmallService from "@/components/SmallService.vue";
export default {
  name: "ServiceExplore",
  components: {
    SmallService,
  },
  data() {
    return {
      services: [],
      search: null,
      isLoading: false,
    };
  },
  created() {
    this.onEmpty();
  },
  methods: {
    onSearch() {
      if (this.search) {
        this.$http
          .get(`/services/search?q=${this.search}`)
          .then((res) => (this.services = res.data))
          .catch((err) => console.log(err));
      }
    },
    onEmpty() {
      this.$http
        .get("/services/all")
        .then((res) => (this.services = res.data))
        .catch((err) => console.log(err));
    },
  },
  watch: {
    search() {
      this.isLoading = true;
      setTimeout(() => {
        if (this.search) {
          this.onSearch();
        } else {
          this.onEmpty();
        }
        this.isLoading = false;
      }, 3000);
    },
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
