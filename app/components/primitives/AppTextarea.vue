<template>
  <label class="field">
    <span>{{ label }}</span>
    <textarea :value="modelValue" rows="4" @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" />
  </label>
</template>

<script setup lang="ts">
defineProps<{ label: string; modelValue?: string | null }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
.field { display: grid; gap: 6px; font-weight: 700; font-size: 14px; }
textarea { width: 100%; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 10px 12px; color: var(--color-text); resize: vertical; }
</style>
