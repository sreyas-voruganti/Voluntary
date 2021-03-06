<template>
  <div class="container mt-6 px-3" style="max-width: 700px" v-if="user">
    <div class="is-flex is-flex-direction-column mb-3">
      <span class="has-text-weight-medium is-size-4"
        >{{ user.name }} contributed <u>{{ getTotalHours }}</u> total
        hours</span
      >
      <p>
        <a @click="share" class="mr-2">Share</a>
        <a @click="integrity" class="mr-2">Our Integrity System</a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://forms.gle/Gy4sN2hgSKHynssQ6"
          >Generate Certificate</a
        >
      </p>
      <label class="checkbox mt-2">
        <input type="checkbox" v-model="filterByDate" />
        Filter By Date
      </label>
      <div class="mt-3 is-flex is-flex-direction-column" v-if="filterByDate">
        <div class="is-flex is-flex-direction-row">
          <div class="field">
            <label class="label">Start</label>
            <div class="control">
              <input
                class="input mr-3"
                type="datetime-local"
                style="max-width: 200px"
                v-model="timeframe.start"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">End</label>
            <div class="control">
              <input
                class="input"
                type="datetime-local"
                style="max-width: 200px"
                v-model="timeframe.end"
              />
            </div>
          </div>
        </div>
        <button
          class="button is-light"
          style="max-width: 300px"
          @click="getTimeframe"
          :disabled="!(timeframe.start && timeframe.end)"
        >
          Confirm
        </button>
      </div>
    </div>
    <div class="table-container" v-if="sessions.length">
      <table class="table is-bordered">
        <tr>
          <th>Duration (mins)</th>
          <th>Client</th>
          <th>Date</th>
          <th>Service</th>
          <th>Description</th>
        </tr>
        <tr v-for="session in sessions" :key="session._id">
          <td>{{ session.duration }}</td>
          <td>
            <router-link :to="`/users/${session.user._id}`">{{
              session.user.name
            }}</router-link>
          </td>
          <td>{{ getTime(session.time) }}</td>
          <td>
            <router-link :to="`/services/${session.service._id}`">{{
              session.service.title
            }}</router-link>
          </td>
          <td>
            <a
              @click="showDescription(session.description)"
              v-if="session.description"
            >
              View Description
            </a>
            <span v-else>n/a</span>
          </td>
        </tr>
      </table>
    </div>
    <p v-else>No sessions have been found for the given criteria.</p>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "UserContributions",
  data() {
    return {
      sessions: [],
      user: null,
      filterByDate: false,
      timeframe: {
        start: null,
        end: null,
      },
    };
  },
  watch: {
    filterByDate(newVal) {
      if (!newVal) this.getPlain();
    },
  },
  created() {
    this.getPlain();
  },
  methods: {
    showDescription(description) {
      alert(`Description: ${description}`);
    },
    getTime(time) {
      return moment(time).format("ddd, MMM D YYYY, h:mm A");
    },
    share() {
      alert(
        "To share your contributions send them the current url. Only people with this link can view your contributions."
      );
    },
    integrity() {
      alert(
        "Our integrity system is designed to minimize fraudulant sessions with cross time validation, user validation, frequency validation and moderation. We gaurentee that the sessions shown here are genuine."
      );
    },
    getTimeframe() {
      this.$http
        .get(
          `/users/${this.$route.params.user_id}/sessions?contrib_key=${this.$route.query.contrib_key}&start=${this.timeframe.start}&end=${this.timeframe.end}`
        )
        .then((res) => {
          this.sessions = res.data.sessions;
          this.user = res.data.user;
        })
        .catch((err) => alert(`An error occurred: ${err}`));
    },
    getPlain() {
      this.$http
        .get(
          `/users/${this.$route.params.user_id}/sessions?contrib_key=${this.$route.query.contrib_key}`
        )
        .then((res) => {
          this.sessions = res.data.sessions;
          this.user = res.data.user;
        })
        .catch((err) => alert(`Incorrect contribution key: ${err}`));
    },
  },
  computed: {
    getTotalHours() {
      let mins = 0;
      this.sessions.forEach((session) => (mins += session.duration));
      return mins / 60;
    },
  },
};
</script>
