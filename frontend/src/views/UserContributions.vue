<template>
  <div class="container mt-6" style="width: 700px">
    <span class="has-text-weight-medium is-size-4"
      >{{ getTotalHours }} Hours Contributed</span
    >
    <div class="table-container">
      <table class="table is-bordered">
        <tr>
          <th>Duration (mins)</th>
          <th>User</th>
          <th>Date</th>
          <th>Service</th>
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
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "UserContributions",
  data() {
    return {
      sessions: [],
    };
  },
  created() {
    this.$http
      .get("/users/me/sessions")
      .then((res) => (this.sessions = res.data))
      .catch((err) => alert(`An error occurred: ${err}`));
  },
  methods: {
    getTime(time) {
      return moment(time).format("ddd, MMM D YYYY, h:mm A");
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
