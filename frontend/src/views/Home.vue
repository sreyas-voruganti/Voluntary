<template>
  <div>
    <div class="notification m-5 is-primary is-light">
      <p>
        <span class="title is-5"
          >Welcome to Voluntary, <u>{{ total_contrib }}</u> Total Hours
          Contributed.</span
        >
        &nbsp;
        <a class="has-text-weight-medium" @click="showAnnouncements = true"
          >Show Announcements</a
        >
      </p>
    </div>
    <div
      class="container my-5 is-flex has-flex-direction-row"
      v-if="featured_service"
    >
      <div class="container" style="max-width: 50%">
        <p class="title is-4 mb-3">
          <i class="fas fa-award"></i> Today's Featured Service:
        </p>
        <FeaturedService :service="featured_service" />
      </div>
      <div class="container" style="max-width: 50%">
        <p class="title is-4 mb-3">
          <i class="fas fa-fire"></i> Popular Services:
        </p>
        <PopularServices :services="popular_services" />
      </div>
    </div>
    <div :class="{ modal: true, 'is-active': showAnnouncements }">
      <div class="modal-background" @click="showAnnouncements = false"></div>
      <div class="modal-content box">
        <h4 class="title is-4">📢 Announcements</h4>
        <p class="is-size-5">
          Welcome to Voluntary v0.1 Beta! Keep in mind that we're in early beta
          and may have bugs and/or missing features which may be reported
          through this form:
          <a
            href="https://forms.gle/fNNeDEt8u5vXze1fA"
            target="_blank"
            rel="noopener noreferrer"
            >Support Form</a
          >. One of our most frequently asked questions is whether we give out
          volunteer hours, and the answer to that is yes. We are a nonprofit
          organization and therefore can certify volunteer hours. All
          information regarding this can be found through the
          <span class="has-text-weight-medium">Your Contributions</span>
          section from your profile. Please keep in mind that we do
          <span class="has-text-weight-medium">not</span> allow adult-rated
          content on this site.
        </p>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="showAnnouncements = false"
      ></button>
    </div>
  </div>
</template>

<script>
import FeaturedService from "@/components/services/FeaturedService.vue";
import PopularServices from "@/components/services/PopularServices.vue";
export default {
  name: "Home",
  components: {
    FeaturedService,
    PopularServices,
  },
  data() {
    return {
      featured_service: null,
      popular_services: [],
      total_contrib: 0,
      showAnnouncements: false,
    };
  },
  created() {
    this.$http
      .get("/services/home")
      .then((res) => {
        this.featured_service = res.data.featured_service;
        this.popular_services = res.data.popular_services;
        this.total_contrib = res.data.total_contrib;
      })
      .catch((err) => alert(`An error occurred: ${err}`));
    setTimeout(() => (this.showAnnouncements = true), 3000);
  },
};
</script>
