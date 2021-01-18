<template>
  <div class="container" style="max-width: 350px">
    <div class="box" style="margin-top: 100px">
      <span class="is-size-4">Start your journey now...</span>
      <a
        class="button is-outlined is-danger is-large mt-3"
        href="https://accounts.google.com/o/oauth2/v2/auth?client_id=836522334018-qed384ump69o2g0fvubmkuidvt44bbgv.apps.googleusercontent.com&redirect_uri=http://localhost:8000/auth/google&response_type=code&access_type=offline&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email"
      >
        <span class="icon">
          <i class="fab fa-google"></i>
        </span>
        <span>Continue with Google</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Auth",
};
</script>
