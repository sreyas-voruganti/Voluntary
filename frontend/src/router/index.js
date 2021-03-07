import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store";
import http from '../http';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/donations",
    name: "Donations",
    component: () => import("../views/Donations.vue"),
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
    meta: {
      mentorPage: true,
    },
  },
  {
    path: "/services/explore",
    name: "ServiceExplore",
    component: () => import("../views/ServiceExplore.vue"),
  },
  {
    path: "/services/tags",
    name: "ServiceTags",
    component: () => import("../views/ServiceTags.vue"),
  },
  {
    path: "/services/own",
    name: "OwnServices",
    component: () => import("../views/services/OwnServices.vue"),
    meta: {
      mentorPage: true,
    },
  },
  {
    path: "/services/recent",
    name: "RecentServices",
    component: () => import("../views/services/RecentServices.vue"),
  },
  {
    path: "/services/:service_id",
    name: "ServiceDetail",
    component: () => import("../views/ServiceDetail.vue"),
  },
  {
    path: "/users/explore",
    name: "UserExplore",
    component: () => import("../views/users/UserExplore.vue"),
  },
  {
    path: "/clients/explore",
    name: "ClientExplore",
    component: () => import("../views/users/ClientExplore.vue"),
    meta: {
      mentorPage: true,
    },
  },
  {
    path: "/users/:user_id",
    name: "UserDetail",
    component: () => import("../views/UserDetail.vue"),
  },
  {
    path: "/users/:user_id/contributions",
    name: "UserContributions",
    component: () => import("../views/UserContributions.vue"),
  },
  // {
  //   path: "/listings/create",
  //   name: "ListingForm",
  //   component: () => import("../views/listings/ListingForm.vue"),
  //   meta: {
  //     clientPage: true,
  //   },
  // },
  // {
  //   path: "/listings/own",
  //   name: "OwnListings",
  //   component: () => import("../views/listings/OwnListings.vue"),
  //   meta: {
  //     clientPage: true,
  //   },
  // },
  // {
  //   path: "/listings/explore",
  //   name: "ListingExplore",
  //   component: () => import("../views/listings/ListingExplore.vue"),
  //   meta: {
  //     mentorPage: true,
  //   },
  // },
  // {
  //   path: "/listings/:listing_id",
  //   name: "ListingDetail",
  //   component: () => import("../views/listings/ListingDetail.vue"),
  // },
  {
    path: "*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
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
      query: { r: to.fullPath },
    });
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.meta.authPage && isLoggedIn()) {
    next({
      path: "/",
    });
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.meta.mentorPage) {
    if (!from.name) {
      setTimeout(() => {
        if (store.state.user.acc_type != "mentor") {
          next({
            path:
              "/404?msg=You're trying to reach a mentor page with a client account type, change this in your account settings",
          });
        } else {
          next();
        }
      }, 1000);
    } else {
      if (store.state.user.acc_type != "mentor") {
        next({
          path:
            "/404?msg=You're trying to reach a mentor page with a client account type, change this in your account settings",
        });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
