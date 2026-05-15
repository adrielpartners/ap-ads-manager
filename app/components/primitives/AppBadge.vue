<template>
  <span class="badge" :class="tone">{{ label }}</span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label: string; tone?: 'neutral' | 'success' | 'warning' | 'danger' }>(), { tone: 'neutral' })
</script>

<style scoped>
.badge { display: inline-flex; align-items: center; min-height: 24px; border-radius: 999px; padding: 2px 9px; font-size: 12px; font-weight: 800; background: var(--color-surface-muted); color: var(--color-muted); }
.success { background: #dcfce7; color: var(--color-success); }
.warning { background: #fef3c7; color: var(--color-warning); }
.danger { background: #fee2e2; color: var(--color-danger); }
</style>
