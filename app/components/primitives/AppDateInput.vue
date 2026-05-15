<template>
  <AppInput :label="label" :model-value="modelValue" type="date" @update:model-value="$emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
defineProps<{ label: string; modelValue?: string | null }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
