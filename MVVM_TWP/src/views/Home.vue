<template>
  <q-page padding v-if="$store.state.user">
    <Container>
      <div class="twp-cats">
        <Cat v-for="cat in $store.state.cats" :key="cat.id" :cat="cat" />

        <q-card flat bordered class="my-card bg-cyan">
          <q-card-section>
            <div class="row items-center">
              <router-link to="/cats/add">
                <q-btn flat icon="add" label="Add another list"
              /></router-link>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </Container>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <router-link to="/cats/add">
        <q-btn color="primary" icon="add" label="Add another list" />
      </router-link>
    </q-page-sticky>
  </q-page>
  <LoginComp v-else />
</template>

<script>
// @ is an alias to /src
import Container from "@/components/Container.vue";
import Cat from "@/components/Cat.vue";
import LoginComp from "@/components/LoginComp.vue";

export default {
  name: "Home",
  components: { Container, Cat, LoginComp },
  async mounted() {
    await this.$store.dispatch("getCats");
  },
};
</script>

<style>
.twp-cats {
  display: flex;
}
.twp-cats .my-card {
  align-self: start;
  min-width: 250px;
  max-width: 300px;
  margin-right: 1rem;
}
.twp-task {
  padding: 0.5em;
  background: #e0e0e0;
  border-radius: 6px;
}
/* .twp-task-wrapper > div > a:not(:last-child) > div {
  margin-bottom: 12px;
} */
</style>
