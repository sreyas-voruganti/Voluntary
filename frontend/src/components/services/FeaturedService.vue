<template>
  <div class="card mr-6" style="max-width: 700px">
    <div class="card-image">
      <figure class="image is-16by9">
        <img :src="service.image" />
      </figure>
    </div>
    <div class="card-content">
      <div class="media mb-3">
        <div class="media-left">
          <figure class="image is-64x64">
            <img :src="service.user.pp" />
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-3">
            <router-link :to="`/services/${service._id}`">{{
              service.title
            }}</router-link>
          </p>
          <p class="subtitle is-5">
            <router-link :to="`/users/${service.user._id}`">{{
              service.user.name
            }}</router-link>
          </p>
        </div>
      </div>
      <div class="tags my-0">
        <span class="tag" v-for="(tag, index) in service.tags" :key="index"
          ><router-link :to="`/services/tags?t=${tag}`">{{
            tag
          }}</router-link></span
        >
      </div>
      <p class="mb-2 has-text-weight-medium">
        <i class="far fa-calendar-alt"></i> Posted on
        {{ new Date(service.createdAt).toDateString() }}
      </p>
      <div class="content">{{ service.description.substring(0, 260) }}...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FeaturedService",
  props: {
    service: Object,
  },
};
</script>
