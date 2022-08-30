<template>
  <q-page padding>
    <Container style="max-width: 700px">
      <h3>
        Add a card to <span class="text-primary"> {{ catName }} </span> list
      </h3>
      <form @submit.prevent="handleSubmit">
        <q-input
          :rules="[(val) => !!val || 'Title is required']"
          ref="titleRef"
          v-model="title"
          class="q-mt-sm"
          outlined
          label="Title"
        />

        <q-input
          type="textarea"
          v-model="content"
          class="q-mt-sm"
          outlined
          label="Description"
        />

        <div class="q-mt-md">
          <q-btn color="grey" to="/" type="reset" :disable="submitting">
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
            Add card
          </q-btn>
        </div>
      </form>
    </Container>
  </q-page>
</template>

<script>
import Container from "@/components/Container.vue";

export default {
  name: "EditCatComp",
  data() {
    return {
      catName: "",
      title: "",
      content: "",
      submitting: false,
    };
  },
  components: {
    Container,
  },
  methods: {
    async handleSubmit() {
      this.$refs.titleRef.validate();

      if (this.$refs.titleRef.hasError) {
        return false;
      }

      this.submitting = true;

      const data = {
        title: this.title,
        content: this.content,
        status: "publish",
        author: this.$store.state.user.id,
        comment_status: "open",
        categories: [+this.$route.params.id],
      };

      try {
        await this.$store.dispatch("createPost", data);
        this.submitting = false;
        this.$router.push(`/`);
        this.$q.notify({
          progress: true,
          message: "Card created.",
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
  async created() {
    const res = await this.$store.dispatch("getCat", this.$route.params.id);
    this.catName = res.name;
  },
};
</script>
