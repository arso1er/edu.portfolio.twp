<template>
  <q-page padding>
    <Container style="max-width: 700px">
      <div v-if="showEdit" class="q-mt-md">
        <form @submit.prevent="handleSubmit">
          <q-input
            :rules="[(val) => !!val || 'Title is required']"
            ref="titleRef"
            v-model="title"
            label="Title"
            filled
            clearable
          />

          <q-input
            :rules="[(val) => !!val || 'Content is required']"
            ref="contentRef"
            v-model="content"
            filled
            clearable
            type="textarea"
            label="Content"
          />

          <div class="q-mt-md">
            <q-btn color="grey" @click="toggleEditFalse" :disable="submitting">
              Cancel
            </q-btn>
            <q-btn
              class="q-ml-sm"
              color="positive"
              type="submit"
              :disable="submitting"
            >
              <q-spinner
                v-if="submitting"
                class="q-mr-sm"
                color="white"
                size="1em"
                :thickness="3"
              />
              Edit Card
            </q-btn>
          </div>
        </form>
      </div>

      <div v-else-if="post">
        <router-link to="/">
          <div class="q-mt-md q-mb-md">
            <!-- <q-icon name="west" size="xs" /> Back to my notes -->
            <q-chip color="teal" text-color="white" icon="west">
              Back to board
            </q-chip>
          </div>
        </router-link>
        <div class="shadow-2 rounded-borders">
          <div
            class="row items-center justify-between bg-primary text-white shadow-2 q-pa-md"
          >
            <div>
              <div
                class="q-mb-md q-mt-md text-h4"
                v-html="post.title.rendered"
              />
              <div class="text-h6" v-if="catName">
                In the list <span class="text-yellow">{{ catName }}</span>
              </div>
            </div>
            <div>
              <q-btn
                round
                color="secondary"
                icon="edit"
                :disable="submitting"
                @click="toggleEditTrue"
              />
              <q-btn
                class="q-ml-sm"
                round
                color="red"
                icon="delete"
                :disable="submitting"
                :loading="submitting"
                @click="removePost(post.id)"
              />
            </div>
          </div>
          <div class="q-pa-md">
            <div class="text-h5">Description</div>
            <div class="q-pt-sm text-justify" v-html="post.content.rendered" />
            <form v-if="$store.state.user" @submit.prevent="createComment">
              <q-input
                outlined
                bottom-slots
                v-model="comment"
                label="Write a comment"
              >
                <template v-slot:before>
                  <q-avatar>
                    <img :src="$store.state.user.avatar['96']" />
                  </q-avatar>
                </template>

                <template v-slot:after>
                  <q-btn
                    round
                    dense
                    flat
                    icon="send"
                    @click="createComment"
                    :loading="submitting"
                  />
                </template>
              </q-input>
            </form>

            <q-card
              class="my-card q-mb-md"
              flat
              bordered
              v-for="comment in comments"
              :key="comment.id"
            >
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="comment.author_avatar_urls['96']" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ comment.author_name }}</q-item-label>
                  <q-item-label caption>
                    {{
                      this.timeDifference(Date.now(), new Date(comment.date))
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-card-section>
                <div v-html="comment.content.rendered" />
                <div
                  v-if="
                    comment.author === $store.state.user.id ||
                    $store.state.user.roles.includes('administrator')
                  "
                >
                  <q-btn flat>Edit</q-btn>
                  <q-btn
                    flat
                    :disable="submitting"
                    @click="removeComment(comment.id)"
                  >
                    Remove
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>

            <!-- <q-card class="my-card q-mb-md" flat bordered>
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>Title</q-item-label>
                  <q-item-label caption> Subhead </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-card-section>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque,
                amet!
                <div>
                  <q-btn flat>Edit</q-btn>
                  <q-btn flat>Remove</q-btn>
                </div>
              </q-card-section>
            </q-card> -->
          </div>
        </div>
      </div>
    </Container>
  </q-page>
</template>

<script>
import Container from "@/components/Container.vue";

export default {
  name: "ShowPostComp",
  components: {
    Container,
  },
  data() {
    return {
      showEdit: false,
      submitting: false,
      title: "",
      content: "",
      post: null,
      catName: null,
      comment: "",
      comments: [],
    };
  },
  methods: {
    toggleEditTrue() {
      this.showEdit = true;
    },
    async toggleEditFalse() {
      await this.getPost();
      this.showEdit = false;
    },
    async handleSubmit() {
      this.$refs.titleRef.validate();
      this.$refs.contentRef.validate();

      if (this.$refs.titleRef.hasError || this.$refs.contentRef.hasError) {
        return false;
      }

      this.submitting = true;

      try {
        const res = await this.$store.dispatch("updatePost", {
          id: this.$route.params.id,
          data: {
            title: this.title,
            content: this.content,
          },
        });
        // console.log(res);
        await this.toggleEditFalse();

        this.submitting = false;

        this.$q.notify({
          progress: true,
          message: "The card has been updated!",
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
    async removePost(id) {
      this.submitting = true;
      try {
        await this.$store.dispatch("deletePost", id);
        this.submitting = false;
        this.$router.push(`/`);
        this.$q.notify({
          progress: true,
          message: "The card has been deleted!",
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
    async getPost() {
      const res = await this.$store.dispatch("getPost", this.$route.params.id);
      //   console.log(res);
      this.title = res.title.rendered;
      this.content = res.content.rendered;
      this.post = res;
      return res;
    },
    async createComment() {
      this.submitting = true;
      const data = {
        // author: this.$store.state.user.id,
        content: this.comment,
        post: this.$route.params.id,
        // author_avatar_urls: this.$store.state.user.avatar,
      };

      try {
        await this.$store.dispatch("createComment", data);
        await this.loadComments();
        this.submitting = false;
        this.$q.notify({
          progress: true,
          message: "Comment created.",
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
    async loadComments() {
      this.comment = "";
      const res = await this.$store.dispatch(
        "getComments",
        this.$route.params.id
      );
      // console.log(res);
      this.comments = res;
    },
    // https://stackoverflow.com/a/6109105
    timeDifference(currentPlusOne, previous) {
      var current = new Date(currentPlusOne);
      current.setHours(current.getHours() - 1); // https://stackoverflow.com/a/4943116

      var msPerMinute = 60 * 1000;
      var msPerHour = msPerMinute * 60;
      var msPerDay = msPerHour * 24;
      var msPerMonth = msPerDay * 30;
      var msPerYear = msPerDay * 365;

      var elapsed = current - previous;

      if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + " seconds ago";
      } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + " minutes ago";
      } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + " hours ago";
      } else if (elapsed < msPerMonth) {
        return "approximately " + Math.round(elapsed / msPerDay) + " days ago";
      } else if (elapsed < msPerYear) {
        return (
          "approximately " + Math.round(elapsed / msPerMonth) + " months ago"
        );
      } else {
        return (
          "approximately " + Math.round(elapsed / msPerYear) + " years ago"
        );
      }
    },
    async removeComment(id) {
      this.submitting = true;

      try {
        await this.$store.dispatch("deleteComment", id);
        await this.loadComments();
        this.submitting = false;
        this.$q.notify({
          progress: true,
          message: "The comment has been deleted!",
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
  async created() {
    const res = await this.getPost();

    const catRes = await this.$store.dispatch("getCat", res.categories[0]);
    this.catName = catRes.name;

    await this.loadComments();
  },
};
</script>
