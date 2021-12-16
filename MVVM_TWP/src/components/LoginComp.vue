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

        <!-- <q-card flat bordered class="q-mt-sm">
          <q-editor v-model="note.content" min-height="5rem" />
        </q-card> -->

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
      //   this.$refs.emailRef.validate();
      this.$refs.passwordRef.validate();

      if (
        this.$refs.usernameRef.hasError ||
        // this.$refs.emailRef.hasError ||
        this.$refs.passwordRef.hasError
      ) {
        return false;
      }

      // console.log(this.username);
      // console.log(this.password);

      this.submitting = true;

      const data = {
        username: this.username,
        password: this.password,
      };

      try {
        await this.$store.dispatch("login", data);
        this.submitting = false;
        this.$router.push(`/`);
        this.$q.notify({
          progress: true,
          message: "You are logged in",
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
};
</script>
