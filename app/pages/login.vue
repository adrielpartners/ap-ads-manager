<template>
  <AppCard class="login">
    <h1>Sign in</h1>
    <p>Owner access for AP Ads Manager.</p>
    <form class="form-grid single" @submit.prevent="submit">
      <AppInput v-model="form.email" label="Email" type="email" />
      <AppInput v-model="form.password" label="Password" type="password" />
      <AppButton type="submit">Sign in</AppButton>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const form = reactive({ email: '', password: '' })
const error = ref('')
async function submit() {
  error.value = ''
  try {
    await useApiFetch('/api/auth/login', { method: 'POST', body: form })
    await navigateTo('/')
  } catch (err: any) {
    error.value = err.message
  }
}
</script>

<style scoped>
.login { width: min(440px, 100%); }
.single { grid-template-columns: 1fr; margin-top: 22px; }
.error { color: var(--color-danger); font-weight: 700; }
</style>
