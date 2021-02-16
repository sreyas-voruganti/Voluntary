<template>
  <div class="container my-6" style="max-width: 700px">
    <p class="title is-3 mb-3">Create a Service</p>
    <div class="box">
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Title"
            v-model="service.title"
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
            v-model="service.contact"
          />
        </div>
      </div>
      <div class="field">
        <label class="label">Tags</label>
        <div class="tags mb-1" v-if="service.tags">
          <span
            class="tag"
            v-for="(tag, index) in service.tags.split(', ')"
            :key="index"
            >{{ tag }}</span
          >
        </div>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder='Tags (ex. "piano, music")'
            v-model="service.tags"
          />
        </div>
      </div>
      <div class="field">
        <label class="label">Image</label>
        <div class="control">
          <div class="file has-name is-fullwidth is-light">
            <label class="file-label">
              <input
                class="file-input"
                type="file"
                accept="image/*"
                ref="image_upload"
                @change="onImageChange"
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
                {{ service.image ? service.image.name : "No Image Chosen" }}
              </span>
            </label>
          </div>
        </div>
      </div>
      <div class="field">
        <label class="label">Description</label>
        <div class="control">
          <textarea
            class="textarea"
            placeholder="Description"
            v-model="service.description"
          ></textarea>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input type="checkbox" v-model="service.unlisted" />
            Make this service unlisted (publicly unavailable without url)
          </label>
        </div>
      </div>
      <div class="field is-grouped">
        <div class="control">
          <button
            class="button is-link"
            :disabled="checkSubmit"
            @click="onSubmit"
          >
            Create
          </button>
        </div>
        <div class="control">
          <button
            class="button is-link is-light"
            @click="service = { image: null, unlisted: false }"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServiceForm",
  data() {
    return {
      service: {
        image: null,
        unlisted: false,
      },
    };
  },
  methods: {
    onImageChange() {
      this.service.image = this.$refs.image_upload.files[0];
    },
    onSubmit() {
      function hasDuplicates(array) {
        return new Set(array).size !== array.length;
      }
      if (hasDuplicates(this.service.tags.split(", ")))
        return alert("Tags cannot contain duplicate values");
      const fd = new FormData();
      fd.append("title", this.service.title);
      fd.append("tags", this.service.tags);
      fd.append("image", this.service.image);
      fd.append("description", this.service.description);
      fd.append("unlisted", this.service.unlisted);
      fd.append("contact", this.service.contact);
      this.$http
        .post("/services/create", fd)
        .then((res) => {
          this.service = { image: null, unlisted: false };
          this.$router.push(`/services/${res.data._id}`);
        })
        .catch((err) => console.log(err));
    },
  },
  computed: {
    checkSubmit() {
      if (
        this.service.title &&
        this.service.tags &&
        this.service.image &&
        this.service.contact &&
        this.service.description
      )
        return false;
      return true;
    },
  },
};
</script>
