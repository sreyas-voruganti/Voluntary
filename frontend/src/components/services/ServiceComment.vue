<template>
  <article class="media" v-if="show">
    <figure class="media-left">
      <p class="image is-48x48">
        <img :src="comment.user.pp" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong
            >{{ comment.user.name }} <span v-show="owns">(You)</span></strong
          >
          <span class="ml-2">{{
            new Date(comment.createdAt).toDateString()
          }}</span>
          <br />
          {{ comment.content }}
          <br />
          <a class="has-text-danger" v-if="owns" @click="deleteComment"
            >Delete</a
          >
        </p>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "ServiceComment",
  props: {
    comment: Object,
    service_id: String,
  },
  data() {
    return {
      show: true,
    };
  },
  computed: {
    owns() {
      return this.comment.user._id == localStorage.getItem("user_id");
    },
  },
  methods: {
    deleteComment() {
      if (confirm("Are you sure you want to delete this comment?")) {
        this.$http
          .delete(`/services/comments/${this.comment._id}`)
          .then(() => (this.show = false))
          .catch((err) => alert(`An error occurred: ${err}`));
      }
    },
  },
};
</script>

<style></style>
