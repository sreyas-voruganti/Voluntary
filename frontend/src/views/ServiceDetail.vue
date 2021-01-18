<template>
  <div
    v-if="service"
    class="container"
    style="max-width: 700px; margin-top: 25px"
  >
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
        class="button is-outlined"
        v-if="!owns && !has_chat"
        @click="startChat"
      >
        Start Chat
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
  </div>
</template>

<script>
import moment from "moment";
import ServiceChat from "@/components/ServiceChat.vue";

export default {
  name: "ServiceDetail",
  components: {
    ServiceChat,
  },
  data() {
    return {
      service: null,
      has_chat: false,
      chat_id: null,
      chats: null,
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
    startChat() {
      this.$http
        .post(`/services/${this.service.id}/chats/start`)
        .then((res) => {
          this.has_chat = true;
          this.chat_id = res.data._id;
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
