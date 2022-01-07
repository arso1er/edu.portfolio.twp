<template>
  <AddPostComp v-if="$store.state.user" />
  <LoginComp v-else />
</template>

<script>
import AddPostComp from "@/components/AddPostComp.vue";
import LoginComp from "@/components/LoginComp.vue";

export default {
  name: "AddPost",
  components: {
    AddPostComp,
    LoginComp,
  },
};
</script>
