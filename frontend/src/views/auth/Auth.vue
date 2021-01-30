<template>
  <div class="container" style="max-width: 350px">
    <div class="box has-text-centered" style="margin-top: 100px">
      <span class="is-size-4">Login or Register</span>
      <a class="button is-light is-danger is-large mt-3" :href="getUrl">
        <span class="icon">
          <i class="fab fa-google"></i>
        </span>
        <span>Continue with Google</span>
      </a>
    </div>
  </div>
</template>

<script>
import config from "../../../config";
export default {
  name: "Auth",
  computed: {
    getUrl() {
      if (!this.$route.query.r) {
        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=836522334018-qed384ump69o2g0fvubmkuidvt44bbgv.apps.googleusercontent.com&redirect_uri=${config.apiBaseUrl}/auth/google&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email`;
      } else {
        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=836522334018-qed384ump69o2g0fvubmkuidvt44bbgv.apps.googleusercontent.com&redirect_uri=${config.apiBaseUrl}/auth/google&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email&state=${this.$route.query.r}`;
      }
    },
  },
};
</script>
