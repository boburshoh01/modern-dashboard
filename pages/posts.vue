<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('nav.posts') }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        {{ $t('common.total') }}: {{ total }} {{ $t('common.items') }}
      </p>
    </div>

    <!-- Posts Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card p-6">
        <a-skeleton active :paragraph="{ rows: 3 }" />
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="post in posts"
        :key="post.id"
        class="card p-6 card-hover cursor-pointer"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {{ post.title }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
          {{ post.body }}
        </p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-4">
          <a-tag v-for="tag in post.tags" :key="tag" color="blue">
            {{ tag }}
          </a-tag>
        </div>

        <!-- Stats -->
        <div class="flex items-center justify-between text-sm text-gray-500">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <LikeOutlined />
              {{ post.reactions?.likes || 0 }}
            </span>
            <span class="flex items-center gap-1">
              <DislikeOutlined />
              {{ post.reactions?.dislikes || 0 }}
            </span>
          </div>
          <span class="flex items-center gap-1">
            <EyeOutlined />
            {{ post.views }}
          </span>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center">
      <a-pagination
        v-model:current="currentPage"
        :total="total"
        :page-size="pageSize"
        show-size-changer
        :page-size-options="['6', '12', '24', '48']"
        @change="handlePageChange"
        @showSizeChange="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { LikeOutlined, DislikeOutlined, EyeOutlined } from '@ant-design/icons-vue'
import type { PostsResponse } from '~/types/api'

definePageMeta({
  middleware: 'auth'
})

const config = useRuntimeConfig()

const posts = ref<{ id: number; title: string; body: string; tags: string[]; reactions: { likes: number; dislikes: number }; views: number }[]>([])
const total = ref(0)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(6)

const fetchPosts = async () => {
  loading.value = true
  try {
    const skip = (currentPage.value - 1) * pageSize.value
    const response = await $fetch<PostsResponse>(
      `${config.public.apiBase}/posts?limit=${pageSize.value}&skip=${skip}`
    )
    posts.value = response.posts
    total.value = response.total
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchPosts()
}

const handlePageSizeChange = (_current: number, size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchPosts()
}

onMounted(() => {
  fetchPosts()
})
</script>
