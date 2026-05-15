<template>
  <label class="field">
    <span>{{ label }}</span>
    <select :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </label>
</template>

<script setup lang="ts">
defineProps<{ label: string; modelValue?: string | null; options: { label: string; value: string }[] }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
.field { display: grid; gap: 6px; font-weight: 700; font-size: 14px; }
select { width: 100%; border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 10px 12px; min-height: 40px; background: #fff; }
</style>
