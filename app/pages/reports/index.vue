<template>
  <div class="page">
    <div class="page-header">
      <div><div class="eyebrow">Reporting</div><h1>Reports</h1><p>Filter by date range and export daily aggregate rows.</p></div>
      <a :href="`/api/reports/export.csv?start=${start}&end=${end}`"><AppButton variant="secondary">Export CSV</AppButton></a>
    </div>
    <AppCard>
      <div class="form-grid">
        <AppDateInput v-model="start" label="Start" />
        <AppDateInput v-model="end" label="End" />
      </div>
      <div class="actions"><AppButton @click="refresh">Refresh</AppButton></div>
    </AppCard>
    <div class="stats">
      <AppStatCard label="Impressions" :value="report?.impressions || 0" />
      <AppStatCard label="Clicks" :value="report?.clicks || 0" />
      <AppStatCard label="CTR" :value="`${(Number(report?.ctr || 0) * 100).toFixed(2)}%`" />
    </div>
  </div>
</template>

<script setup lang="ts">
const start = ref('')
const end = ref('')
const { data, refresh } = await useFetch<any>(() => `/api/reports/overview?start=${start.value}&end=${end.value}`)
const report = computed(() => data.value?.data?.report)
</script>

<style scoped>
.stats { display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
</style>
