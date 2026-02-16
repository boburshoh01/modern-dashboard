<script setup lang="ts">
import {
  BellOutlined,
  BulbOutlined,
  DownOutlined,
  HistoryOutlined,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons-vue"
import { useAuthStore } from "~/stores/auth"

defineProps<{
  searchQuery: string
}>()

const emit = defineEmits<{
  (e: "toggle-sidebar" | "toggle-theme" | "logout"): void
  (e: "update:searchQuery", value: string): void
}>()

const authStore = useAuthStore()
const { locale } = useI18n()
const { setLocale } = useI18n()

const availableLocales = [
  { code: "en", name: "English", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "uz", name: "O'zbek", flag: "https://flagcdn.com/w40/uz.png" },
  { code: "ru", name: "Русский", flag: "https://flagcdn.com/w40/ru.png" },
]

const currentLocale = computed(
  () =>
    availableLocales.find(l => l.code === locale.value) || availableLocales[0],
)

function setLocaleCode(code: string) {
  setLocale(code as "en" | "uz" | "ru")
}
</script>

<template>
  <header
    class="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border sticky top-0 z-40 transition-colors duration-300"
  >
    <div
      class="px-4 sm:px-6 py-4 flex items-center justify-between gap-4"
    >
      <div class="flex items-center gap-4 flex-1">
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-main transition-colors shrink-0"
          @click="emit('toggle-sidebar')"
        >
          <MenuOutlined class="text-xl dark:text-white" />
        </button>

        <div class="flex-1 max-w-[380px] hidden sm:block">
          <a-input
            :value="searchQuery"
            :placeholder="$t('header.search')"
            class="search-input rounded-full h-[38px]"
            :bordered="false"
            @update:value="emit('update:searchQuery', $event)"
          >
            <template #prefix>
              <SearchOutlined class="text-gray-400" />
            </template>
          </a-input>
        </div>
      </div>

      <div class="flex items-center gap-4 sm:gap-6">
        <a-button
          type="text"
          shape="circle"
          size="large"
          class="flex items-center justify-center transition-colors"
          @click="emit('toggle-theme')"
        >
          <template #icon>
            <BulbOutlined
              class="text-xl text-gray-900 dark:text-white opacity-70"
            />
          </template>
        </a-button>

        <a-badge :count="6" :offset="[-5, 5]" color="#f93c65">
          <a-button
            type="text"
            shape="circle"
            size="large"
            class="flex items-center justify-center transition-colors"
          >
            <template #icon>
              <BellOutlined
                class="text-xl text-gray-900 dark:text-white opacity-70"
              />
            </template>
          </a-button>
        </a-badge>

        <!-- Language Switcher -->
        <a-dropdown :trigger="['click']">
          <a-button
            type="text"
            class="hidden sm:flex items-center gap-2 px-2 transition-colors"
          >
            <img
              :src="currentLocale.flag"
              :alt="currentLocale.name"
              class="w-6 h-auto rounded-sm"
            />
            <span
              class="font-semibold text-gray-500 dark:text-dark-text-secondary"
            >{{ currentLocale.name }}</span>
            <DownOutlined
              class="text-[10px] text-gray-500 dark:text-dark-text-secondary"
            />
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item
                v-for="loc in availableLocales"
                :key="loc.code"
                @click="setLocaleCode(loc.code)"
              >
                <div class="flex items-center gap-2">
                  <img
              :src="loc.flag"
              class="w-5 h-auto rounded-sm"
            >
                  <span>{{ loc.name }}</span>
                </div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <!-- User Dropdown -->
        <a-dropdown :trigger="['click']">
          <div class="flex items-center gap-3 cursor-pointer group">
            <a-avatar
              :src="
                authStore.user?.image
                  || 'https://i.pravatar.cc/150?img=32'
              "
              :size="44"
              class="border-2 border-white dark:border-dark-border shadow-sm transition-colors group-hover:border-primary-500"
            >
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
            <div class="hidden md:block text-left">
              <p
                class="text-sm font-bold text-gray-700 dark:text-white leading-tight"
              >
                {{ authStore.user?.firstName || "Moni" }}
                {{ authStore.user?.lastName || "Roy" }}
              </p>
              <p
                class="text-xs font-semibold text-gray-500 dark:text-dark-text-secondary"
              >
                {{ $t("header.admin") }}
              </p>
            </div>
            <div
              class="hidden md:flex w-5 h-5 items-center justify-center rounded-full border border-gray-300 dark:border-dark-border transition-colors group-hover:border-primary-500"
            >
              <DownOutlined
                class="text-[10px] text-gray-500 dark:text-dark-text-secondary group-hover:text-primary-500"
              />
            </div>
          </div>
          <template #overlay>
            <a-menu
              class="min-w-[200px] p-2 rounded-xl shadow-xl dark:bg-dark-card border-none"
            >
              <div
                class="px-4 py-3 mb-2 border-b border-gray-100 dark:border-dark-border lg:hidden"
              >
                <p class="text-sm font-bold dark:text-white">
                  {{ authStore.user?.firstName }}
                  {{ authStore.user?.lastName }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ $t("header.admin") }}
                </p>
              </div>
              <a-menu-item
                key="manage"
                class="rounded-lg py-2 hover:bg-blue-50 dark:hover:bg-dark-main"
              >
                <template #icon>
                  <UserOutlined class="text-blue-500" />
                </template>
                <span
                  class="font-semibold text-gray-700 dark:text-gray-200"
                >{{ $t("header.manageAccount") }}</span>
              </a-menu-item>
              <a-menu-item
                key="password"
                class="rounded-lg py-2 hover:bg-blue-50 dark:hover:bg-dark-main"
              >
                <template #icon>
                  <SettingOutlined class="text-purple-500" />
                </template>
                <span
                  class="font-semibold text-gray-700 dark:text-gray-200"
                >{{ $t("header.changePassword") }}</span>
              </a-menu-item>
              <a-menu-item
                key="activity"
                class="rounded-lg py-2 hover:bg-blue-50 dark:hover:bg-dark-main"
              >
                <template #icon>
                  <HistoryOutlined class="text-cyan-500" />
                </template>
                <span
                  class="font-semibold text-gray-700 dark:text-gray-200"
                >{{ $t("header.activityLog") }}</span>
              </a-menu-item>
              <a-menu-divider
                class="my-2 border-gray-100 dark:border-dark-border"
              />
              <a-menu-item
                key="logout"
                class="rounded-lg py-2 hover:bg-red-50 dark:hover:bg-dark-main"
                @click="emit('logout')"
              >
                <template #icon>
                  <LogoutOutlined class="text-red-500" />
                </template>
                <span class="font-semibold text-red-500">{{ $t("sidebar.logout") }}</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </header>
</template>
