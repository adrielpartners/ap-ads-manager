<template>
  <dialog ref="dialog" class="dialog">
    <div class="head">
      <h2>{{ title }}</h2>
      <button type="button" @click="close">x</button>
    </div>
    <slot />
  </dialog>
</template>

<script setup lang="ts">
const dialog = ref<HTMLDialogElement>()
defineProps<{ title: string }>()
defineExpose({ open: () => dialog.value?.showModal(), close: () => dialog.value?.close() })
function close() { dialog.value?.close() }
</script>

<style scoped>
.dialog { border: 0; border-radius: var(--radius-md); padding: 0; width: min(720px, calc(100vw - 32px)); box-shadow: var(--shadow-card); }
.dialog::backdrop { background: rgba(15, 23, 42, .45); }
.head { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px; border-bottom: 1px solid var(--color-border); }
.head + :deep(*) { padding: 22px; }
button { border: 1px solid var(--color-border); background: #fff; border-radius: var(--radius-sm); width: 32px; height: 32px; cursor: pointer; }
</style>
