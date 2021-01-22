<template>
  <div
    v-if="service"
    class="container"
    style="max-width: 700px; margin-top: 25px"
  >
    <div class="notification is-success mb-0" v-show="showSessionSuccess">
      <button class="delete" @click="showSessionSuccess = false"></button>
      Session claim successfully submitted
    </div>
    <p class="is-size-2">{{ service.title }}</p>
    <p class="mb-3">
      <span
        ><i class="far fa-user"></i> &nbsp;
        <router-link :to="`/users/${service.user._id}`">{{
          service.user.name
        }}</router-link></span
      >
      <span class="ml-3"
        ><i class="far fa-calendar-alt"></i> &nbsp; {{ getCreatedDate }}</span
      >
    </p>
    <div class="tags mb-2">
      <span
        class="tag is-info is-light"
        v-for="(tag, index) in service.tags"
        :key="index"
        >{{ tag }}</span
      >
    </div>
    <img :src="service.image" class="image-container" />
    <div class="buttons">
      <button
        class="button is-outlined is-success"
        v-if="!owns && !has_chat"
        @click="startChat"
      >
        Start Chat
      </button>
      <button
        class="button is-outlined is-info"
        v-if="!owns && has_chat"
        @click="showSessionModal = true"
      >
        Submit Session
      </button>
      <button
        class="button is-outlined is-warning"
        @click="showSessionsModal = true"
      >
        View Sessions
      </button>
    </div>
    <p class="is-size-6 mt-3">{{ service.description }}</p>
    <div v-if="!owns">
      <ServiceChat v-if="has_chat" :service="service" :chat_id="chat_id" />
    </div>
    <div v-else>
      <ServiceChat
        v-for="chat in chats"
        :service="service"
        :chat_id="chat._id"
        :key="chat._id"
        :chat="chat"
      />
    </div>
    <div :class="{ modal: true, 'is-active': showSessionModal }">
      <div class="modal-background" @click="cancelSession"></div>
      <div class="modal-content box">
        <div class="field">
          <label class="label"
            >Time
            <span class="has-text-weight-medium"
              >(when was it [local time])</span
            ></label
          >
          <div class="control">
            <input class="input" type="datetime-local" v-model="session.time" />
          </div>
        </div>
        <div class="field">
          <label class="label"
            >Duration
            <span class="has-text-weight-medium"
              >(how long was it [mins])</span
            ></label
          >
          <div class="control">
            <input
              class="input"
              type="number"
              min="30"
              v-model="session.duration"
              step="30"
              onkeydown="return false"
              max="120"
            />
          </div>
        </div>
        <div class="field">
          <label class="label"
            >Satisfaction
            <span class="has-text-weight-medium"
              >(how satisfied were you [1 - lowest, 5 - highest])</span
            ></label
          >
          <div class="control">
            <input
              class="input"
              type="number"
              min="1"
              max="5"
              v-model="session.satisfaction"
              onkeydown="return false"
            />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="agreeSessionTerms" />
              I agree that this session claim is genuine
            </label>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button
              class="button is-link"
              :disabled="checkSubmit"
              @click="submitSession"
            >
              Submit
            </button>
          </div>
          <div class="control">
            <button class="button is-link is-light" @click="cancelSession">
              Cancel
            </button>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="cancelSession"
      ></button>
    </div>
    <div :class="{ modal: true, 'is-active': showSessionsModal }">
      <div class="modal-background" @click="showSessionsModal = false"></div>
      <div class="modal-content">
        <ServiceSessions :service_id="this.service._id" v-if="owns" />
        <ClientSessions :service_id="this.service._id" v-else />
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="showSessionsModal = false"
      ></button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import ServiceChat from "@/components/ServiceChat.vue";
import ServiceSessions from "@/components/ServiceSessions.vue";
import ClientSessions from "@/components/ClientSessions.vue";
export default {
  name: "ServiceDetail",
  components: {
    ServiceChat,
    ServiceSessions,
    ClientSessions,
  },
  data() {
    return {
      service: null,
      has_chat: false,
      chat_id: null,
      chats: null,
      showSessionModal: false,
      session: {
        duration: 60,
        satisfaction: 3,
      },
      agreeSessionTerms: false,
      showSessionSuccess: false,
      showSessionsModal: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.service = (
          await this.$http.get(`/services/${this.$route.params.service_id}`)
        ).data;
        if (!this.owns) {
          const chat_data = (
            await this.$http.get(
              `/services/${this.$route.params.service_id}/chats/check`
            )
          ).data;
          this.has_chat = chat_data.has_chat;
          if (this.has_chat) {
            this.chat_id = chat_data.id;
          }
        } else {
          this.chats = (
            await this.$http.get(
              `/services/${this.$route.params.service_id}/chats/all`
            )
          ).data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    cancelSession() {
      this.showSessionModal = false;
      this.session = {
        duration: 30,
        satisfaction: 1,
      };
      this.agreeSessionTerms = false;
    },
    startChat() {
      this.$http
        .post(`/services/${this.service.id}/chats/start`)
        .then((res) => {
          this.has_chat = true;
          this.chat_id = res.data._id;
        })
        .catch((err) => console.log(err));
    },
    submitSession() {
      this.$http
        .post(`/services/${this.service._id}/sessions`, this.session)
        .then(() => {
          this.cancelSession();
          this.showSessionSuccess = true;
        })
        .catch((err) => console.log(err));
    },
  },
  computed: {
    getCreatedDate() {
      return moment(this.service.createdAt).fromNow();
    },
    owns() {
      return this.service.user._id == localStorage.getItem("user_id");
    },
    checkSubmit() {
      if (
        this.session.time &&
        this.session.duration &&
        this.session.satisfaction &&
        this.agreeSessionTerms
      )
        return false;
      return true;
    },
  },
};
</script>

<style scoped>
.image-container {
  border-style: solid;
  border-width: 5px;
  border-radius: 2px;
  background-color: rgb(0, 0, 0);
  border-color: rgb(78, 78, 78);
}
</style>
