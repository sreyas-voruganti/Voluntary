<template>
  <div v-if="user">
    <div
      class="is-fullwidth has-background-light is-flex is-flex-direction-row p-6"
    >
      <figure class="image is-128x128">
        <img class="is-rounded" :src="user.pp" />
      </figure>
      <div class="is-flex is-flex-direction-column ml-5 mt-1">
        <span class="is-size-3 has-text-weight-medium">{{ user.name }}</span>
        <span class="is-size-5">Joined {{ getCreated }}</span>
      </div>
    </div>
    <div class="container mt-4">
      <div class="tabs is-centered">
        <ul>
          <li :class="{ 'is-active': tab == 'About' }" @click="tab = 'About'">
            <a>
              <span class="icon is-small"
                ><i class="far fa-address-card"></i
              ></span>
              <span>About</span>
            </a>
          </li>
          <li
            :class="{ 'is-active': tab == 'Services' }"
            @click="tab = 'Services'"
          >
            <a>
              <span class="icon is-small"
                ><i class="far fa-newspaper"></i
              ></span>
              <span>Services</span>
            </a>
          </li>
          <li
            :class="{ 'is-active': tab == 'Profile' }"
            @click="tab = 'Profile'"
            v-if="owns"
          >
            <a>
              <span class="icon is-small"><i class="far fa-user"></i></span>
              <span>Profile</span>
            </a>
          </li>
        </ul>
      </div>
      <div v-if="tab == 'About'">
        <span>{{ user.bio ? user.bio : "This user doesn't have a bio." }}</span>
      </div>
      <div v-else-if="tab == 'Services'">
        <span v-if="!services.length">This user has no services.</span>
        <div v-else class="service-grid">
          <SmallService
            v-for="service in services"
            :key="service._id"
            :service="service"
          />
        </div>
      </div>
      <div v-else class="container" style="max-width: 80%">
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input class="input" type="text" placeholder="Name" />
          </div>
        </div>
        <div class="field">
          <label class="label">Bio</label>
          <div class="control">
            <textarea class="textarea" placeholder="Bio"></textarea>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link">Update</button>
          </div>
          <div class="control">
            <button class="button is-link is-light">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import SmallService from "@/components/SmallService.vue";
export default {
  name: "UserDetail",
  components: {
    SmallService,
  },
  data() {
    return {
      user: null,
      tab: "About",
      services: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.user = (
          await this.$http.get(`/users/${this.$route.params.user_id}`)
        ).data;
        this.services = (
          await this.$http.get(`/users/${this.$route.params.user_id}/services`)
        ).data;
      } catch (e) {
        console.log(e);
      }
    },
  },
  computed: {
    getCreated() {
      return moment(this.user.createdAt).fromNow();
    },
    owns() {
      return this.user._id == localStorage.getItem("user_id");
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
