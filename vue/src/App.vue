<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-mr-auto q-ml-auto row items-center justify-between">
        <q-toolbar-title>
          <router-link to="/">
            <q-btn stretch flat color="white" label="TWP app" />
          </router-link>
        </q-toolbar-title>
        <div v-if="$store.state.user">
          <q-btn
            stretch
            flat
            color="white"
            :label="$store.state.user.username"
          />
          <q-btn stretch flat color="white" label="Logout" @click="logout" />
        </div>
        <div v-else>
          <router-link to="/register">
            <q-btn stretch flat color="white" label="Register" />
          </router-link>
          <router-link to="/login">
            <q-btn stretch flat color="white" label="Login" />
          </router-link>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
$child: inherit;

a {
  color: $child;
  text-decoration: $child;
}
</style>

<script>
export default {
  name: "App",
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    },
  },
  async created() {
    this.$store.dispatch("loadUser");
  },
};
</script>
