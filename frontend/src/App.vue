<template>
  <div>
    <div>
      <Navbar :rcd="rand_degree" />
    </div>
    <router-view />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      rand_degree: null,
    };
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    this.rand_degree =
      parseInt(urlParams.get("rcd")) || Math.floor(Math.random() * 355) + 1;
    document.querySelector(
      "html"
    ).style.backgroundColor = `hsl(${this.rand_degree}, 100%, 97%)`;
  },
};
</script>
