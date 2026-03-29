<template>
  <div class="min-h-screen bg-gray-50 lg:pl-64">
    <!-- Sidebar -->
    <AdminSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Sidebar overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Main -->
    <div class="flex flex-col min-h-screen">
      <AdminHeader :title="title" @toggle-sidebar="sidebarOpen = !sidebarOpen">
        <slot name="header-actions" />
      </AdminHeader>

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
const sidebarOpen = ref(false)
</script>
