<template>
  <label class="field">
    <span>{{ label }}</span>
    <input :value="modelValue" :type="type" :placeholder="placeholder" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
  </label>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label: string; modelValue?: string | number | null; type?: string; placeholder?: string }>(), { type: 'text' })
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
.field { display: grid; gap: 6px; font-weight: 700; font-size: 14px; }
input { width: 100%; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 10px 12px; min-height: 40px; color: var(--color-text); background: #fff; }
input:focus { outline: 2px solid rgba(15, 118, 110, .22); border-color: var(--color-primary); }
</style>
