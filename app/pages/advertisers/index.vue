<template>
  <div class="page">
    <div class="page-header"><div><div class="eyebrow">Demand</div><h1>Advertisers</h1><p>Advertiser contacts and notes.</p></div><AppButton @click="save">Create advertiser</AppButton></div>
    <AppCard><div class="form-grid">
      <AppInput v-model="form.name" label="Name" />
      <AppInput v-model="form.contact_name" label="Contact name" />
      <AppInput v-model="form.contact_email" label="Contact email" />
      <AppInput v-model="form.contact_phone" label="Contact phone" />
      <AppSelect v-model="form.status" label="Status" :options="statuses" />
    </div></AppCard>
    <AppTable :columns="columns" :rows="advertisers">
      <template #name="{ row }"><NuxtLink :to="`/advertisers/${row.id}`"><strong>{{ row.name }}</strong></NuxtLink></template>
      <template #status="{ row }"><AppBadge :label="row.status" :tone="row.status === 'active' ? 'success' : 'warning'" /></template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
const statuses = [{ label: 'Active', value: 'active' }, { label: 'Paused', value: 'paused' }, { label: 'Archived', value: 'archived' }]
const columns = [{ key: 'name', label: 'Name' }, { key: 'contact_name', label: 'Contact' }, { key: 'contact_email', label: 'Email' }, { key: 'status', label: 'Status' }]
const form = reactive<any>({ name: '', contact_name: '', contact_email: '', contact_phone: '', status: 'active' })
const { data, refresh } = await useFetch<any>('/api/advertisers')
const advertisers = computed(() => data.value?.data?.advertisers || [])
async function save() {
  await useApiFetch('/api/advertisers', { method: 'POST', body: form })
  Object.assign(form, { name: '', contact_name: '', contact_email: '', contact_phone: '', status: 'active' })
  await refresh()
}
</script>
