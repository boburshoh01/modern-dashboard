<template>
  <a-config-provider
    :theme="{
      algorithm: activeThemeAlgorithm,
      token: { fontFamily: 'Nunito Sans', colorPrimary: '#4880ff' },
    }"
  >
    <div
      class="min-h-screen bg-[#f5f6fa] dark:bg-dark-main flex relative transition-colors duration-300"
    >
      <div
        v-if="sidebarOpen && windowWidth < 1024"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] lg:hidden transition-opacity"
        @click="sidebarOpen = false"
      />

      <aside
        :class="[
          'bg-white dark:bg-dark-card fixed left-0 top-0 h-full z-50 border-r border-gray-200 dark:border-dark-border overflow-y-auto transition-all duration-300',
          sidebarOpen ? (isMiniSidebar ? 'w-20' : 'w-64') : '-translate-x-full',
          !sidebarOpen && 'lg:translate-x-0',
        ]"
      >
        <div
          :class="[
            'p-6 border-b border-gray-200 dark:border-dark-border flex items-center justify-between',
            isMiniSidebar ? 'justify-center' : '',
          ]"
        >
          <div class="flex items-center">
            <h1
              v-if="!isMiniSidebar"
              class="text-xl font-extrabold flex items-center gap-2"
            >
              <span class="text-[#4880ff] text-2xl">Dash</span>
              <span class="text-[#202224] dark:text-white text-2xl">Stack</span>
            </h1>
            <span v-else class="text-[#4880ff] text-2xl font-extrabold">D</span>
          </div>

          <button
            v-if="windowWidth < 1024"
            class="p-2 -mr-2 text-gray-400 hover:text-[#4880ff] transition-colors"
            @click="sidebarOpen = false"
          >
            <CloseOutlined class="text-xl" />
          </button>
        </div>

        <nav
          :class="[
            'p-4 space-y-1 flex flex-col h-[calc(100%-97px)]',
            isMiniSidebar ? 'px-2' : 'p-4',
          ]"
        >
          <div class="flex-1">
            <NuxtLink
              to="/dashboard"
              class="flex items-center gap-3 py-3 rounded-lg font-semibold text-sm transition-colors"
              active-class="bg-[#4880ff] text-white"
              :class="[
                isMiniSidebar ? 'justify-center px-0' : 'px-4',
                $route.path === '/dashboard'
                  ? ''
                  : 'text-[#202224] dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-main',
              ]"
            >
              <AppstoreOutlined class="text-lg" />
              <span v-if="!isMiniSidebar">{{ $t("sidebar.dashboard") }}</span>
            </NuxtLink>

            <div class="pt-4">
              <div
                v-if="!isMiniSidebar"
                class="px-4 py-2 text-xs font-bold text-[#202224] dark:text-dark-text-secondary opacity-60 tracking-wider uppercase"
              >
                {{ $t("sidebar.main") }}
              </div>

              <NuxtLink
                to="/products"
                class="flex items-center gap-3 py-3 rounded-lg text-[#202224] dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-main font-semibold text-sm"
                active-class="bg-[#4880ff] text-white"
                :class="[
                  isMiniSidebar ? 'justify-center px-0' : 'px-4',
                  $route.path.startsWith('/products')
                    ? 'bg-[#4880ff] text-white'
                    : '',
                ]"
              >
                <DropboxOutlined class="text-lg" />
                <span v-if="!isMiniSidebar">{{ $t("sidebar.products") }}</span>
              </NuxtLink>

              <NuxtLink
                to="/favorites"
                class="flex items-center gap-3 py-3 rounded-lg text-[#202224] dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-main font-semibold text-sm"
                active-class="bg-[#4880ff] text-white"
                :class="[isMiniSidebar ? 'justify-center px-0' : 'px-4']"
              >
                <HeartOutlined class="text-lg" />
                <span v-if="!isMiniSidebar">{{ $t("sidebar.favorites") }}</span>
              </NuxtLink>

              <NuxtLink
                to="/users"
                class="flex items-center gap-3 py-3 rounded-lg text-[#202224] dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-main font-semibold text-sm"
                active-class="bg-[#4880ff] text-white"
                :class="[
                  isMiniSidebar ? 'justify-center px-0' : 'px-4',
                  $route.path.startsWith('/users')
                    ? 'bg-[#4880ff] text-white'
                    : '',
                ]"
              >
                <UsergroupAddOutlined class="text-lg" />
                <span v-if="!isMiniSidebar">{{ $t("sidebar.users") }}</span>
              </NuxtLink>
            </div>
          </div>

          <div
            class="pt-4 border-t border-gray-200 dark:border-dark-border mt-auto"
          >
            <button
              class="w-full flex items-center gap-3 py-3 rounded-lg text-[#202224] dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-main font-semibold text-sm cursor-pointer transition-colors"
              :class="[isMiniSidebar ? 'justify-center px-0' : 'px-4']"
              @click="handleLogout"
            >
              <LogoutOutlined class="text-lg" />
              <span v-if="!isMiniSidebar">{{ $t("sidebar.logout") }}</span>
            </button>
          </div>
        </nav>
      </aside>

      <div
        class="flex-1 flex flex-col min-h-screen transition-all duration-300 min-w-0"
        :class="[
          sidebarOpen ? (isMiniSidebar ? 'lg:ml-20' : 'lg:ml-64') : '',
          !sidebarOpen && 'lg:ml-0',
        ]"
      >
        <header
          class="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border sticky top-0 z-40 transition-colors duration-300"
        >
          <div
            class="px-4 sm:px-6 py-4 flex items-center justify-between gap-4"
          >
            <div class="flex items-center gap-4 flex-1">
              <button
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-main transition-colors shrink-0"
                @click="toggleSidebar"
              >
                <MenuOutlined class="text-xl dark:text-white" />
              </button>

              <div class="flex-1 max-w-[380px] hidden sm:block">
                <a-input
                  v-model:value="searchQuery"
                  placeholder="Search"
                  class="search-input rounded-full h-[38px]"
                  :bordered="false"
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
                @click="toggleTheme"
              >
                <template #icon>
                  <BulbOutlined
                    class="text-xl text-[#202224] dark:text-white opacity-70"
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
                      class="text-xl text-[#202224] dark:text-white opacity-70"
                    />
                  </template>
                </a-button>
              </a-badge>

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
                    class="font-semibold text-[#646464] dark:text-dark-text-secondary"
                    >{{ currentLocale.name }}</span
                  >
                  <DownOutlined
                    class="text-[10px] text-[#646464] dark:text-dark-text-secondary"
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
                        <img :src="loc.flag" class="w-5 h-auto rounded-sm" />
                        <span>{{ loc.name }}</span>
                      </div>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>

              <a-dropdown :trigger="['click']">
                <div class="flex items-center gap-3 cursor-pointer group">
                  <a-avatar
                    :src="
                      authStore.user?.image ||
                      'https://i.pravatar.cc/150?img=32'
                    "
                    :size="44"
                    class="border-2 border-white dark:border-dark-border shadow-sm transition-colors group-hover:border-[#4880ff]"
                  >
                    <template #icon><UserOutlined /></template>
                  </a-avatar>
                  <div class="hidden md:block text-left">
                    <p
                      class="text-sm font-bold text-[#404040] dark:text-white leading-tight"
                    >
                      {{ authStore.user?.firstName || "Moni" }}
                      {{ authStore.user?.lastName || "Roy" }}
                    </p>
                    <p
                      class="text-xs font-semibold text-[#565656] dark:text-dark-text-secondary"
                    >
                      Admin
                    </p>
                  </div>
                  <div
                    class="hidden md:flex w-5 h-5 items-center justify-center rounded-full border border-gray-300 dark:border-dark-border transition-colors group-hover:border-[#4880ff]"
                  >
                    <DownOutlined
                      class="text-[10px] text-[#565656] dark:text-dark-text-secondary group-hover:text-[#4880ff]"
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
                      <p class="text-xs text-gray-500">Admin</p>
                    </div>
                    <a-menu-item
                      key="manage"
                      class="rounded-lg py-2 hover:bg-blue-50 dark:hover:bg-dark-main"
                    >
                      <template #icon
                        ><UserOutlined class="text-blue-500"
                      /></template>
                      <span
                        class="font-semibold text-gray-700 dark:text-gray-200"
                        >Manage Account</span
                      >
                    </a-menu-item>
                    <a-menu-item
                      key="password"
                      class="rounded-lg py-2 hover:bg-blue-50 dark:hover:bg-dark-main"
                    >
                      <template #icon
                        ><SettingOutlined class="text-purple-500"
                      /></template>
                      <span
                        class="font-semibold text-gray-700 dark:text-gray-200"
                        >Change Password</span
                      >
                    </a-menu-item>
                    <a-menu-item
                      key="activity"
                      class="rounded-lg py-2 hover:bg-blue-50 dark:hover:bg-dark-main"
                    >
                      <template #icon
                        ><HistoryOutlined class="text-cyan-500"
                      /></template>
                      <span
                        class="font-semibold text-gray-700 dark:text-gray-200"
                        >Activity Log</span
                      >
                    </a-menu-item>
                    <a-menu-divider
                      class="my-2 border-gray-100 dark:border-dark-border"
                    />
                    <a-menu-item
                      key="logout"
                      class="rounded-lg py-2 hover:bg-red-50 dark:hover:bg-dark-main"
                      @click="handleLogout"
                    >
                      <template #icon
                        ><LogoutOutlined class="text-red-500"
                      /></template>
                      <span class="font-semibold text-red-500">Log out</span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </header>

        <main
          class="flex-1 p-4 sm:p-6 lg:p-8 bg-[#f5f6fa] dark:bg-dark-main transition-colors duration-300"
        >
          <div class="mb-6">
            <AppBreadcrumbs />
          </div>
          <slot />
        </main>
      </div>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import {
  MenuOutlined,
  CloseOutlined,
  SearchOutlined,
  BellOutlined,
  DownOutlined,
  UserOutlined,
  AppstoreOutlined,
  DropboxOutlined,
  HeartOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
  LogoutOutlined,
  BulbOutlined,
  HistoryOutlined,
} from "@ant-design/icons-vue";
import { theme } from "ant-design-vue";
import { useAuthStore } from "~/stores/auth";
import { useNotification } from "~/composables/useNotification";

