<template>
  <label class="upload">
    <span>{{ label }}</span>
    <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif" @change="$emit('select', ($event.target as HTMLInputElement).files?.[0] || null)">
  </label>
</template>

<script setup lang="ts">
defineProps<{ label: string }>()
defineEmits<{ select: [file: File | null] }>()
</script>

<style scoped>
.upload { display: grid; gap: 8px; font-weight: 700; }
input { border: 1px dashed var(--color-border); border-radius: var(--radius-md); padding: 16px; background: var(--color-surface-muted); }
</style>
