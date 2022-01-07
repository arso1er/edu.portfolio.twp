<template>
  <ShowPostComp v-if="$store.state.user" />
  <LoginComp v-else />
</template>

<script>
import ShowPostComp from "@/components/ShowPostComp.vue";
import LoginComp from "@/components/LoginComp.vue";

export default {
  name: "ShowPost",
  components: {
    ShowPostComp,
    LoginComp,
  },
};
</script>
