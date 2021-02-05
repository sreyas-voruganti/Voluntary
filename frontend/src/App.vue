<template>
  <div>
    <div>
      <Navbar />
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
  created() {
    const rand_degree = Math.floor(Math.random() * 355) + 1;
    document.querySelector(
      "html"
    ).style.backgroundColor = `hsl(${rand_degree}, 100%, 93%)`;
  },
};
</script>
