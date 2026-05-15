<template>
  <div class="page">
    <div class="page-header"><div><div class="eyebrow">Advertiser</div><h1>{{ advertiser?.name || 'Advertiser' }}</h1><p>{{ advertiser?.contact_email }}</p></div></div>
    <AppCard><pre>{{ advertiser }}</pre></AppCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data } = await useFetch<any>(`/api/advertisers/${route.params.id}`)
const advertiser = computed(() => data.value?.data?.advertiser)
</script>
