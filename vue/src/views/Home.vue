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
              <form v-if="adding" @submit.prevent="addCatSubmit">
                <q-input
                  outlined
                  bottom-slots
                  v-model="addCatName"
                  label="List name"
                  bg-color="white"
                  autofocus
                >
                </q-input>
                <div>
                  <q-btn flat @click="toggleAdd" :disable="submitting">
                    Cancel
                  </q-btn>
                  <q-btn
                    flat
                    color="primary"
                    :disable="submitting"
                    :loading="submitting"
                    @click="addCatSubmit"
                  >
                    Submit
                  </q-btn>
                </div>
              </form>
              <q-btn
                flat
                icon="add"
                label="Add another list"
                v-else
                @click="toggleAdd"
              />
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
    if (!this.$store.state.user) return;

    // https://stackoverflow.com/a/44063445
    const prevCats = JSON.parse(localStorage.getItem("cats")) || [
      ...this.$store.state.cats,
    ];
    await this.$store.dispatch("getCats");

    const newCats = [...this.$store.state.cats];

    const prevCatsFlat = prevCats.map((prevCat) => prevCat.id);
    newCats.sort((a, b) => {
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
  data() {
    return {
      adding: false,
      submitting: false,
      addCatName: "",
    };
  },
  methods: {
    toggleAdd() {
      this.adding = !this.adding;
    },
    async addCatSubmit() {
      this.submitting = true;

      const data = {
        name: this.addCatName,
      };

      try {
        await this.$store.dispatch("createCat", data);
        await this.$store.dispatch("getCats");
        this.addCatName = "";
        this.submitting = false;
        this.adding = false;
        this.$q.notify({
          progress: true,
          message: "New list created.",
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

<style lang="scss">
.twp-cats {
  display: flex;
}
.twp-cats {
  > div {
    display: flex;
  }
}
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
</style>
