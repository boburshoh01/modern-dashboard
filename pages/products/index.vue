<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <h1
        class="text-3xl font-bold text-[#202224] dark:text-white tracking-tight font-['Nunito_Sans']"
      >
        {{ $t("products.title") }}
      </h1>
      <NuxtLink to="/products/add">
        <a-button
          type="primary"
          size="large"
          class="bg-[#4880ff] h-11 px-6 rounded-lg font-semibold flex items-center gap-2 shadow-sm border-none"
        >
          <PlusOutlined /> {{ $t("products.addProduct") }}
        </a-button>
      </NuxtLink>
    </div>

    <div
      class="relative bg-[#4880FF] rounded-2xl overflow-hidden min-h-[300px] flex items-center shadow-lg"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-[#4880FF] to-[#6C9AFF]"
      />

      <div class="relative z-10 px-12 py-10 w-full max-w-2xl text-white">
        <p class="text-sm font-medium opacity-90 mb-2">
          {{ $t("products.heroDate") }}
        </p>
        <h2
          class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
          v-html="$t('products.heroTitle')"
        />
        <p class="text-lg opacity-80 mb-8 font-light">
          {{ $t("products.heroSubtitle") }}
        </p>
        <a-button
          size="large"
          class="bg-[#FF8743] hover:bg-[#FF9F6A] text-white border-none h-12 px-8 rounded-xl font-bold text-base shadow-md"
        >
          {{ $t("products.getStarted") }}
        </a-button>
      </div>

      <div
        class="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"
      />
      <div
        class="absolute bottom-0 right-[20%] w-64 h-64 bg-white opacity-5 rounded-full blur-2xl"
      />

      <button
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
      >
        <LeftOutlined class="text-xl" />
      </button>
      <button
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
      >
        <RightOutlined class="text-xl" />
      </button>
    </div>

    <div class="flex justify-end gap-3">
      <a-input
        v-model:value="searchQuery"
        :placeholder="$t('products.search')"
        class="search-input rounded-full w-full sm:w-64 h-[38px] hidden sm:block"
        :bordered="false"
        @press-enter="handleSearch"
      >
        <template #prefix><SearchOutlined class="text-gray-400" /></template>
      </a-input>
      <a-select
        v-model:value="selectedCategory"
        :placeholder="$t('products.category')"
        size="large"
        :bordered="false"
        allow-clear
        class="w-40 rounded-full bg-[#f5f6fa] dark:bg-dark-card"
        @change="handleFilter"
      >
        <a-select-option
          v-for="cat in productsStore.categories"
          :key="cat.slug || cat"
          :value="cat.slug || cat"
        >
          {{ cat.name || cat }}
        </a-select-option>
      </a-select>
    </div>

    <div v-if="productsStore.loading" class="flex justify-center py-20">
      <a-spin size="large" />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in productsStore.products"
        :key="product.id"
        class="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col group border border-transparent dark:border-dark-border/50"
      >
        <div
          class="relative h-64 bg-[#F9F9F9] dark:bg-white rounded-xl flex items-center justify-center mb-5 overflow-hidden group/image"
        >
          <img
            :src="product.thumbnail"
            :alt="product.title"
            class="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover/image:scale-110"
          />

          <button
            class="absolute left-3 w-9 h-9 rounded-full bg-[#FAFAFA] dark:bg-dark-main/80 hover:bg-white dark:hover:bg-dark-main flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white shadow-sm opacity-0 group-hover/image:opacity-100 transition-opacity"
          >
            <LeftOutlined class="text-xs" />
          </button>
          <button
            class="absolute right-3 w-9 h-9 rounded-full bg-[#FAFAFA] dark:bg-dark-main/80 hover:bg-white dark:hover:bg-dark-main flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white shadow-sm opacity-0 group-hover/image:opacity-100 transition-opacity"
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
              class="text-gray-400 dark:text-dark-text-secondary bg-[#F5F6FA] dark:bg-dark-main/50 p-2 rounded-full hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all h-[44px] w-[44px] flex items-center justify-center shrink-0 border border-transparent dark:border-dark-border/30 mt-1"
            >
              <HeartOutlined class="text-xl" />
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

    <div class="flex justify-center mt-8 pb-8">
      <a-pagination
        v-model:current="currentPage"
        :total="productsStore.total"
        :default-page-size="10"
        :show-size-changer="false"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusOutlined,
  SearchOutlined,
  LeftOutlined,
  RightOutlined,
  HeartOutlined,
  StarFilled,
} from "@ant-design/icons-vue";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const productsStore = useProductsStore();
const searchQuery = ref("");
const selectedCategory = ref<string | undefined>(undefined);
const currentPage = ref(1);

const fetchProducts = async () => {
  const skip = (currentPage.value - 1) * 10;
  await productsStore.fetchProducts({
    limit: 10,
    skip,
    q: searchQuery.value,
    category: selectedCategory.value,
  });
};

await Promise.all([fetchProducts(), productsStore.fetchCategories()]);

const handleSearch = () => {
  currentPage.value = 1;
  fetchProducts();
};

const handleFilter = () => {
  currentPage.value = 1;
  fetchProducts();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchProducts();
};

watch(selectedCategory, () => {
  handleFilter();
});
</script>

<style scoped>
:deep(.ant-input-search-button) {
  border-radius: 999px;
}
</style>
