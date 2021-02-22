<template>
  <div>
    <div class="notification m-5 is-primary is-light">
      <p>
        <span class="title is-5"
          >Welcome to Voluntary, <u>{{ total_contrib }}</u> Hours Contributed
          Worldwide.</span
        >
        &nbsp;
        <a class="has-text-weight-medium" @click="showAnnouncements = true"
          >Show Announcements</a
        >
        <a class="has-text-weight-medium ml-2" @click="showHelp = true"
          >Show Help</a
        >
      </p>
    </div>
    <div class="container my-5 is-flex mobile-cont p-3" v-if="featured_service">
      <div class="container">
        <p class="title is-4 my-3">
          <i class="fas fa-award"></i> Today's Featured Service:
        </p>
        <FeaturedService :service="featured_service" class="mobile-feat" />
      </div>
      <div class="container">
        <p class="title is-4 my-3">
          <i class="fas fa-fire"></i> Popular Services:
        </p>
        <PopularServices :services="popular_services" />
      </div>
    </div>
    <div :class="{ modal: true, 'is-active': showAnnouncements }">
      <div class="modal-background" @click="showAnnouncements = false"></div>
      <div class="modal-content box">
        <h4 class="title is-4">📢 Announcements</h4>
        <p class="is-size-6">
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
        <img src="how.png" alt="How Voluntary Works" />
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="showAnnouncements = false"
      ></button>
    </div>
    <div :class="{ modal: true, 'is-active': showHelp }">
      <div class="modal-background" @click="showHelp = false"></div>
      <div class="modal-content box">
        <h4 class="title is-4">💁‍♂️ Help</h4>
        <u><h5 class="title is-5 mb-1">For Clients</h5></u>
        <p class="is-size-6">
          If you are looking for a service from a mentor, go to the explore
          services page and find one of interest. Contact the mentor of the
          service by clicking the <strong>Contact</strong> button. After meeting
          with them, submit a session claim with info about your session by
          clicking the <strong>Submit Session</strong> button.
        </p>
        <u><h5 class="title is-5 mb-1 mt-4">For Mentors</h5></u>
        <p class="is-size-6">
          If you want to mentor, first create a service. You will be contacted
          by interested clients, decide on a meeting time and have a session
          with them. After the session is complete, ask your client to submit a
          session claim from your service page. Then make sure you verify it by
          clicking <strong>View Your Sessions</strong>, then your session has
          officially been recorded and can be seen through your contributions
          section.
        </p>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="showHelp = false"
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
      showHelp: false,
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
  },
};
</script>

<style scoped>
.mobile-cont {
  flex-direction: row;
}
.mobile-feat {
  margin-right: 30px;
}
@media (max-width: 600px) {
  .mobile-cont {
    flex-direction: column;
  }
  .mobile-feat {
    margin-right: 0px;
  }
}
</style>
