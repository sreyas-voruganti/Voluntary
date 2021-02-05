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
        <span class="is-size-6"
          >Average Satisfaction: {{ avg_satis || "-" }}/5</span
        >
        <span class="is-size-6" v-if="owns"
          ><router-link
            :to="`/users/${user._id}/contributions?contrib_key=${contrib_key}`"
            >View Contributions</router-link
          ></span
        >
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
            <input
              class="input"
              type="text"
              placeholder="Name"
              v-model="own_user.name"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Birthday</label>
          <div class="control">
            <input class="input" type="date" v-model="compDob" />
          </div>
        </div>
        <div class="field">
          <label class="label">Bio</label>
          <div class="control">
            <textarea
              class="textarea"
              placeholder="Bio"
              v-model="own_user.bio"
            ></textarea>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button
              class="button is-link"
              :disabled="!checkUpdate"
              @click="updateProfile"
            >
              Update
            </button>
          </div>
          <div class="control">
            <button
              class="button is-link is-light"
              @click="own_user = { ...user }"
              :disabled="checkCancel"
            >
              Cancel
            </button>
          </div>
        </div>
        <div class="buttons">
          <button
            class="button is-light is-danger"
            @click="syncAccount"
            :disabled="synced"
          >
            Sync Account With Google
          </button>
          <button class="button is-light is-info" @click="logout">
            <span class="icon">
              <i class="fas fa-sign-out-alt"></i>
            </span>
            <span>Logout</span>
          </button>
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
      own_user: null,
      tab: "About",
      services: [],
      synced: false,
      avg_satis: null,
      contrib_key: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      // DOB NOT WORKING ON RELOAD
      try {
        const m_data = (
          await this.$http.get(`/users/${this.$route.params.user_id}`)
        ).data;
        this.user = m_data.user;
        this.avg_satis = m_data.avg_satis;
        this.contrib_key = m_data.contrib_key;
        this.own_user = { ...this.user };
        this.services = (
          await this.$http.get(`/users/${this.$route.params.user_id}/services`)
        ).data;
      } catch (e) {
        console.log(e);
        if (e.response.status == 404) {
          this.$router.push("/404?msg=User not found");
        }
      }
    },
    updateProfile() {
      this.$http
        .put("/users/me/update", {
          name: this.own_user.name,
          bio: this.own_user.bio,
          dob: this.own_user.dob,
        })
        .then((res) => {
          this.own_user.name = res.data.name;
          this.own_user.bio = res.data.bio;
          this.own_user.dob = res.data.dob;
          this.user.name = res.data.name;
          this.user.bio = res.data.bio;
          this.user.dob = res.data.dob;
          alert("Profile updated successfully.");
        })
        .catch((err) => alert(`An error occurred: ${err}`));
    },
    logout() {
      if (confirm("Are you sure you want to logout?")) {
        delete this.$http.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        this.$store.commit("logout");
        this.$router.push("/auth");
      }
    },
    syncAccount() {
      if (
        confirm(
          "Warning this will resync your email, name, and profile picture with your Google account."
        )
      ) {
        this.$http
          .post("/users/me/sync")
          .then((res) => {
            this.own_user.name = res.data.name;
            this.user.name = res.data.name;
            this.user.pp = res.data.pp;
            this.user.email = res.data.email;
            this.synced = true;
            alert("Profile successfully synced with Google");
          })
          .catch((err) => alert(`An error occurred: ${err}`));
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
    checkCancel() {
      return JSON.stringify(this.user) === JSON.stringify(this.own_user);
    },
    checkUpdate() {
      return (
        JSON.stringify(this.user) !== JSON.stringify(this.own_user) &&
        this.own_user.bio &&
        this.own_user.name &&
        this.own_user.dob
      );
    },
    compDob: {
      get() {
        return this.own_user.dob
          ? new Date(this.own_user.dob).toISOString().split("T")[0]
          : null;
      },
      set(newValue) {
        this.own_user.dob = newValue;
      },
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
