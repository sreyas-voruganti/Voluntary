<template>
  <div class="box p-3">
    <div v-for="service in services" :key="service._id" class="box p-2 m-2">
      <article class="media">
        <figure class="media-left">
          <img
            :src="`http://127.0.0.1:8000/uploads/${service.image}`"
            style="max-width: 100px"
          />
        </figure>
        <div class="media-content">
          <div class="content">
            <p>
              <span class="title is-5"
                ><router-link :to="`/services/${service._id}`">{{
                  service.title
                }}</router-link></span
              >
              <router-link class="ml-2" :to="`/users/${service.user._id}`">{{
                service.user.name
              }}</router-link>
              <span class="ml-2">{{ service.sessions }} sessions</span>
              <br />
              {{ service.description.substring(0, 100) }}...
            </p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopularServices",
  props: {
    services: Array,
  },
};
</script>
