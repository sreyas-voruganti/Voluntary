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
    const rand = Math.floor(Math.random() * 3) + 1;
    let color;
    if (rand === 1) {
      color = "#f5fbff";
    } else if (rand === 2) {
      color = "#fffcf5";
    } else {
      color = "#fff5f8";
    }
    document.querySelector("html").style.backgroundColor = color;
  },
};
</script>
