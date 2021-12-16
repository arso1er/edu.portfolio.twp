<template>
  <q-card flat bordered class="my-card bg-cyan">
    <q-card-section class="q-pb-none">
      <div class="row items-center">
        <div class="col">
          <div class="text-h6">{{ cat.name }}</div>
        </div>

        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu auto-close>
              <q-list>
                <router-link :to="{ name: 'AddPost', params: { id: cat.id } }">
                  <q-item clickable>
                    <q-item-section>Add a card</q-item-section>
                  </q-item>
                </router-link>
                <router-link :to="{ name: 'EditCat', params: { id: cat.id } }">
                  <q-item clickable>
                    <q-item-section>Edit list</q-item-section>
                  </q-item>
                </router-link>
                <q-item clickable @click="removeCat(cat.id)">
                  <q-item-section>Remove list</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-card-section
      class="q-pt-sm twp-task-wrapper"
      v-if="$store.state['posts' + cat.id]"
    >
      <router-link
        :to="{ name: 'ShowPost', params: { id: post.id } }"
        v-for="post in $store.state['posts' + cat.id]"
        :key="post.id"
      >
        <div class="twp-task">
          {{ post.title.rendered }}
        </div>
      </router-link>
      <!-- <div class="twp-task">Add to calendar</div>
      <div class="twp-task">Add to calendar</div>
      <div class="twp-task">Add to calendar</div>
      <div class="twp-task">Add to calendar</div> -->
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <router-link :to="{ name: 'AddPost', params: { id: cat.id } }">
        <q-btn flat icon="add_task" label="Add a card" />
      </router-link>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: "Cat",
  props: {
    cat: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  methods: {
    async removeCat(id) {
      this.submitting = true;
      try {
        await this.$store.dispatch("deleteCat", id);
        this.submitting = false;
        this.$q.notify({
          progress: true,
          message: "The list has been deleted!",
          // color: 'primary',
          type: "positive",
          actions: [
            {
              label: "Dismiss",
              color: "white",
              handler: () => {
                /* ... */
              },
            },
          ],
        });
      } catch (error) {
        let message = "The request failed.";
        // window.err = error;
        // console.log(error);
        this.submitting = false;
        if (error.response) {
          message = error.response.data.message || message;
        }
        this.$q.notify({
          progress: true,
          message: message,
          html: true,
          // color: 'primary',
          type: "negative",
          timeout: 10000,
          actions: [
            {
              label: "Dismiss",
              color: "white",
              handler: () => {
                /* ... */
              },
            },
          ],
        });
      }
    },
  },
  async mounted() {
    await this.$store.dispatch("getPosts", this.cat.id);
    // console.log(this.$store.state);
  },
};
</script>
