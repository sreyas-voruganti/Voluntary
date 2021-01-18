import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import("../views/auth/Auth.vue"),
    meta: {
      authPage: true,
    },
  },
  {
    path: "/authenticate",
    name: "Authenticate",
    component: () => import("../views/auth/Authenticate.vue"),
    meta: {
      authPage: true,
    },
  },
  {
    path: "/services/create",
    name: "ServiceForm",
    component: () => import("../views/ServiceForm.vue"),
  },
  {
    path: "/services/:service_id",
    name: "ServiceDetail",
    component: () => import("../views/ServiceDetail.vue"),
  },
  {
    path: "/users/:user_id",
    name: "UserDetail",
    component: () => import("../views/UserDetail.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

const isLoggedIn = () => {
  if (localStorage.getItem("token")) return true;
  return false;
};

router.beforeEach((to, from, next) => {
  if (!to.meta.authPage && !isLoggedIn()) {
    next({
      path: "/auth",
      //query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.meta.authPage && isLoggedIn()) {
    next({
      path: "/",
      //query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
});

export default router;
