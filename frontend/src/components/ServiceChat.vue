<template>
  <div class="my-3" v-if="delChat">
    <a class="my-2" @click="show = !show" v-if="!chat">
      <span class="mr-1">{{ show ? "Hide" : "Show" }} Chat</span>
      <span v-show="getNewMessages" class="has-text-danger"
        >{{ getNewMessages }} New Message(s)</span
      >
    </a>
    <a class="my-2" @click="show = !show" v-else>
      <span class="mr-1"
        >{{ show ? "Hide" : "Show" }} chat with {{ chat.user.name }}</span
      >
      <span v-show="getNewMessages" class="has-text-danger"
        >{{ getNewMessages }} New Message(s)</span
      >
    </a>
    <div class="my-3 chat-box p-4" v-show="show">
      <span v-show="!messages.length">You have no messages yet.</span>
      <ul
        style="max-height: 300px; overflow-y: scroll"
        ref="message_box"
        class="chat-container mb-1"
      >
        <li
          v-for="message in messages"
          :key="message._id"
          :class="{
            'has-background-info-light':
              !message.read && message.user._id != getUserId,
            'p-1': true,
          }"
        >
          <span class="has-text-weight-medium">{{
            message.user._id != getUserId ? message.user.name : "You"
          }}</span>
          &nbsp;
          <span>({{ getCreated(message.createdAt) }})</span>:
          <span v-html="parseMessage(message.content)"></span>
        </li>
      </ul>
      <span
        ><a @click="createMeetLink" class="mr-2">Generate Meeting</a>
        <a @click="deleteChat" class="mr-2 has-text-danger" v-if="!owns_service"
          >Delete Chat</a
        >
        <a @click="markAll" v-show="getNewMessages"
          >Mark all as Read ({{ getNewMessages }})</a
        ></span
      >
      <div class="is-flex is-flex-direction-row mt-1">
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
          :disabled="!message || seconds !== 0 || !isNotEmty"
          @click="sendMessage"
        >
          <span class="icon">
            <i class="fas fa-paper-plane"></i>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import moment from "moment";
import config from "../../config";
export default {
  name: "ServiceChat",
  props: {
    service: Object,
    chat_id: String,
    chat: Object,
    owns_service: Boolean,
  },
  data() {
    return {
      messages: [],
      socket: null,
      message: null,
      seconds: 0,
      show: false,
      delChat: true,
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
    this.initSocket();
  },
  beforeDestroy() {
    this.closeSocket();
  },
  methods: {
    sendMessage() {
      if (this.message && this.seconds === 0 && this.isNotEmty) {
        this.markAll();
        this.socket.emit("send_message", this.message);
        this.message = null;
        this.seconds = 10;
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
    deleteChat() {
      if (
        confirm(
          "Are you sure you want to delete this chat? All associated messages will also be deleted."
        )
      ) {
        this.$http
          .delete(`/services/chats/${this.chat_id}/delete`)
          .then(() => {
            this.closeSocket();
            this.$emit("chat-deleted");
            alert("Chat Successfully deleted.");
          })
          .catch((err) => alert(`An error occurred: ${err}`));
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
    closeSocket() {
      this.socket.close();
    },
    initSocket() {
      this.socket = io(
        `${config.socketBaseUrl}/chat?chat=${this.chat_id.toString()}`,
        {
          auth: {
            token: localStorage.getItem("token"),
          },
          forceNew: true,
        }
      );
      this.socket.on("new_message", (message) => this.messages.push(message));
      this.socket.on("chat_deleted", () => {
        if (this.owns_service) {
          this.closeSocket();
          this.delChat = false;
          alert("The client has deleted their chat.");
        }
      });
    },
    markAll() {
      this.messages.forEach((message) => {
        message.read = true;
      });
      this.socket.emit("read_all");
    },
  },
  computed: {
    getUserId() {
      return localStorage.getItem("user_id") || null;
    },
    getNewMessages() {
      let count = 0;
      for (const message of this.messages) {
        if (!message.read && message.user._id != this.getUserId) count++;
      }
      return count;
    },
    isNotEmty() {
      return this.message.trim() !== "";
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
