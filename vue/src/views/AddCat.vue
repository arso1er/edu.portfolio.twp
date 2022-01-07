<template>
  <AddCatComp v-if="$store.state.user" />
  <LoginComp v-else />
</template>

<script>
// @ is an alias to /src
import AddCatComp from "@/components/AddCatComp.vue";
import LoginComp from "@/components/LoginComp.vue";

export default {
  name: "AddCat",
  components: {
    AddCatComp,
    LoginComp,
  },
};
</script>
