<template>
  <nav
    class="navbar has-shadow is-fixed-top has-background-success-light"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <router-link class="navbar-item is-size-4 has-text-weight-medium" to="/">
        <span class="mr-2"><i class="far fa-newspaper"></i></span>
        <span>Voluntary</span>
      </router-link>
      <a
        role="button"
        @click="showMobileNav = !showMobileNav"
        :class="{ 'navbar-burger': true, 'is-active': showMobileNav }"
        data-target="navBar"
        v-show="!$route.meta.authPage"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div
      :class="{ 'navbar-menu': true, 'is-active': showMobileNav }"
      v-show="!$route.meta.authPage"
      id="navBar"
    >
      <div class="navbar-start">
        <a class="navbar-item" @click="navigatePage('/')">
          <i class="fas fa-home mr-1"></i> Home
        </a>
        <a class="navbar-item" :href="`/users/${getUserId}?rcd=${rcd}`">
          <i class="fas fa-user-alt mr-1"></i> Profile
        </a>
        <a class="navbar-item" @click="navigatePage('/users/explore')">
          <i class="fas fa-users mr-1"></i> Explore Mentors
        </a>
        <div
          class="navbar-item has-dropdown is-hoverable"
          v-if="getUserType == 'mentor'"
        >
          <a class="navbar-link">
            <i class="far fa-newspaper mr-1"></i> Services
          </a>
          <div class="navbar-dropdown">
            <a class="navbar-item" @click="navigatePage('/services/own')">
              <i class="far fa-newspaper mr-1"></i> Your Services
            </a>
            <a class="navbar-item" @click="navigatePage('/services/explore')">
              <i class="fas fa-globe-americas mr-1"></i> Explore Services
            </a>
            <a class="navbar-item" @click="navigatePage('/services/recent')">
              <i class="fas fa-backward mr-1"></i> Recent Services
            </a>
            <hr class="navbar-divider" />
            <a class="navbar-item" @click="navigatePage('/services/create')">
              <i class="fas fa-plus mr-1"></i> Create Service
            </a>
          </div>
        </div>
        <a
          class="navbar-item"
          @click="navigatePage('/services/explore')"
          v-else
        >
          <i class="fas fa-globe-americas mr-1"></i> Explore Services
        </a>
        <a
          class="navbar-item"
          @click="navigatePage('/services/recent')"
          v-show="getUserType == 'client'"
        >
          <i class="fas fa-backward mr-1"></i> Recent Services
        </a>
        <!-- <a
          class="navbar-item"
          @click="$router.push('/listings/create')"
          v-show="getUserType == 'client'"
        >
          <i class="fas fa-plus mr-1"></i> Create Listing
        </a>
        <a
          class="navbar-item"
          @click="$router.push('/listings/explore')"
          v-show="getUserType == 'mentor'"
        >
          <i class="fas fa-plus mr-1"></i> Explore Listings
        </a> -->
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link"
            ><i class="fas fa-bell mr-1"></i>
            {{ notifications.length }} Notifications
          </a>
          <div class="navbar-dropdown p-3">
            <div
              style="width: 250px"
              class="is-flex is-flex-direction-column notif-container"
            >
              <a v-if="notifications.length" @click="markAll"
                >Mark All As Read</a
              >
              <span v-else>You have no new notifications</span>
              <div
                v-for="notification in notifications"
                :key="notification._id"
                class="notif-box p-1 my-1"
              >
                <span v-html="parseNotification(notification.content)"></span>
                <span class="has-text-weight-medium"
                  >{{ getDate(notification.createdAt) }}
                  <a class="ml-1" @click="markOne(notification._id)"
                    >Mark As Read</a
                  ></span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import marked from "marked";
import { io } from "socket.io-client";
import moment from "moment";
import config from "../../config";
export default {
  name: "Navbar",
  props: {
    rcd: Number,
  },
  data() {
    return {
      socket: null,
      notifications: [],
      showMobileNav: false,
    };
  },
  created() {
    if (this.isAuthenticated) {
      this.initSocket();
    }
  },
  watch: {
    isAuthenticated(newVal) {
      if (newVal) {
        this.initSocket();
      } else {
        this.socket.close();
      }
    },
  },
  beforeDestroy() {
    this.socket.close();
  },
  computed: {
    getUserId() {
      return this.$store.state.user._id || localStorage.getItem("user_id");
    },
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    getUserType() {
      return this.$store.state.user.acc_type;
    },
  },
  methods: {
    parseNotification(notification) {
      return marked(notification);
    },
    markAll() {
      this.notifications = [];
      this.socket.emit("mark_all");
    },
    markOne(notifId) {
      this.notifications = this.notifications.filter((obj) => {
        return obj._id !== notifId;
      });
      this.socket.emit("mark_one", notifId);
    },
    initSocket() {
      this.socket = io(`${config.socketBaseUrl}/notifications`, {
        auth: {
          token: localStorage.getItem("token"),
        },
        forceNew: true,
      });
      this.socket.on("new_notif", (notif) => {
        this.notifications.push(notif);
      });
      this.socket.on("fetch_notifs", (notifs) => {
        this.notifications = notifs;
      });
    },
    getDate(date) {
      return moment(date).fromNow();
    },
    navigatePage(path) {
      this.showMobileNav = false;
      this.$router.push(path);
    },
  },
};
</script>

<style scoped>
.notif-box {
  border-style: solid;
  border-width: 1px;
  border-radius: 3px;
  border-color: rgb(184, 184, 184);
}
.notif-container {
  overflow-y: scroll;
  max-height: 300px;
}
</style>
