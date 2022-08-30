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
      <form v-if="adding" @submit.prevent="addPostSubmit">
        <q-input
          outlined
          bottom-slots
          v-model="addPostName"
          label="Card title"
          bg-color="white"
          autofocus
        >
        </q-input>
        <div>
          <q-btn flat @click="toggleAdd" :disable="submitting"> Cancel </q-btn>
          <q-btn
            flat
            color="primary"
            :disable="submitting"
            :loading="submitting"
            @click="addPostSubmit"
          >
            Submit
          </q-btn>
        </div>
      </form>
      <q-btn
        flat
        icon="add_task"
        label="Add a card"
        v-else
        @click="toggleAdd"
      />
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
    return {
      adding: false,
      submitting: false,
      addPostName: "",
    };
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
        this.submitting = false;
        if (error.response) {
          message = error.response.data.message || message;
        }
        this.$q.notify({
          progress: true,
          message: message,
          html: true,
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

    toggleAdd() {
      this.adding = !this.adding;
    },
    async addPostSubmit() {
      this.submitting = true;

      const data = {
        title: this.addPostName,
        status: "publish",
        author: this.$store.state.user.id,
        comment_status: "open",
        categories: [+this.cat.id],
      };

      try {
        const res = await this.$store.dispatch("createPost", data);
        const posts = this.$store.state["posts" + this.cat.id]
          ? [...this.$store.state["posts" + this.cat.id]]
          : [];
        posts.push(res);
        await this.$store.dispatch("setPosts", { catId: this.cat.id, posts });
        this.addPostName = "";
        this.submitting = false;
        this.adding = false;
        this.$q.notify({
          progress: true,
          message: "New card created.",
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
        this.submitting = false;
        if (error.response) {
          message = error.response.data.message || message;
        }
        this.$q.notify({
          progress: true,
          message: message,
          html: true,
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
    // https://stackoverflow.com/a/44063445
    let prevPosts = JSON.parse(localStorage.getItem("posts" + this.cat.id));
    if (!prevPosts) {
      if (this.$store.state["posts" + this.cat.id]) {
        prevPosts = [...this.$store.state["posts" + this.cat.id]];
      } else {
        prevPosts = [];
      }
    }

    await this.$store.dispatch("getPosts", this.cat.id);

    const newPosts = this.$store.state["posts" + this.cat.id]
      ? [...this.$store.state["posts" + this.cat.id]]
      : [];

    const prevPostsFlat = prevPosts.map((prevPost) => prevPost.id);
    newPosts.sort((a, b) => {
      // https://stackoverflow.com/a/6974105
      // https://www.w3schools.com/js/js_array_sort.asp
      if (!prevPostsFlat.includes(a.id) && prevPostsFlat.includes(b.id))
        return 1;
      if (prevPostsFlat.includes(a.id) && !prevPostsFlat.includes(b.id))
        return -1;
      return prevPostsFlat.indexOf(a.id) - prevPostsFlat.indexOf(b.id);
    });
    this.$store.dispatch("setPosts", { catId: this.cat.id, posts: newPosts });
  },
  computed: {
    catPosts: {
      get() {
        return this.$store.state["posts" + this.cat.id] || [];
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
