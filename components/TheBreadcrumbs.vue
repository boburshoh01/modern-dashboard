<template>
  <nav class="flex items-center text-sm" aria-label="Breadcrumb">
    <ol class="flex items-center gap-2">
      <li>
        <NuxtLink
          to="/"
          class="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </NuxtLink>
      </li>

      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
        <li class="flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <NuxtLink
            v-if="index < breadcrumbs.length - 1"
            :to="crumb.path"
            class="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 capitalize"
          >
            {{ $t(crumb.label) || crumb.name }}
          </NuxtLink>
          <span
            v-else
            class="text-gray-900 dark:text-white font-medium capitalize"
          >
            {{ $t(crumb.label) || crumb.name }}
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

interface Breadcrumb {
  name: string
  path: string
  label: string
}

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const paths = route.path.split('/').filter(Boolean)
  const crumbs: Breadcrumb[] = []

  let currentPath = ''

  paths.forEach((segment) => {
    currentPath += `/${segment}`
    const labelKey = `nav.${segment}`

    crumbs.push({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: currentPath,
      label: labelKey
    })
  })

  // Add page title from route meta if exists
  if (route.meta?.title) {
    const lastCrumb = crumbs[crumbs.length - 1]
    if (lastCrumb) {
      lastCrumb.name = route.meta.title as string
    }
  }

  return crumbs
})
</script>
