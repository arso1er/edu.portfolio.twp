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
            class="row items-center justify-between q-mb-md bg-primary text-white shadow-2 q-pa-md"
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
          <div class="q-pa-md text-justify" v-html="post.content.rendered" />
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
  },
  async created() {
    const res = await this.getPost();

    const catRes = await this.$store.dispatch("getCat", res.categories[0]);
    this.catName = catRes.name;
  },
};
</script>
