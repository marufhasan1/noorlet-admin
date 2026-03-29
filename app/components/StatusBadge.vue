<template>
  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', cls]">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: string }>()

const map: Record<string, { label: string; cls: string }> = {
  processing: { label: 'Processing', cls: 'bg-blue-100 text-blue-700' },
  confirmed:  { label: 'Confirmed',  cls: 'bg-indigo-100 text-indigo-700' },
  shipped:    { label: 'Shipped',    cls: 'bg-amber-100 text-amber-700' },
  delivered:  { label: 'Delivered',  cls: 'bg-green-100 text-green-700' },
  cancelled:  { label: 'Cancelled',  cls: 'bg-red-100 text-red-700' },
  pending:    { label: 'Pending',    cls: 'bg-gray-100 text-gray-600' },
  approved:   { label: 'Approved',   cls: 'bg-green-100 text-green-700' },
  suspended:  { label: 'Suspended',  cls: 'bg-red-100 text-red-700' },
  seller:     { label: 'Seller',     cls: 'bg-purple-100 text-purple-700' },
  admin:      { label: 'Admin',      cls: 'bg-brand-100 text-brand-700' },
  customer:   { label: 'Customer',   cls: 'bg-gray-100 text-gray-600' },
}

const resolved = computed(() => map[props.status] ?? { label: props.status, cls: 'bg-gray-100 text-gray-600' })
const label = computed(() => resolved.value.label)
const cls = computed(() => resolved.value.cls)
</script>
