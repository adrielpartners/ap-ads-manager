<template>
  <div class="page">
    <div class="page-header"><div><div class="eyebrow">Creatives</div><h1>Ads</h1><p>Creatives, destinations, UTMs, and rotation weight.</p></div><AppButton @click="save">Create ad</AppButton></div>
    <AppCard><div class="form-grid">
      <AppInput v-model="form.name" label="Name" />
      <AppSelect v-model="form.property_id" label="Property" :options="propertyOptions" />
      <AppSelect v-model="form.advertiser_id" label="Advertiser" :options="advertiserOptions" />
      <AppSelect v-model="form.campaign_id" label="Campaign" :options="campaignOptions" />
      <AppInput v-model="form.destination_url" label="Destination URL" />
      <AppInput v-model="form.alt_text" label="Alt text" />
      <AppInput v-model="form.weight" label="Weight" type="number" />
      <AppSelect v-model="form.status" label="Status" :options="statuses" />
      <AppDateInput v-model="form.start_date" label="Start date" />
      <AppDateInput v-model="form.end_date" label="End date" />
      <AppInput v-model="form.utm_source" label="UTM source override" />
      <AppInput v-model="form.utm_medium" label="UTM medium override" />
      <AppInput v-model="form.utm_campaign" label="UTM campaign override" />
      <AppInput v-model="form.utm_content" label="UTM content override" />
      <AppInput v-model="form.utm_term" label="UTM term override" />
    </div></AppCard>
    <AppTable :columns="columns" :rows="ads">
      <template #name="{ row }"><NuxtLink :to="`/ads/${row.id}`"><strong>{{ row.name }}</strong></NuxtLink></template>
      <template #status="{ row }"><AppBadge :label="row.status" :tone="row.status === 'active' ? 'success' : 'neutral'" /></template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
const statuses = ['draft', 'active', 'paused', 'archived'].map((value) => ({ label: value, value }))
const form = reactive<any>({ name: '', property_id: '', advertiser_id: '', campaign_id: '', destination_url: '', alt_text: '', weight: 1, status: 'draft' })
const [{ data, refresh }, { data: propertiesData }, { data: advertisersData }, { data: campaignsData }] = await Promise.all([
  useFetch<any>('/api/ads'),
  useFetch<any>('/api/properties'),
  useFetch<any>('/api/advertisers'),
  useFetch<any>('/api/campaigns')
])
const ads = computed(() => data.value?.data?.ads || [])
const propertyOptions = computed(() => [{ label: 'Select property', value: '' }, ...(propertiesData.value?.data?.properties || []).map((p: any) => ({ label: p.name, value: p.id }))])
const advertiserOptions = computed(() => [{ label: 'Select advertiser', value: '' }, ...(advertisersData.value?.data?.advertisers || []).map((a: any) => ({ label: a.name, value: a.id }))])
const campaignOptions = computed(() => [{ label: 'Select campaign', value: '' }, ...(campaignsData.value?.data?.campaigns || []).map((c: any) => ({ label: c.name, value: c.id }))])
const columns = [{ key: 'name', label: 'Name' }, { key: 'campaign_name', label: 'Campaign' }, { key: 'advertiser_name', label: 'Advertiser' }, { key: 'weight', label: 'Weight' }, { key: 'status', label: 'Status' }]
async function save() {
  await useApiFetch('/api/ads', { method: 'POST', body: form })
  Object.assign(form, { name: '', property_id: '', advertiser_id: '', campaign_id: '', destination_url: '', alt_text: '', weight: 1, status: 'draft' })
  await refresh()
}
</script>
