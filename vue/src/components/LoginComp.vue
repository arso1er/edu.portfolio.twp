<template>
  <q-page padding>
    <Container style="max-width: 700px">
      <h3>Login</h3>
      <form @submit.prevent="handleSubmit">
        <q-input
          :rules="[(val) => !!val || 'Username is required']"
          ref="usernameRef"
          v-model="username"
          class="q-mt-sm"
          outlined
          label="Username"
        />

        <q-input
          :rules="[(val) => !!val || 'Password is required']"
          type="password"
          ref="passwordRef"
          v-model="password"
          class="q-mt-sm"
          outlined
          label="Password"
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
            Login
          </q-btn>
        </div>
      </form>
    </Container>
  </q-page>
</template>

<script>
import Container from "@/components/Container.vue";

export default {
  name: "LoginComp",
  data() {
    return {
      username: "",
      password: "",
      submitting: false,
    };
  },
  components: {
    Container,
  },
  methods: {
    async handleSubmit() {
      this.$refs.usernameRef.validate();
      this.$refs.passwordRef.validate();

      if (this.$refs.usernameRef.hasError || this.$refs.passwordRef.hasError) {
        return false;
      }

      this.submitting = true;

      const data = {
        username: this.username,
        password: this.password,
      };

      try {
        await this.$store.dispatch("login", data);
        this.submitting = false;
        if (this.$route.name !== "Login") {
          return window.location.reload();
        }
        this.$router.push(`/`);
        this.$q.notify({
          progress: true,
          message: "You are logged in",
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
};
</script>
