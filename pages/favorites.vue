<template>
  <div class="space-y-6">
    <h1
      class="text-3xl font-bold text-[#202224] dark:text-white tracking-tight font-['Nunito_Sans'] transition-colors"
    >
      {{ $t("favorites.title") }}
    </h1>

    <div v-if="loading" class="flex justify-center py-20">
      <a-spin size="large" />
    </div>

    <div v-else-if="favorites.length === 0" class="text-center py-12">
      <div
        class="mb-4 bg-gray-50 dark:bg-dark-card w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-300 dark:text-dark-text-secondary"
      >
        <HeartFilled class="text-4xl" />
      </div>
      <h3 class="text-lg font-bold text-gray-600 dark:text-white">
        {{ $t("favorites.emptyTitle") }}
      </h3>
      <p class="text-gray-400 dark:text-dark-text-secondary">
        {{ $t("favorites.emptyText") }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="product in favorites"
        :key="product.id"
        class="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col group border border-transparent dark:border-dark-border/50"
      >
        <div
          class="relative h-64 bg-[#F9F9F9] dark:bg-white rounded-xl flex items-center justify-center mb-5 overflow-hidden group/image"
        >
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="max-h-full max-w-full object-contain mix-blend-multiply"
          />

          <button
            class="absolute left-3 w-9 h-9 rounded-full bg-[#FAFAFA] dark:bg-[#F0F0F0] hover:bg-white flex items-center justify-center text-gray-500 hover:text-gray-800 shadow-sm opacity-0 group-hover/image:opacity-100 transition-opacity"
          >
            <LeftOutlined class="text-xs" />
          </button>
          <button
            class="absolute right-3 w-9 h-9 rounded-full bg-[#FAFAFA] dark:bg-[#F0F0F0] hover:bg-white flex items-center justify-center text-gray-500 hover:text-gray-800 shadow-sm opacity-0 group-hover/image:opacity-100 transition-opacity"
          >
            <RightOutlined class="text-xs" />
          </button>
        </div>

        <div class="flex flex-col flex-1 px-1">
          <div class="flex items-start justify-between mb-4">
            <div class="space-y-1">
              <h3
                class="font-bold text-[#202224] dark:text-white text-lg line-clamp-1 tracking-tight"
              >
                {{ product.title }}
              </h3>
              <p class="text-[#4880FF] font-bold text-base">
                ${{ product.price }}
              </p>
              <div class="flex items-center gap-1 text-[#FFAD33] text-sm">
                <template v-for="n in 5" :key="n">
                  <StarFilled
                    v-if="Math.round(product.rating) >= n"
                    class="text-[#FFAD33]"
                  />
                  <StarFilled
                    v-else
                    class="text-gray-200 dark:text-dark-border"
                  />
                </template>
                <span
                  class="text-gray-400 dark:text-dark-text-secondary font-medium ml-1"
                  >({{ product.stock }})</span
                >
              </div>
            </div>
            <button
              class="text-[#FF4A5C] bg-[#FF4A5C]/10 dark:bg-[#FF4A5C]/20 p-2 rounded-full hover:bg-[#FF4A5C]/20 dark:hover:bg-[#FF4A5C]/30 transition-all h-[44px] w-[44px] flex items-center justify-center shrink-0 shadow-sm shadow-red-500/10 border border-transparent dark:border-red-500/20 mt-1"
              @click="removeFavorite(product.id)"
            >
              <HeartFilled class="text-xl" />
            </button>
          </div>

          <div class="mt-auto">
            <NuxtLink :to="`/products/${product.id}`" class="block">
              <button
                class="w-full h-[38px] bg-[#F5F6FA] dark:bg-[#4B5668] text-[#202224] dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:opacity-90 transition-all text-sm border border-transparent dark:border-[#4B5668] shadow-sm tracking-wide"
              >
                {{ $t("products.editProduct") }}
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-12 pb-8">
      <a-pagination
        v-model:current="currentPage"
        :total="total"
        :default-page-size="9"
        :show-size-changer="false"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HeartFilled,
  LeftOutlined,
  RightOutlined,
  StarFilled,
} from "@ant-design/icons-vue";
import type { Product } from "~/types";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const loading = ref(true);
const favorites = ref<Product[]>([]);
const currentPage = ref(1);
const total = ref(0);
const { get } = useApi();

const fetchFavorites = async () => {
  loading.value = true;
  try {
    const skip = (currentPage.value - 1) * 9;
    const response = await get<any>(`/products?limit=9&skip=${skip + 15}`);
    favorites.value = response.data.products;
    total.value = response.data.total;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchFavorites();
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchFavorites();
};

const removeFavorite = (id: number) => {
  favorites.value = favorites.value.filter((p) => p.id !== id);
};
</script>
