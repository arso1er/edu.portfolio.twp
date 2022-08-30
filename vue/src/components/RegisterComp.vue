<template>
  <q-page padding>
    <Container style="max-width: 700px">
      <h3>Register</h3>
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
          :rules="[
            (val) =>
              /\S+@\S+\.\S+/.test(val) ||
              'Email required. Please add a valid email.',
          ]"
          ref="emailRef"
          v-model="email"
          class="q-mt-sm"
          outlined
          label="Email"
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
            Register
          </q-btn>
        </div>
      </form>
    </Container>
  </q-page>
</template>

<script>
import Container from "@/components/Container.vue";
import AuthAPI from "@/api/auth";

export default {
  name: "RegisterComp",
  data() {
    return {
      username: "",
      email: "",
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
      this.$refs.emailRef.validate();
      this.$refs.passwordRef.validate();

      if (
        this.$refs.usernameRef.hasError ||
        this.$refs.emailRef.hasError ||
        this.$refs.passwordRef.hasError
      ) {
        return false;
      }

      this.submitting = true;

      const data = {
        username: this.username,
        email: this.email,
        password: this.password,
        roles: ["editor"],
      };

      try {
        const res = await AuthAPI.register(data);
        this.submitting = false;
        this.$router.push(`/login`);
        this.$q.notify({
          progress: true,
          message: "User created. Please log in.",
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
        window.err = error;
        console.log(error);
        this.submitting = false;
        if (error.response) {
          message = error.response.data.data.message;
        }
        this.$q.notify({
          progress: true,
          message: message,
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
