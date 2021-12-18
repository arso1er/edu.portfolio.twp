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
      <draggable
        v-model="catPosts"
        item-key="id"
        @add="handleAdd"
        @remove="handleRemove"
        class="column q-col-gutter-md twp-draggable"
        group="posts"
      >
        <template #item="{ element }">
          <router-link
            :to="{ name: 'ShowPost', params: { id: element.id } }"
            :data-id="element.id"
          >
            <div class="twp-task">
              {{ element.title.rendered }}
            </div>
          </router-link>
        </template>
      </draggable>
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
import draggable from "vuedraggable"; // https://github.com/SortableJS/vue.draggable.next
export default {
  name: "Cat",
  props: {
    cat: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    draggable,
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
    async handleAdd(evt) {
      // When added, update post's category
      await this.$store.dispatch("updatePost", {
        id: evt.item.dataset.id,
        data: {
          categories: [+this.cat.id],
        },
      });

      // update localStorage
      localStorage.setItem(
        "posts" + this.cat.id,
        JSON.stringify(this.$store.state["posts" + this.cat.id])
      );
    },
    handleRemove(evt) {
      // update localStorage
      localStorage.setItem(
        "posts" + this.cat.id,
        JSON.stringify(this.$store.state["posts" + this.cat.id])
      );
    },
  },
  async mounted() {
    // await this.$store.dispatch("getPosts", this.cat.id);

    // https://stackoverflow.com/a/44063445
    const prevPosts = JSON.parse(
      localStorage.getItem("posts" + this.cat.id)
    ) || [...this.$store.state["posts" + this.cat.id]];
    await this.$store.dispatch("getPosts", this.cat.id);

    const newPosts = [...this.$store.state["posts" + this.cat.id]];

    const prevPostsFlat = prevPosts.map((prevPost) => prevPost.id);
    newPosts.sort(function (a, b) {
      // console.log(a);
      // console.log(b);
      // https://stackoverflow.com/a/6974105
      // https://www.w3schools.com/js/js_array_sort.asp
      if (!prevPostsFlat.includes(a.id) && prevPostsFlat.includes(b.id))
        return 1;
      if (prevPostsFlat.includes(a.id) && !prevPostsFlat.includes(b.id))
        return -1;
      return prevPostsFlat.indexOf(a.id) - prevPostsFlat.indexOf(b.id);
    });
    // console.log(newPosts);
    this.$store.dispatch("setPosts", { catId: this.cat.id, posts: newPosts });
  },
  computed: {
    catPosts: {
      get() {
        return this.$store.state["posts" + this.cat.id];
      },
      set(value) {
        this.$store.dispatch("setPosts", { catId: this.cat.id, posts: value });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
$minH: 50px;
.twp-draggable {
  min-height: $minH; /* Needed to be able to drag to empty column */
}
</style>
