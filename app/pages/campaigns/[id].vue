<template><div class="page"><div class="page-header"><div><div class="eyebrow">Campaign</div><h1>{{ campaign?.name || 'Campaign' }}</h1></div></div><AppCard><pre>{{ campaign }}</pre></AppCard></div></template>
<script setup lang="ts">
const route = useRoute()
const { data } = await useFetch<any>(`/api/campaigns/${route.params.id}`)
const campaign = computed(() => data.value?.data?.campaign)
</script>
