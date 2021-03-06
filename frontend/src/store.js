import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isAuthenticated: false,
    user: {},
  },
  mutations: {
    authenticate(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = {};
    },
    set_user(state, data) {
      state.user = data;
    },
    set_acc_type(state, type) {
      state.user.acc_type = type;
    },
  },
});

export default store;
