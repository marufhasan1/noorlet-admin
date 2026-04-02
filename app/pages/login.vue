<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background ambient blobs -->
    <div class="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-brand-700/10 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-80px] left-[-60px] w-64 h-64 rounded-full bg-indigo-700/10 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-80px] right-[-60px] w-64 h-64 rounded-full bg-purple-700/10 blur-3xl pointer-events-none"></div>

    <div class="relative w-full max-w-md">
      <!-- Logo block -->
      <div class="text-center mb-8">
        <!-- Glowing logo -->
        <div class="relative inline-flex items-center justify-center mb-5">
          <!-- Ambient glow blob behind the logo -->
          <div class="absolute w-32 h-32 rounded-full bg-brand-600/25 blur-2xl"></div>
          <img
            src="/login_logo.png"
            alt="NoorLet"
            class="relative w-24 h-24 object-contain rounded-2xl"
            style="
              filter: drop-shadow(0 0 16px rgba(124,58,237,0.8)) drop-shadow(0 0 6px rgba(167,139,250,0.6));
              box-shadow: 0 0 0 1px rgba(124,58,237,0.3), 0 8px 32px rgba(124,58,237,0.25);
            "
          />
        </div>

        <h1 class="text-2xl font-bold text-white tracking-tight mb-1">NoorLet</h1>
        <div class="inline-flex items-center gap-1.5 bg-brand-600/15 border border-brand-500/25 text-brand-400 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-2">
          <i class="fas fa-shield-alt text-[10px]"></i> Admin Panel
        </div>
        <p class="text-gray-500 text-sm">Sign in to manage your store</p>
      </div>

      <!-- Card -->
      <div class="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/80 shadow-2xl">
        <div v-if="errorMsg" class="mb-5 flex items-center gap-2 text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-xl px-4 py-3">
          <i class="fas fa-exclamation-circle"></i> {{ errorMsg }}
        </div>

        <form @submit.prevent="submit" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="admin@example.com"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <input
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <span v-if="loading"><i class="fas fa-circle-notch fa-spin mr-2"></i>Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

definePageMeta({ layout: false });
useHead({ title: "Admin Login — NoorLet" });

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref(
  route.query.error === "forbidden"
    ? "Access denied. Admin credentials required."
    : ""
);

async function submit() {
  errorMsg.value = "";
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    router.push("/dashboard");
  } catch (e: any) {
    errorMsg.value = e?.data?.message ?? "Invalid credentials.";
  } finally {
    loading.value = false;
  }
}
</script>
