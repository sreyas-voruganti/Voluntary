<template>
  <div>
    Loading...
  </div>
</template>

<script>
export default {
  name: "Authenticate",
  created() {
    const token = this.$route.query.token;
    if (this.$route.query.err) {
      console.log(this.$route.query.err);
    } else if (!token) {
      this.$router.push("/auth");
    } else {
      this.$http
        .get(`/auth/token/valid?token=${token}`)
        .then((res) => {
          if (res.data.valid) {
            this.$http.defaults.headers.common["Authorization"] = token;
            localStorage.setItem("token", token);
            localStorage.setItem("user_id", this.$route.query.id);
            this.$store.commit("authenticate");
            this.fetchInitUser();
            if (!this.$route.query.r) {
              this.$router.push("/");
            } else {
              this.$router.push(this.$route.query.r);
            }
          } else {
            this.$router.push("/auth");
          }
        })
        .catch((err) => console.log(err));
    }
  },
  methods: {
    fetchInitUser() {
      this.$http
        .get("/users/me/init")
        .then((res) => this.$store.commit("set_user", res.data))
        .catch((err) =>
          alert(
            `An error occurred: ${err}, try reloading or clearing your cookies.`
          )
        );
    },
  },
};
</script>
