<template>
  <div class="tabs">
    <button v-for="tab in tabs" :key="tab.value" :class="{ active: modelValue === tab.value }" @click="$emit('update:modelValue', tab.value)">
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string; tabs: { label: string; value: string }[] }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
.tabs { display: inline-flex; background: var(--color-surface-muted); border-radius: var(--radius-md); padding: 4px; gap: 4px; }
button { border: 0; background: transparent; padding: 8px 12px; border-radius: var(--radius-sm); font-weight: 700; cursor: pointer; }
.active { background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
</style>
