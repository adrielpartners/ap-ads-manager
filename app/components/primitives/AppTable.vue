<template>
  <div class="table-wrap">
    <table>
      <thead><tr><th v-for="column in columns" :key="column.key">{{ column.label }}</th></tr></thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id || JSON.stringify(row)">
          <td v-for="column in columns" :key="column.key">
            <slot :name="column.key" :row="row">{{ row[column.key] }}</slot>
          </td>
        </tr>
        <tr v-if="!rows.length"><td :colspan="columns.length" class="empty">No records yet.</td></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{ columns: { key: string; label: string }[]; rows: any[] }>()
</script>

<style scoped>
.table-wrap { overflow: auto; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: #fff; }
table { border-collapse: collapse; width: 100%; min-width: 680px; }
th, td { text-align: left; padding: 13px 14px; border-bottom: 1px solid var(--color-border); vertical-align: middle; }
th { color: var(--color-muted); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
.empty { color: var(--color-muted); text-align: center; padding: 28px; }
</style>
