<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
    :class="isActive
      ? 'bg-brand-700 text-white'
      : 'text-gray-400 hover:text-white hover:bg-gray-800'"
  >
    <i :class="[icon, 'w-4 text-center text-sm']"></i>
    {{ label }}
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{ to: string; icon: string; label: string }>()
const route = useRoute()
const isActive = computed(() => route.path === props.to || route.path.startsWith(props.to + '/'))
</script>
