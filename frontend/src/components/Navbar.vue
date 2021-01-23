<template>
  <nav
    class="navbar has-shadow is-fixed-top"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <router-link class="navbar-item is-size-4 has-text-weight-medium" to="/">
        <span class="mr-2"><i class="far fa-newspaper"></i></span>
        <span>Voluntary</span>
      </router-link>
    </div>
    <div class="navbar-menu" v-show="!$route.meta.authPage">
      <div class="navbar-start">
        <a class="navbar-item" @click="$router.push('/')">
          Home
        </a>
        <a class="navbar-item" @click="$router.push(`/users/${getUserId}`)">
          Profile
        </a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link"> {{ notifications.length }} Notifications </a>
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
        <a class="navbar-item" @click="$router.push(`/services/create`)">
          Create Service
        </a>
        <a class="navbar-item" @click="$router.push(`/contributions`)">
          Your Contributions
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import marked from "marked";
import { io } from "socket.io-client";
import moment from "moment";
export default {
  name: "Navbar",
  data() {
    return {
      socket: null,
      notifications: [],
    };
  },
  created() {
    if (localStorage.getItem("token")) {
      this.initSocket();
      this.fetchNotifications();
    }
  },
  computed: {
    getUserId() {
      return localStorage.getItem("user_id");
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
      this.socket = io(`http://127.0.0.1:8001/notifications`, {
        auth: {
          token: localStorage.getItem("token"),
        },
        forceNew: true,
      });
      this.socket.on("new_notif", (notif) => {
        this.notifications.push(notif);
      });
    },
    fetchNotifications() {
      this.$http
        .get("/users/me/notifications")
        .then((res) => (this.notifications = res.data))
        .catch((err) => console.log(err));
    },
    getDate(date) {
      return moment(date).fromNow();
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
