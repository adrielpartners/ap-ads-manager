<template>
  <div class="page">
    <div class="page-header">
      <div><div class="eyebrow">Property</div><h1>{{ property?.name || 'Property' }}</h1><p>{{ property?.primary_domain }}</p></div>
    </div>
    <AppCard>
      <h2>Placements</h2>
      <div class="form-grid">
        <AppInput v-model="form.name" label="Name" />
        <AppInput v-model="form.slug" label="Slug" />
        <AppInput v-model="form.width" label="Width" type="number" />
        <AppInput v-model="form.height" label="Height" type="number" />
        <AppInput v-model="form.description" label="Description" />
      </div>
      <div class="actions"><AppButton @click="save">Create placement</AppButton></div>
    </AppCard>
    <AppTable :columns="columns" :rows="placements">
      <template #status="{ row }"><AppBadge :label="row.status" :tone="row.status === 'active' ? 'success' : 'warning'" /></template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: propertyData } = await useFetch<any>(`/api/properties/${route.params.id}`)
const { data, refresh } = await useFetch<any>(`/api/properties/${route.params.id}/placements`)
const property = computed(() => propertyData.value?.data?.property)
const placements = computed(() => data.value?.data?.placements || [])
const form = reactive<any>({ name: '', slug: '', width: 728, height: 90, description: '', status: 'active' })
const columns = [{ key: 'name', label: 'Name' }, { key: 'slug', label: 'Slug' }, { key: 'width', label: 'W' }, { key: 'height', label: 'H' }, { key: 'status', label: 'Status' }]
async function save() {
  await useApiFetch(`/api/properties/${route.params.id}/placements`, { method: 'POST', body: form })
  Object.assign(form, { name: '', slug: '', width: 728, height: 90, description: '', status: 'active' })
  await refresh()
}
</script>
