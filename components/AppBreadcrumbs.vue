<template>
  <nav class="flex text-sm font-semibold mb-4" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <NuxtLink
          to="/dashboard"
          class="inline-flex items-center text-gray-500 hover:text-[#4880ff] dark:text-dark-text-secondary transition-colors"
        >
          <HomeOutlined class="mr-2" />
          {{ $t("sidebar.dashboard") }}
        </NuxtLink>
      </li>
      <li v-for="(crumb, index) in breadcrumbs" :key="index">
        <div class="flex items-center">
          <RightOutlined class="text-gray-400 text-[10px] mx-1" />
          <NuxtLink
            v-if="index < breadcrumbs.length - 1"
            :to="crumb.path"
            class="ml-1 text-gray-500 hover:text-[#4880ff] dark:text-dark-text-secondary md:ml-2 transition-colors capitalize"
          >
            {{ crumb.label }}
          </NuxtLink>
          <span
            v-else
            class="ml-1 text-gray-400 dark:text-dark-text-primary md:ml-2 capitalize cursor-default"
          >
            {{ crumb.label }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { HomeOutlined, RightOutlined } from "@ant-design/icons-vue";

const route = useRoute();
const { t } = useI18n();

const breadcrumbs = computed(() => {
  const pathArray = route.path.split("/").filter((p) => p);
  const crumbs = pathArray.map((path, index) => {
    const fullPath = `/${pathArray.slice(0, index + 1).join("/")}`;

    let label = path;
    if (path === "dashboard") label = t("sidebar.dashboard");
    else if (path === "users") label = t("sidebar.users");
    else if (path === "products") label = t("sidebar.products");
    else if (path === "favorites") label = t("sidebar.favorites");
    else if (path === "add") label = t("common.add", "Add");
    else if (path === "edit") label = t("common.edit", "Edit");

    return {
      label,
      path: fullPath,
    };
  });

  if (pathArray[0] === "dashboard" && pathArray.length === 1) {
    return [];
  }

  return crumbs;
});
</script>
