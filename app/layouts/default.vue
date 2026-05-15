<template>
  <div class="shell">
    <aside class="sidebar">
      <NuxtLink class="brand" to="/">AP Ads</NuxtLink>
      <nav>
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
      </nav>
    </aside>
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/properties', label: 'Properties' },
  { to: '/advertisers', label: 'Advertisers' },
  { to: '/placements', label: 'Placements' },
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/ads', label: 'Ads' },
  { to: '/reports', label: 'Reports' }
]
</script>

<style scoped>
.shell { min-height: 100vh; display: grid; grid-template-columns: 240px 1fr; }
.sidebar { background: #111827; color: #f9fafb; padding: 24px 18px; display: flex; flex-direction: column; gap: 28px; }
.brand { font-size: 22px; font-weight: 800; }
nav { display: grid; gap: 6px; }
nav a { color: #d1d5db; padding: 10px 12px; border-radius: var(--radius-sm); font-weight: 600; }
nav a.router-link-active { background: rgba(255,255,255,.12); color: #fff; }
.main { padding: 32px; max-width: 1280px; width: 100%; }
@media (max-width: 760px) {
  .shell { grid-template-columns: 1fr; }
  .sidebar { position: static; padding: 16px; }
  nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .main { padding: 20px; }
}
</style>
