<template>
  <button class="button" :class="variant" :type="type">
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'primary' | 'secondary' | 'danger'; type?: 'button' | 'submit' }>(), {
  variant: 'primary',
  type: 'button'
})
</script>

<style scoped>
.button { border: 0; border-radius: var(--radius-sm); padding: 10px 14px; font-weight: 700; cursor: pointer; min-height: 40px; }
.primary { background: var(--color-primary); color: #fff; }
.primary:hover { background: var(--color-primary-strong); }
.secondary { background: var(--color-surface-muted); color: var(--color-text); border: 1px solid var(--color-border); }
.danger { background: var(--color-danger); color: #fff; }
</style>
