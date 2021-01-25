<template>
  <div class="card m-3" style="max-width: 360px">
    <div class="card-image">
      <figure class="image is-16by9">
        <img :src="service.image" />
      </figure>
    </div>
    <div class="card-content">
      <div class="media mb-3">
        <div class="media-left">
          <figure class="image is-48x48">
            <img :src="service.user.pp" />
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">
            <router-link :to="`/services/${service._id}`">{{
              service.title
            }}</router-link>
          </p>
          <p class="subtitle is-6">
            <router-link :to="`/users/${service.user._id}`">{{
              service.user.name
            }}</router-link>
          </p>
        </div>
      </div>
      <div class="tags mb-0">
        <span class="tag" v-for="(tag, index) in service.tags" :key="index"
          ><router-link :to="`/services/tags?t=${tag}`">{{
            tag
          }}</router-link></span
        >
      </div>
      <div class="content">{{ service.description.substring(0, 60) }}...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SmallService",
  props: {
    service: Object,
  },
};
</script>
