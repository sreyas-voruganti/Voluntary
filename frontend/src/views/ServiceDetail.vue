<template>
  <div
    v-if="service"
    class="container p-3"
    style="max-width: 700px; margin-top: 25px"
  >
    <p class="is-size-3">{{ service.title }}</p>
    <p class="mb-3">
      <span
        ><i class="far fa-user"></i> &nbsp;
        <router-link :to="`/users/${service.user._id}`">{{
          service.user.name
        }}</router-link></span
      >
      <span class="ml-3"
        ><i class="far fa-calendar-alt"></i> &nbsp; Posted
        {{ getCreatedDate }}</span
      >
      <span class="ml-3"
        ><i class="far fa-check-circle"></i> &nbsp; {{ num_sessions }} Confirmed
        Sessions</span
      >
      <span class="ml-3"
        ><i class="fas fa-eye"></i> &nbsp; Viewed
        {{ service.views }} Times</span
      >
    </p>
    <div class="tags mb-2">
      <span class="tag is-primary is-light" v-show="service.unlisted"
        ><i class="fas fa-link mr-1"></i> Unlisted</span
      >
      <span
        class="tag is-light is-light"
        v-for="(tag, index) in service.tags"
        :key="index"
        ><router-link :to="`/services/tags?t=${tag}`">{{
          tag
        }}</router-link></span
      >
    </div>
    <img :src="service.image" class="image-container" />
    <div class="buttons">
      <button
        class="button is-light is-info"
        v-if="!owns"
        @click="showSessionModal = true"
      >
        <i class="fas fa-plus mr-1"></i> Submit Session
      </button>
      <button
        class="button is-primary is-light"
        @click="showSessionsModal = true"
      >
        <i class="fas fa-eye mr-1"></i> View Your Sessions
      </button>
      <button
        class="button is-warning is-light"
        @click="showEditModal = true"
        v-if="owns"
      >
        <i class="fas fa-edit mr-1"></i> Edit Service
      </button>
      <button
        class="button is-link is-light"
        @click="showImageModal = true"
        v-if="owns"
      >
        <i class="far fa-image mr-1"></i> Change Image
      </button>
      <button
        class="button is-light is-success"
        v-else
        @click="showContactInfo = true"
      >
        <i class="fas fa-envelope mr-1"></i>
        Contact Mentor
      </button>
      <button
        class="button is-light is-danger"
        :disabled="did_report"
        @click="reportService"
      >
        <i class="fas fa-flag-checkered mr-1"></i>
        {{ did_report ? "Reported" : "Report Service" }}
      </button>
    </div>
    <p class="is-size-6 mt-3">{{ service.description }}</p>
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
            <div class="select">
              <select v-model="session.duration">
                <option>30</option>
                <option>45</option>
                <option>60</option>
                <option>75</option>
                <option>90</option>
                <option>105</option>
                <option>120</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label">Short Description</label>
          <div class="control">
            <textarea
              class="textarea"
              placeholder="A short description about what happened during the session"
              v-model="session.description"
            ></textarea>
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
        <p class="my-3 has-text-weight-medium">
          **Support Voluntary by making a
          <a href="/donations" target="_blank" rel="noopener noreferrer"
            >contribution</a
          >
          to another nonprofit**
        </p>
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
    <div :class="{ modal: true, 'is-active': showEditModal }">
      <div class="modal-background" @click="cancelEdit"></div>
      <div class="modal-content box">
        <div class="field">
          <label class="label">Title</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Title"
              v-model="own_service.title"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Contact</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="An email address or phone number for clients to contact you"
              v-model="own_service.contact"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Tags</label>
          <div class="tags mb-1" v-if="own_service.tags">
            <span
              class="tag"
              v-for="(tag, index) in own_service.tags.split(', ')"
              :key="index"
              >{{ tag }}</span
            >
          </div>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder='Tags (ex. "Piano, Music")'
              v-model="own_service.tags"
            />
          </div>
        </div>
        <div class="field">
          <label class="label">Description</label>
          <div class="control">
            <textarea
              class="textarea"
              placeholder="Description"
              v-model="own_service.description"
            ></textarea>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="own_service.unlisted" />
              Unlisted (publicly unavailable without url)
            </label>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button
              class="button is-link"
              :disabled="checkUpdate"
              @click="updateService"
            >
              Update
            </button>
          </div>
          <div class="control">
            <button class="button is-link is-light" @click="cancelEdit">
              Cancel
            </button>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="cancelEdit"
      ></button>
    </div>
    <a @click="showComments = !showComments">
      {{ showComments ? "Hide" : "Show" }} Comments ({{ comments.length }})
    </a>
    <div class="my-3" v-show="showComments">
      <p class="title is-4 mb-2">Comments ({{ comments.length }})</p>
      <div class="box">
        <div class="is-flex has-flex-direction-row mb-4">
          <input
            type="text"
            placeholder="Add a comment"
            class="input mr-2"
            v-model="new_comment"
          />
          <button
            class="button is-light"
            :disabled="!new_comment"
            @click="addComment"
          >
            Post
          </button>
        </div>
        <span v-if="!comments.length">There are no comments yet.</span>
        <ServiceComment
          v-for="comment in comments"
          :comment="comment"
          :service_id="service._id"
          :key="comment._id"
        />
      </div>
    </div>
    <div :class="{ modal: true, 'is-active': showContactInfo }">
      <div class="modal-background" @click="showContactInfo = false"></div>
      <div class="modal-content box">
        <h4 class="title is-4">Contact</h4>
        <p class="is-size-5">
          Contact the mentor by calling or emailing:
          <span class="has-text-weight-medium">{{ service.contact }}</span>
        </p>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="showContactInfo = false"
      ></button>
    </div>
    <div :class="{ modal: true, 'is-active': showImageModal }">
      <div class="modal-background" @click="cancelNewImage"></div>
      <div class="modal-content box">
        <div class="field">
          <label class="label">New Image</label>
          <div class="control">
            <div class="file has-name is-fullwidth is-light">
              <label class="file-label">
                <input
                  class="file-input"
                  type="file"
                  ref="new_image"
                  accept="image/*"
                  @change="onNewImageChange"
                />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">
                    Choose an image…
                  </span>
                </span>
                <span class="file-name">
                  {{ new_image ? new_image.name : "No Image Chosen" }}
                </span>
              </label>
            </div>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button
              class="button is-link"
              :disabled="!new_image"
              @click="onNewImageUpdate"
            >
              Update
            </button>
          </div>
          <div class="control">
            <button class="button is-link is-light" @click="cancelNewImage">
              Cancel
            </button>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="cancelNewImage"
      ></button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import ServiceSessions from "@/components/ServiceSessions.vue";
