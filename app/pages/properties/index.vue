<template>
  <div class="page">
    <div class="page-header">
      <div><div class="eyebrow">Inventory</div><h1>Properties</h1><p>Websites where ads can run.</p></div>
      <AppButton @click="save">Create property</AppButton>
    </div>
    <AppCard>
      <div class="form-grid">
        <AppInput v-model="form.name" label="Name" />
        <AppInput v-model="form.slug" label="Slug" />
        <AppInput v-model="form.primary_domain" label="Primary domain" />
        <AppInput v-model="allowedDomains" label="Allowed domains" placeholder="example.com, news.example.com" />
        <AppInput v-model="form.utm_source" label="UTM source" />
        <AppInput v-model="form.utm_medium" label="UTM medium" />
        <AppInput v-model="form.utm_campaign" label="UTM campaign" />
        <AppSelect v-model="form.status" label="Status" :options="statuses" />
      </div>
    </AppCard>
    <AppTable :columns="columns" :rows="properties">
      <template #name="{ row }"><NuxtLink :to="`/properties/${row.id}`"><strong>{{ row.name }}</strong></NuxtLink></template>
      <template #status="{ row }"><AppBadge :label="row.status" :tone="row.status === 'active' ? 'success' : 'warning'" /></template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
const statuses = [{ label: 'Active', value: 'active' }, { label: 'Paused', value: 'paused' }]
const columns = [{ key: 'name', label: 'Name' }, { key: 'slug', label: 'Slug' }, { key: 'primary_domain', label: 'Domain' }, { key: 'status', label: 'Status' }]
const form = reactive<any>({ name: '', slug: '', primary_domain: '', status: 'active' })
const allowedDomains = ref('')
const { data, refresh } = await useFetch<any>('/api/properties')
const properties = computed(() => data.value?.data?.properties || [])
async function save() {
  await useApiFetch('/api/properties', { method: 'POST', body: { ...form, allowed_domains: allowedDomains.value.split(',').map((v) => v.trim()).filter(Boolean) } })
  Object.assign(form, { name: '', slug: '', primary_domain: '', status: 'active' })
  allowedDomains.value = ''
  await refresh()
}
</script>
