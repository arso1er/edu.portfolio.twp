<template>
  <EditCatComp v-if="$store.state.user" />
  <LoginComp v-else />
</template>

<script>
import EditCatComp from "@/components/EditCatComp.vue";
import LoginComp from "@/components/LoginComp.vue";

export default {
  name: "EditCat",
  components: {
    EditCatComp,
    LoginComp,
  },
};
</script>
