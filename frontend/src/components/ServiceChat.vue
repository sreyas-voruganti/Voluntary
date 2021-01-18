<template>
  <div>
    <button
      class="button is-light is-primary my-2"
      @click="show = !show"
      v-if="!chat"
    >
      {{ show ? "Hide" : "Show" }} Chat
    </button>
    <button
      class="button is-light is-primary my-2"
      @click="show = !show"
      v-else
    >
      {{ show ? "Hide" : "Show" }} chat with {{ chat.user.name }}
    </button>
    <div class="my-3 chat-box p-4" v-show="show">
      <ul
        style="max-height: 300px; overflow-y: scroll"
        ref="message_box"
        class="chat-container"
      >
        <li v-for="message in messages" :key="message._id">
          <span class="has-text-weight-medium">{{
            message.user._id != getUserId ? message.user.name : "You"
          }}</span>
          &nbsp;
          <span>({{ getCreated(message.createdAt) }})</span>:
          <span v-html="parseMessage(message.content)"></span>
        </li>
      </ul>
      <div class="is-flex is-flex-direction-row mt-3">
        <input
          class="input mr-1"
          type="text"
          :placeholder="
            seconds !== 0 ? `Wait ${seconds} Seconds` : 'Send A Message'
          "
          v-model="message"
          @keyup.enter="sendMessage"
          :disabled="seconds !== 0"
        />
        <button
          class="button is-light is-link"
          style="min-width: 100px"
          :disabled="!message || seconds !== 0"
          @click="sendMessage"
        >
          <span class="icon">
            <i class="fas fa-paper-plane"></i>
          </span>
        </button>
      </div>
      <a @click="createMeetLink">Generate Meeting</a>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import moment from "moment";
export default {
  name: "ServiceChat",
  props: {
    service: Object,
    chat_id: String,
    chat: Object,
  },
  data() {
    return {
      messages: [],
      socket: null,
      message: null,
      seconds: 0,
      show: false,
    };
  },
  updated() {
    const element = this.$refs.message_box;
    element.scrollTop = element.scrollHeight;
  },
  created() {
    this.$http
      .get(`/services/chats/${this.chat_id}/messages`)
      .then((res) => (this.messages = res.data))
      .catch((err) => console.log(err));
    this.socket = io(`http://127.0.0.1:8000/chat?chat=${this.chat_id}`, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
    this.socket.on("new_message", (message) => this.messages.push(message));
  },
  methods: {
    sendMessage() {
      if (this.message && this.seconds === 0) {
        this.socket.emit("send_message", this.message);
        this.message = null;
        this.seconds = 7;
        this.countDown();
      }
    },
    countDown() {
      if (this.seconds > 0) {
        setTimeout(() => {
          this.seconds--;
          this.countDown();
        }, 1000);
      }
    },
    parseMessage(rawMessage) {
      return rawMessage.replace(
        /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*))/g,
        (x) =>
          `<a href="${x}" target="_blank" rel="noopener noreferrer">${x}</a>`
      );
    },
    getCreated(rawDate) {
      return moment(rawDate).fromNow();
    },
    createMeetLink() {
      if (this.message) {
        this.message += ` https://meet.jit.si/${Date.now()}`;
      } else {
        this.message = ` https://meet.jit.si/${Date.now()}`;
      }
    },
  },
  computed: {
    getUserId() {
      return localStorage.getItem("user_id") || null;
    },
  },
};
</script>

<style scoped>
.chat-box {
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
  border-color: rgb(184, 184, 184);
}
.chat-container::-webkit-scrollbar {
  width: 10px;
}
.chat-container::-webkit-scrollbar-track {
  border-radius: 6px;
  background-color: aliceblue;
}

.chat-container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgb(170, 170, 170);
}
</style>
