<template>
  <header class="sticky top-0 z-30 flex items-center gap-4 h-16 bg-white border-b border-gray-200 px-6">
    <!-- Mobile menu toggle -->
    <button
      class="lg:hidden text-gray-500 hover:text-gray-700"
      @click="$emit('toggle-sidebar')"
    >
      <i class="fas fa-bars text-lg"></i>
    </button>

    <!-- Page title -->
    <h1 class="font-semibold text-gray-800 text-lg flex-1">{{ title }}</h1>

    <!-- Right slot -->
    <slot />
  </header>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
defineEmits<{ 'toggle-sidebar': [] }>()
</script>
