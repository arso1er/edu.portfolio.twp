<template>
  <q-spinner-audio
    v-if="!mounted"
    class="fixed-center"
    color="primary"
    size="4em"
  />
  <q-page padding v-if="mounted && post">
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
        <Modal v-if="showCommentModal" @close="toggleModal">
          <form v-if="$store.state.user" @submit.prevent="editCommentSubmit">
            <q-input
              outlined
              bottom-slots
              v-model="currentComment.content"
              label="Comment"
            >
              <template v-slot:before>
                <q-avatar>
                  <img :src="currentComment.avatar" />
                </q-avatar>
              </template>
            </q-input>
            <div>
              <q-btn flat @click="toggleModal" :disable="submitting">
                Cancel
              </q-btn>
              <q-btn
                flat
                color="primary"
                :disable="submitting"
                :loading="submitting"
                @click="editCommentSubmit"
              >
                Submit
              </q-btn>
            </div>
          </form>
        </Modal>
        <router-link to="/">
          <div class="q-mt-md q-mb-md">
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
            <div
              class="q-pt-sm text-justify"
              v-html="
                post.content.rendered ||
                '<p>Edit this post to add a description.</p>'
              "
            />
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
                  <q-btn flat @click="editComment(comment)">Edit</q-btn>
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
          </div>
        </div>
      </div>
    </Container>
  </q-page>
  <Error404 v-if="mounted && !post" />
</template>

<script>
import Container from "@/components/Container.vue";
import Modal from "@/components/CommentModal.vue";
import Error404 from "@/views/Error404.vue";

export default {
  name: "ShowPostComp",
  components: {
    Container,
    Modal,
    Error404,
  },
  data() {
    return {
      mounted: false,
      showEdit: false,
      submitting: false,
      title: "",
      content: "",
      post: null,
      catName: null,
      comment: "",
      comments: [],
      showCommentModal: false,
      currentComment: {
        id: "",
        avatar: "",
        content: "",
      },
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

      if (this.$refs.titleRef.hasError) {
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
        await this.toggleEditFalse();

        this.submitting = false;

        this.$q.notify({
          progress: true,
          message: "The card has been updated!",
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
    async removePost(id) {
      this.submitting = true;
      try {
        await this.$store.dispatch("deletePost", id);
        this.submitting = false;
        this.$router.push(`/`);
        this.$q.notify({
          progress: true,
          message: "The card has been deleted!",
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
    async getPost() {
      const res = await this.$store.dispatch("getPost", this.$route.params.id);
      this.title = res.title.rendered;
      this.content = res.content.rendered;
      this.post = res;
      return res;
    },
    async createComment() {
      this.submitting = true;
      const data = {
        content: this.comment,
        post: this.$route.params.id,
      };

      try {
        await this.$store.dispatch("createComment", data);
        await this.loadComments();
        this.submitting = false;
        this.$q.notify({
          progress: true,
          message: "Comment created.",
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
    async loadComments() {
      this.comment = "";
      const res = await this.$store.dispatch(
        "getComments",
        this.$route.params.id
      );
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
    toggleModal() {
      this.showCommentModal = !this.showCommentModal;
    },
    editComment(comment) {
      this.currentComment = {
        id: comment.id,
        avatar: comment.author_avatar_urls["96"],
        content: comment.content.rendered,
      };
      this.toggleModal();
    },
    async editCommentSubmit() {
      this.submitting = true;

      try {
        const res = await this.$store.dispatch("updateComment", {
          id: this.currentComment.id,
          data: {
            content: this.currentComment.content,
          },
        });
        await this.loadComments();
        this.submitting = false;
        this.toggleModal();
        this.$q.notify({
          progress: true,
          message: "The comment has been updated!",
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
        this.toggleModal();
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
  async created() {
    try {
      const res = await this.getPost();

      const catRes = await this.$store.dispatch("getCat", res.categories[0]);
      this.catName = catRes.name;

      await this.loadComments();
      this.mounted = true;
    } catch (error) {
      this.mounted = true;
    }
  },
};
</script>
