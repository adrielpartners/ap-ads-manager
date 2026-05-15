<template>
  <div class="page">
    <div class="page-header"><div><div class="eyebrow">Ad</div><h1>{{ ad?.name || 'Ad' }}</h1><p>{{ ad?.destination_url }}</p></div></div>
    <AppCard>
      <div class="form-grid">
        <AppFileUpload label="Upload creative" @select="selected = $event" />
        <AppSelect v-model="placementId" label="Assign placement" :options="placementOptions" />
      </div>
      <div class="actions">
        <AppButton @click="upload">Upload image</AppButton>
        <AppButton variant="secondary" @click="assign">Assign placement</AppButton>
      </div>
      <img v-if="ad?.image_url" class="preview" :src="ad.image_url" :alt="ad.alt_text || ad.name">
    </AppCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const selected = ref<File | null>(null)
const placementId = ref('')
const [{ data, refresh }, { data: placementsData }] = await Promise.all([useFetch<any>(`/api/ads/${route.params.id}`), useFetch<any>('/api/placements')])
const ad = computed(() => data.value?.data?.ad)
const placementOptions = computed(() => [{ label: 'Select placement', value: '' }, ...(placementsData.value?.data?.placements || []).map((p: any) => ({ label: `${p.property_name} / ${p.name}`, value: p.id }))])
async function upload() {
  if (!selected.value) return
  const body = new FormData()
  body.append('image', selected.value)
  await useApiFetch(`/api/ads/${route.params.id}/upload-image`, { method: 'POST', body })
  await refresh()
}
async function assign() {
  if (!placementId.value) return
  await useApiFetch(`/api/ads/${route.params.id}/placements`, { method: 'POST', body: { placement_ids: [placementId.value] } })
}
</script>

<style scoped>
.preview { margin-top: 20px; max-width: 100%; border: 1px solid var(--color-border); border-radius: var(--radius-md); }
</style>