const authStore = useAuthStore();
const { success, error } = useNotification();
const router = useRouter();
const colorMode = useColorMode();
const { locale } = useI18n();

const availableLocales = [
  { code: "en", name: "English", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "uz", name: "O'zbek", flag: "https://flagcdn.com/w40/uz.png" },
  { code: "ru", name: "Русский", flag: "https://flagcdn.com/w40/ru.png" },
];

const currentLocale = computed(
  () =>
    availableLocales.find((l) => l.code === locale.value) || availableLocales[0]
);

const { setLocale } = useI18n();
const setLocaleCode = (code: string) => {
  setLocale(code as "en" | "uz" | "ru");
};

const sidebarOpen = ref(true);
const isMiniSidebar = ref(false);
const searchQuery = ref("");
const windowWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1200
);

const activeThemeAlgorithm = computed(() => {
  return colorMode.value === "dark"
    ? theme.darkAlgorithm
    : theme.defaultAlgorithm;
});

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

const toggleSidebar = () => {
  if (import.meta.client && window.innerWidth >= 1024) {
    isMiniSidebar.value = !isMiniSidebar.value;
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarMini", JSON.stringify(isMiniSidebar.value));
    }
  } else {
    sidebarOpen.value = !sidebarOpen.value;
  }
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    success("Logged Out", "You have been successfully logged out");
    router.push("/login");
  } catch {
    error("Logout Error", "An error occurred during logout");
  }
};

