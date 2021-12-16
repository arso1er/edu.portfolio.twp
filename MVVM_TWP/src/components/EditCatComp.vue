<template>
  <q-page padding>
    <Container style="max-width: 700px">
      <h3>Edit list</h3>
      <form @submit.prevent="handleSubmit">
        <q-input
          :rules="[(val) => !!val || 'Name is required']"
          ref="nameRef"
          v-model="name"
          class="q-mt-sm"
          outlined
          label="Name"
        />

        <q-input
          :rules="[(val) => !!val || 'Description is required']"
          type="textarea"
          ref="descriptionRef"
          v-model="description"
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
            Edit list
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
      name: "",
      description: "",
      submitting: false,
    };
  },
  components: {
    Container,
  },
  methods: {
    async handleSubmit() {
      this.$refs.nameRef.validate();
      this.$refs.descriptionRef.validate();

      if (this.$refs.nameRef.hasError || this.$refs.descriptionRef.hasError) {
        return false;
      }

      this.submitting = true;

      const data = {
        name: this.name,
        description: this.description,
      };

      try {
        await this.$store.dispatch("updateCat", {
          id: this.$route.params.id,
          data,
        });
        this.submitting = false;
        this.$router.push(`/`);
        this.$q.notify({
          progress: true,
          message: "List updated.",
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
    const res = await this.$store.dispatch("getCat", this.$route.params.id);
    // console.log(res);
    this.name = res.name;
    this.description = res.description;
  },
};
</script>
