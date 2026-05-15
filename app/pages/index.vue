<template>
  <div class="page">
    <div class="page-header">
      <div>
        <div class="eyebrow">Overview</div>
        <h1>Dashboard</h1>
        <p>Current ad serving health and reporting totals.</p>
      </div>
      <NuxtLink to="/reports/export.csv"><AppButton variant="secondary">Export CSV</AppButton></NuxtLink>
    </div>
    <div class="stats">
      <AppStatCard label="Impressions" :value="report?.impressions || 0" />
      <AppStatCard label="Clicks" :value="report?.clicks || 0" />
      <AppStatCard label="CTR" :value="formatCtr(report?.ctr)" />
      <AppStatCard label="Active ads" :value="report?.active_ads || 0" />
      <AppStatCard label="Active campaigns" :value="report?.active_campaigns || 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch<any>('/api/reports/overview')
const report = computed(() => data.value?.data?.report)
function formatCtr(value: any) {
  return `${(Number(value || 0) * 100).toFixed(2)}%`
}
</script>

<style scoped>
.stats { display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
</style>
