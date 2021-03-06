<template>
  <div class="container mt-6 px-3" v-if="users">
    <div class="is-flex has-flex-direction-row">
      <input
        class="input mr-2"
        type="text"
        :placeholder="`Search ${totalClientCount} total clients`"
        v-model="search"
      />
    </div>
    <div>
      <span class="is-size-4" v-show="isLoading">Loading your results...</span>
      <div v-show="!isLoading" class="user-grid mr-3">
        <div
          class="box user-box has-text-centered m-3 "
          v-for="user in users"
          :key="user._id"
        >
          <figure class="image is-96x96 user-pp mt-2">
            <img class="is-rounded" :src="user.pp" />
          </figure>
          <p class="title is-5 mt-2">
            <router-link :to="`/users/${user._id}`">{{
              user.name
            }}</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClientExplore",
  data() {
    return {
      users: [],
      search: null,
      isLoading: false,
      totalClientCount: 0,
    };
  },
  created() {
    this.onEmpty();
  },
  methods: {
    onSearch() {
      if (this.search) {
        this.$http
          .get(`/users/search?clients=true&q=${this.search}`)
          .then((res) => (this.users = res.data))
          .catch((err) => console.log(err));
      }
    },
    onEmpty() {
      this.$http
        .get("/users/all?clients=true")
        .then((res) => {
          this.users = res.data;
          this.totalClientCount = res.data.length;
        })
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
.user-box {
  width: 220px;
}
.user-pp {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 520px) {
  .user-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 220px);
    grid-gap: 20px;
  }
}
@media (max-width: 520px) {
  .user-box {
    width: 100%;
  }
}
</style>
