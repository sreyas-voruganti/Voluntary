<template>
  <div class="box p-3" v-if="sessions.pending && sessions.confirmed">
    <div class="tabs is-centered is-small mb-1">
      <ul>
        <li :class="{ 'is-active': tab == 'Pending' }" @click="tab = 'Pending'">
          <a>Pending</a>
        </li>
        <li
          :class="{ 'is-active': tab == 'Confirmed' }"
          @click="tab = 'Confirmed'"
        >
          <a>Confirmed</a>
        </li>
      </ul>
    </div>
    <div style="overflow-y: scroll; max-height: 500px" v-if="tab == 'Pending'">
      <span v-if="!sessions.pending.length"
        >You don't have any pending sessions yet, ask your client to submit one
        after a session.</span
      >
      <div
        v-for="session in sessions.pending"
        :key="session._id"
        class="box m-1 p-3"
      >
        <strong>Time:</strong> {{ getTime(session.time) }}
        <strong>Duration:</strong> {{ session.duration }} minutes <br />
        <strong>Client:</strong> {{ session.user.name }}
        <strong>Posted:</strong>
        {{ getTime(session.createdAt) }} <br />
        <strong>Id:</strong> {{ session._id }}
        <a class="has-text-success" @click="confirmSession(session._id)"
          >Confirm</a
        >
        &nbsp;
        <a class="has-text-danger" @click="declineSession(session._id)"
          >Decline</a
        >
      </div>
    </div>
    <div style="overflow-y: scroll; max-height: 500px" v-else>
      <span v-if="!sessions.confirmed.length"
        >You don't have any confirmed sessions yet, confirm one from the pending
        section.</span
      >
      <div
        v-for="session in sessions.confirmed"
        :key="session._id"
        class="box m-1 p-3"
      >
        <strong>Time:</strong> {{ getTime(session.time) }}
        <strong>Duration:</strong> {{ session.duration }} minutes <br />
        <strong>Client:</strong> {{ session.user.name }}
        <strong>Posted:</strong>
        {{ getTime(session.createdAt) }} <br />
        <strong>Id:</strong> {{ session._id }}
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "ServiceSessions",
  props: {
    service_id: String,
  },
  data() {
    return {
      sessions: [],
      tab: "Pending",
    };
  },
  created() {
    this.$http
      .get(`/services/${this.service_id}/sessions`)
      .then((res) => (this.sessions = res.data))
      .catch((err) => console.log(err));
  },
  methods: {
    getTime(time) {
      return moment(time).format("ddd, MMM D YYYY, h:mm A");
    },
    confirmSession(session_id) {
      if (!confirm("Are you sure you want to confirm this session?")) return;
      this.$http
        .post(`/services/sessions/${session_id}/confirm`)
        .then(() => {
          this.sessions.pending = this.sessions.pending.filter((obj) => {
            return obj._id != session_id;
          });
          //this.sessions.confirmed.push(session);
          alert("Session successfully confirmed");
        })
        .catch((err) => console.log(err));
    },
    declineSession(session_id) {
      if (!confirm("Are you sure you want to decline this session?")) return;
      this.$http
        .delete(`/services/sessions/${session_id}/decline`)
        .then(() => {
          this.sessions.pending = this.sessions.pending.filter((obj) => {
            return obj._id != session_id;
          });
          alert("Session successfully declined");
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
