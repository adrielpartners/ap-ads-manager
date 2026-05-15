<template>
  <AppCard>
    <div class="label">{{ label }}</div>
    <div class="value">{{ value }}</div>
  </AppCard>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string | number }>()
</script>

<style scoped>
.label { color: var(--color-muted); font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; }
.value { margin-top: 8px; font-size: 30px; font-weight: 850; }
</style>