import ClientSessions from "@/components/ClientSessions.vue";
import ServiceComment from "@/components/services/ServiceComment.vue";
export default {
  name: "ServiceDetail",
  components: {
    ServiceSessions,
    ClientSessions,
    ServiceComment,
  },
  data() {
    return {
      service: null,
      own_service: null,
      showSessionModal: false,
      session: {
        duration: 60,
      },
      agreeSessionTerms: false,
      showSessionsModal: false,
      did_report: false,
      showEditModal: false,
      num_sessions: 0,
      showComments: false,
      new_comment: null,
      comments: [],
      showContactInfo: false,
      showImageModal: false,
      new_image: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    onNewImageChange() {
      this.new_image = this.$refs.new_image.files[0];
    },
    cancelNewImage() {
      this.showImageModal = false;
      this.new_image = null;
    },
    onNewImageUpdate() {
      const fd = new FormData();
      fd.append("image", this.new_image);
      this.$http
        .put(`/services/${this.service._id}/update_image`, fd)
        .then((res) => {
          this.service.image = res.data.new_image;
          this.own_service.image = res.data.new_image;
          this.showImageModal = false;
          alert("Image successfully updated");
        })
        .catch((err) => alert(`An error occurred: ${err}`));
    },
    cancelEdit() {
      this.showEditModal = false;
      this.own_service = { ...this.service };
      this.own_service.tags = this.own_service.tags.join(", ");
    },
    reportService() {
      if (
        confirm(
          "Are you sure you want to report this service for innapropriate content or fraud?"
        )
      ) {
        this.$http
          .post(`/services/${this.service._id}/report`)
          .then(() => {
            this.did_report = true;
            alert("Service reported");
          })
          .catch((err) => alert(`An error occurred: ${err}`));
      }
    },
    async fetchData() {
      try {
        const service_data = (
          await this.$http.get(`/services/${this.$route.params.service_id}`)
        ).data;
        this.service = service_data.service;
        this.num_sessions = service_data.num_sessions;
        this.comments = service_data.comments;
        this.own_service = { ...this.service };
        this.own_service.tags = this.own_service.tags.join(", ");
        this.did_report = service_data.did_report;
      } catch (err) {
        console.log(err);
        if (err.response.status == 404) {
          this.$router.push("/404?msg=Service not found");
        }
      }
    },
    cancelSession() {
      this.showSessionModal = false;
      this.session = {
        duration: 30,
      };
      this.agreeSessionTerms = false;
    },
    submitSession() {
      if (
        moment().toDate() <
        moment(this.session.time)
          .add(this.session.duration, "m")
          .toDate()
      )
        return alert("You cannot submit a session until it is completed.");
      if (
        moment(this.session.time).toDate() <
        moment()
          .subtract(1, "d")
          .toDate()
      )
        return alert(
          "You cannot submit a session that started more than 24 hours ago."
        );
      this.$http
        .post(`/services/${this.service._id}/sessions`, {
          duration: this.session.duration,
          description: this.session.description,
          time: new Date(this.session.time).toISOString(),
        })
        .then(() => {
          this.cancelSession();
          alert("Session successfully submitted");
        })
        .catch((err) => {
          if (err.response.data.code === 230) {
            alert(
              "You or the host have another recorded session at this time, please make sure all sessions are genuine."
            );
          } else {
            alert(`An error occurred: ${err}`);
          }
        });
    },
    updateService() {
      this.$http
        .put(`/services/${this.service._id}/update`, {
          title: this.own_service.title,
          tags: this.own_service.tags,
          description: this.own_service.description,
          unlisted: this.own_service.unlisted,
          contact: this.own_service.contact,
        })
        .then((res) => {
          this.showEditModal = false;
          this.service = res.data;
          this.own_service = { ...this.service };
          this.own_service.tags = this.own_service.tags.join(", ");
          alert("Service successfully updated.");
        })
        .catch((err) => alert(`An error occurred: ${err}`));
    },
    addComment() {
      this.$http
        .post(`/services/${this.service._id}/comment`, {
          content: this.new_comment,
        })
        .then((res) => {
          this.new_comment = null;
          this.comments.unshift(res.data);
        })
        .catch((err) => console.log(err));
    },
  },
  computed: {
    checkUpdate() {
      if (
        this.own_service.title &&
        this.own_service.tags &&
        this.own_service.description
      )
        return false;
      return true;
    },
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
        this.session.description &&
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
  background-color: rgb(33, 33, 33);
  border-color: rgb(78, 78, 78);
  object-fit: contain;
  width: 100%;
  max-height: 394px;
}
</style>
