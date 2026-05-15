<template>
  <div class="page">
    <div class="page-header"><div><div class="eyebrow">Flights</div><h1>Campaigns</h1><p>Campaign schedules and state.</p></div><AppButton @click="save">Create campaign</AppButton></div>
    <AppCard><div class="form-grid">
      <AppInput v-model="form.name" label="Name" />
      <AppSelect v-model="form.property_id" label="Property" :options="propertyOptions" />
      <AppSelect v-model="form.advertiser_id" label="Advertiser" :options="advertiserOptions" />
      <AppDateInput v-model="form.start_date" label="Start date" />
      <AppDateInput v-model="form.end_date" label="End date" />
      <AppSelect v-model="form.status" label="Status" :options="statuses" />
    </div></AppCard>
    <AppTable :columns="columns" :rows="campaigns">
      <template #name="{ row }"><NuxtLink :to="`/campaigns/${row.id}`"><strong>{{ row.name }}</strong></NuxtLink></template>
      <template #status="{ row }"><AppBadge :label="row.status" :tone="row.status === 'active' ? 'success' : 'neutral'" /></template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
const statuses = ['draft', 'active', 'paused', 'completed'].map((value) => ({ label: value, value }))
const form = reactive<any>({ name: '', property_id: '', advertiser_id: '', start_date: '', end_date: '', status: 'draft' })
const [{ data, refresh }, { data: propertiesData }, { data: advertisersData }] = await Promise.all([useFetch<any>('/api/campaigns'), useFetch<any>('/api/properties'), useFetch<any>('/api/advertisers')])
const campaigns = computed(() => data.value?.data?.campaigns || [])
const propertyOptions = computed(() => [{ label: 'Select property', value: '' }, ...(propertiesData.value?.data?.properties || []).map((p: any) => ({ label: p.name, value: p.id }))])
const advertiserOptions = computed(() => [{ label: 'Select advertiser', value: '' }, ...(advertisersData.value?.data?.advertisers || []).map((a: any) => ({ label: a.name, value: a.id }))])
const columns = [{ key: 'name', label: 'Name' }, { key: 'property_name', label: 'Property' }, { key: 'advertiser_name', label: 'Advertiser' }, { key: 'status', label: 'Status' }]
async function save() {
  await useApiFetch('/api/campaigns', { method: 'POST', body: form })
  Object.assign(form, { name: '', property_id: '', advertiser_id: '', start_date: '', end_date: '', status: 'draft' })
  await refresh()
}
</script>
