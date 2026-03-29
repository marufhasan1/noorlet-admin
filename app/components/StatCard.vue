<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-5">
    <div class="flex items-center gap-3 mb-3">
      <div :class="['w-9 h-9 rounded-xl flex items-center justify-center text-sm', iconBg]">
        <i :class="icon"></i>
      </div>
    </div>
    <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
    <p class="text-xs text-gray-400 mt-0.5">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ icon: string; label: string; value: string | number; color: string }>()

const iconBg = computed(() => ({
  blue:   'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  amber:  'bg-amber-100 text-amber-600',
  green:  'bg-green-100 text-green-600',
  red:    'bg-red-100 text-red-600',
}[props.color] ?? 'bg-gray-100 text-gray-600'))
</script>
