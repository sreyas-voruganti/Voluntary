import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import router from "./router";
import http from "./http";

Vue.config.productionTip = false;

Vue.prototype.$http = http;

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isAuthenticated: null,
  },
  mutations: {
    authenticate(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

if (localStorage.getItem("token")) {
  http.defaults.headers.common["Authorization"] = localStorage.getItem("token");
  store.commit("authenticate");
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
