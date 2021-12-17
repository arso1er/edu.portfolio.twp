<template>
  <div class="backdrop" @click.self="closeModal">
    <div class="modal">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.modal {
  width: 90%;
  max-width: 500px;
  padding: 20px;
  margin: 100px auto;
  background: #fff;
  border-radius: 10px;
}
</style>
