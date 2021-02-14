<template>
  <div class="container mt-6" v-if="services">
    <div>
      <input
        class="input"
        type="text"
        placeholder="Search for services"
        v-model="search"
      />
      <div class="my-1">
        <p class="has-text-weight-medium">
          <router-link to="/services/tags">Search for Tags</router-link> or
          Popular Tags:
        </p>
        <div class="tags mt-1">
          <span class="tag"
            ><router-link to="/services/tags?t=music">music</router-link></span
          >
          <span class="tag"
            ><router-link to="/services/tags?t=math">math</router-link></span
          >
          <span class="tag"
            ><router-link to="tags?t=english">english</router-link></span
          >
          <span class="tag"
            ><router-link to="tags?t=art">art</router-link></span
          >
        </div>
      </div>
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
}
</style>
