import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import http from "./http";

if (localStorage.getItem("token")) {
  http.defaults.headers.common["Authorization"] = localStorage.getItem("token");
}

Vue.config.productionTip = false;

Vue.prototype.$http = http;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
