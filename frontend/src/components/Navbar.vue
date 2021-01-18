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
          <a class="navbar-link">
            Notifications
          </a>
          <div class="navbar-dropdown p-3">
            <div style="width: 200px">
              <span v-html="parseNotification('Hello *world*')"></span>
            </div>
          </div>
        </div>
        <a class="navbar-item" @click="$router.push(`/services/create`)">
          Create Service
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
    };
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
    intiSocket() {
      this.socket = io(`http://127.0.0.1:8000/notifications`, {
        auth: {
          token: localStorage.getItem("token"),
        },
      });
    },
  },
};
</script>
