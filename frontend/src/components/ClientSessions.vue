<template>
  <div class="box p-3">
    <div style="overflow-y: scroll; max-height: 500px">
      <span v-if="!sessions.length"
        >You haven't submitted any session claims yet.</span
      >
      <div v-for="session in sessions" :key="session._id" class="box m-1 p-3">
        <strong>Time:</strong> {{ getTime(session.time) }}
        <strong>Duration:</strong> {{ session.duration }} minutes <br />
        <strong>Client:</strong> {{ session.user.name }}
        <strong>Posted:</strong>
        {{ getTime(session.createdAt) }} <br />
        <strong>Id:</strong> {{ session._id }}
        <a class="has-text-danger" @click="deleteSession(session._id)"
          >Delete</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "ClientSessions",
  data() {
    return {
      sessions: [],
    };
  },
  props: {
    service_id: String,
  },
  created() {
    this.$http
      .get(`/services/${this.service_id}/sessions/own`)
      .then((res) => (this.sessions = res.data.pending))
      .catch((err) => alert(`An error occured: ${err}`));
  },
  methods: {
    getTime(time) {
      return moment(time).format("ddd, MMM D YYYY, h:mm A");
    },
    deleteSession(session_id) {
      if (
        !confirm(
          "Are you sure you want to delete session this before it is confirmed?"
        )
      )
        return;
      this.$http
        .delete(`/services/sessions/${session_id}/decline`)
        .then(() => {
          this.sessions = this.sessions.filter((obj) => {
            return obj._id != session_id;
          });
          alert("Session successfully deleted.");
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
