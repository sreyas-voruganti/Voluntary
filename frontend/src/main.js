import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import http from "./http";
import store from "./store";

Vue.config.productionTip = false;

Vue.prototype.$http = http;

if (localStorage.getItem("token")) {
  const token = localStorage.getItem("token");
  http.defaults.headers.common["Authorization"] = token;
  store.commit("authenticate");
  http
    .get("/users/me/init")
    .then((res) => store.commit("set_user", res.data))
    .catch((err) => {
      console.log(err);
      delete this.$http.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      this.$store.commit("logout");
      this.$router.push("/auth");
    });
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