let lastWidth = 0;

const handleResize = () => {
  if (typeof window === "undefined") return;
  windowWidth.value = window.innerWidth;
  const isMobile = windowWidth.value < 1024;

  if (isMobile) {
    sidebarOpen.value = false;
    isMiniSidebar.value = false;
  } else {
    sidebarOpen.value = true;
    const savedMiniState = localStorage.getItem("sidebarMini");
    if (savedMiniState !== null) {
      isMiniSidebar.value = JSON.parse(savedMiniState);
    }
  }
};

onMounted(() => {
  if (typeof window !== "undefined") {
    lastWidth = window.innerWidth;

    const savedMiniState = localStorage.getItem("sidebarMini");
    if (savedMiniState !== null) {
      isMiniSidebar.value = JSON.parse(savedMiniState);
    }

    if (lastWidth < 1024) {
      sidebarOpen.value = false;
    } else {
      sidebarOpen.value = true;
    }
    window.addEventListener("resize", handleResize);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleResize);
  }
});
</script>

<style>
.dark .ant-form-item-label > label {
  color: #ffffff !important;
}

.dark .ant-input,
.dark .ant-input-number,
.dark .ant-select-selector,
.dark .ant-picker {
  background-color: #1b2431 !important;
  border-color: #313d4f !important;
  color: #ffffff !important;
}

.dark .ant-input:focus,
.dark .ant-input-number:focus,
.dark .ant-select-selector:focus,
.dark .ant-picker:focus {
  border-color: #4880ff !important;
}

.dark .ant-divider-inner-text {
  color: #ffffff !important;
}

.dark .ant-divider-horizontal {
  border-block-start-color: #313d4f !important;
}

.search-input.ant-input-affix-wrapper {
  background-color: #f5f6fa !important;
  border: 1px solid #d5d5d5 !important;
  border-radius: 999px !important;
  height: 38px !important;
  transition: all 0.3s ease !important;
  display: flex !important;
  align-items: center !important;
  padding-left: 12px !important;
  padding-right: 12px !important;
}

.dark .search-input.ant-input-affix-wrapper {
  background-color: #323d4e !important;
  border-color: #313d4f !important;
}

.search-input .ant-input,
.header-search.ant-input {
  background-color: transparent !important;
  box-shadow: none !important;
  height: 100% !important;
  padding: 0 8px !important;
}

.dark .search-input .ant-input,
.dark .header-search.ant-input {
  background-color: transparent !important;
  color: #ffffff !important;
}
</style>

<style scoped>
aside {
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 1024px) {
  aside {
    box-shadow: 10px 0 15px -3px rgba(0, 0, 0, 0.1),
      4px 0 6px -2px rgba(0, 0, 0, 0.05);
  }
}

:deep(.ant-input) {
  font-family: "Nunito Sans", sans-serif;
}

:deep(.ant-dropdown-menu) {
  @apply dark:bg-dark-card dark:border-dark-border;
}

:deep(.ant-dropdown-menu-item:hover) {
  @apply dark:bg-dark-main;
}
</style>
