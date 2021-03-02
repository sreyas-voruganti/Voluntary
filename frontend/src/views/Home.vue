<template>
  <div>
    <div
      class="notification mt-5 is-primary is-light"
      style="width: 85%; margin: 0 auto"
    >
      <p>
        <span class="title is-5"
          >Welcome to Voluntary, <u>{{ total_contrib }} hours</u> contributed
          worldwide. {{ num_clients }} Clients, {{ num_mentors }} Mentors.</span
        >
        <br />
        <a
          class="has-text-weight-medium has-text-link"
          @click="showAnnouncements = true"
          >Show Announcements</a
        >
        <a
          class="has-text-weight-medium ml-2 has-text-danger"
          @click="showHelp = true"
          >Show Help</a
        >
        <router-link
          class="has-text-weight-medium ml-2"
          style="color: #a87932"
          to="/services/recent"
          >View Recent Services</router-link
        >
        <a
          class="has-text-weight-medium ml-2"
          href="https://forms.gle/Ceaxu6QAJTvuqzga8"
          target="_blank"
          rel="noopener noreferrer"
          style="color: #a832a4"
          >Join Our Team</a
        >
        <a
          class="has-text-weight-medium ml-2"
          href="https://discord.gg/3ZNHJdHEYG"
          style="color: #298037"
          target="_blank"
          rel="noopener noreferrer"
          v-show="getUserType == 'mentor'"
          >Mentors: Join Our Discord</a
        >
      </p>
    </div>
    <div class="container my-5 is-flex mobile-cont p-3" v-if="featured_service">
      <div class="mobile-feat-two container">
        <p class="title is-4 my-3">
          <i class="fas fa-award"></i> Featured Service:
        </p>
        <FeaturedService :service="featured_service" class="mobile-feat" />
      </div>
      <div class="mobile-popular container">
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
      num_clients: 0,
      num_mentors: 0,
    };
  },
  created() {
    this.$http
      .get("/services/home")
      .then((res) => {
        this.featured_service = res.data.featured_service;
        this.popular_services = res.data.popular_services;
        this.total_contrib = res.data.total_contrib;
        this.num_clients = res.data.num_clients;
        this.num_mentors = res.data.num_mentors;
      })
      .catch((err) => alert(`An error occurred: ${err}`));
  },
  computed: {
    getUserType() {
      return this.$store.state.user.acc_type;
    },
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
@media (min-width: 600px) {
  .mobile-popular {
    width: 55%;
  }
  .mobile-feat-two {
    width: 45%;
  }
}
</style>
