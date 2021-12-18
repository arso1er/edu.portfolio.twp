<template>
  <q-page padding v-if="$store.state.user">
    <Container>
      <div class="twp-cats">
        <draggable v-model="cats" item-key="id" class="" group="cats">
          <template #item="{ element }">
            <Cat :cat="element" />
          </template>
        </draggable>

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
import draggable from "vuedraggable"; // https://github.com/SortableJS/vue.draggable.next

export default {
  name: "Home",
  components: { Container, Cat, LoginComp, draggable },
  async mounted() {
    // https://stackoverflow.com/a/44063445
    const prevCats = JSON.parse(localStorage.getItem("cats")) || [
      ...this.$store.state.cats,
    ];
    // console.log(prevCats);
    await this.$store.dispatch("getCats");

    const newCats = [...this.$store.state.cats];
    // console.log(newCats);

    const prevCatsFlat = prevCats.map((prevCat) => prevCat.id);
    // console.log(prevCatsFlat);
    newCats.sort(function (a, b) {
      // console.log(a);
      // console.log(b);
      // https://stackoverflow.com/a/6974105
      // https://www.w3schools.com/js/js_array_sort.asp
      if (!prevCatsFlat.includes(a.id) && prevCatsFlat.includes(b.id)) return 1;
      if (prevCatsFlat.includes(a.id) && !prevCatsFlat.includes(b.id))
        return -1;
      return prevCatsFlat.indexOf(a.id) - prevCatsFlat.indexOf(b.id);
    });
    // console.log(newCats);
    this.$store.dispatch("setCats", newCats);
  },
  computed: {
    cats: {
      get() {
        return this.$store.state.cats;
      },
      set(value) {
        this.$store.dispatch("setCats", value);
      },
    },
  },
};
</script>

<style>
.twp-cats,
.twp-cats > div {
  display: flex;
}
/* .twp-cats > div .my-card { */
.my-card {
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
