<template>
  <div class="container px-6">
    <section
      class="hero is-light mt-6"
      style="border-radius: 10px; background: linear-gradient(0deg, rgba(189,255,225,1) 0%, rgba(184,246,255,1) 100%)"
    >
      <div class="hero-body">
        <p class="title">
          Welcome to Voluntary (Early Beta)
        </p>
        <p class="subtitle is-4">
          Free Lessons From Teenage Mentors
        </p>
        <a class="button is-light is-danger is-large mt-3" :href="getUrl">
          <span class="icon">
            <i class="fab fa-google"></i>
          </span>
          <span>Continue with Google</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script>
import config from "../../../config";
export default {
  name: "Auth",
  computed: {
    getUrl() {
      if (!this.$route.query.r) {
        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=836522334018-qed384ump69o2g0fvubmkuidvt44bbgv.apps.googleusercontent.com&redirect_uri=${config.baseUrl}/auth/google&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email`;
      } else {
        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=836522334018-qed384ump69o2g0fvubmkuidvt44bbgv.apps.googleusercontent.com&redirect_uri=${config.baseUrl}/auth/google&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email&state=${this.$route.query.r}`;
      }
    },
  },
};
</script>
