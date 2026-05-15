<template>
  <div class="page">
    <div class="page-header"><div><div class="eyebrow">Inventory</div><h1>Placements</h1><p>Ad slots across all properties.</p></div></div>
    <AppTable :columns="columns" :rows="placements">
      <template #property_name="{ row }"><strong>{{ row.property_name }}</strong></template>
      <template #status="{ row }"><AppBadge :label="row.status" :tone="row.status === 'active' ? 'success' : 'warning'" /></template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
const columns = [{ key: 'property_name', label: 'Property' }, { key: 'name', label: 'Name' }, { key: 'slug', label: 'Slug' }, { key: 'width', label: 'W' }, { key: 'height', label: 'H' }, { key: 'status', label: 'Status' }]
const { data } = await useFetch<any>('/api/placements')
const placements = computed(() => data.value?.data?.placements || [])
</script>
