<template>
  <a-drawer
    v-model:open="visible"
    :title="$t('products.productDetails')"
    :width="600"
    placement="right"
  >
    <template v-if="product">
      <!-- Product Images -->
      <div class="mb-6">
        <a-carousel autoplay>
          <div v-for="(image, index) in product.images" :key="index">
            <img
              :src="image"
              :alt="product.title"
              class="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </a-carousel>
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <!-- Title & Category -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ product.title }}
          </h2>
          <a-tag color="blue" class="mt-2">{{ product.category }}</a-tag>
        </div>

        <!-- Price & Rating -->
        <div class="flex items-center justify-between">
          <div>
            <span class="text-2xl font-bold text-primary-500">
              ${{ product.price }}
            </span>
            <span v-if="product.discountPercentage > 0" class="ml-2 text-success-500">
              -{{ product.discountPercentage }}%
            </span>
          </div>
          <div class="flex items-center">
            <a-rate :value="product.rating" disabled allow-half />
            <span class="ml-2 text-gray-500">{{ product.rating }}</span>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t('products.description') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ product.description }}
          </p>
        </div>

        <!-- Details -->
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item :label="$t('products.brand')">
            {{ product.brand || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('products.sku')">
            {{ product.sku }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('products.stock')">
            {{ product.stock }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('products.availability')">
            <a-tag :color="getStatusColor(product.availabilityStatus)">
              {{ product.availabilityStatus }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('products.weight')">
            {{ product.weight }} kg
          </a-descriptions-item>
          <a-descriptions-item :label="$t('products.minOrderQty')">
            {{ product.minimumOrderQuantity }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('products.dimensions')" :span="2">
            {{ product.dimensions?.width }} x {{ product.dimensions?.height }} x {{ product.dimensions?.depth }} cm
          </a-descriptions-item>
          <a-descriptions-item :label="$t('products.warranty')" :span="2">
            {{ product.warrantyInformation }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('products.shipping')" :span="2">
            {{ product.shippingInformation }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('products.returnPolicy')" :span="2">
            {{ product.returnPolicy }}
          </a-descriptions-item>
        </a-descriptions>

        <!-- Tags -->
        <div v-if="product.tags?.length">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t('products.tags') }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <a-tag v-for="tag in product.tags" :key="tag">{{ tag }}</a-tag>
          </div>
        </div>

        <!-- Reviews -->
        <div v-if="product.reviews?.length">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
            Reviews
          </h3>
          <div class="space-y-3">
            <div
              v-for="(review, index) in product.reviews"
              :key="index"
              class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium">{{ review.reviewerName }}</span>
                <a-rate :value="review.rating" disabled :count="5" />
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ review.comment }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

interface Props {
  product?: Product | null
}

defineProps<Props>()

const visible = defineModel<boolean>('open', { default: false })

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'In Stock': 'green',
    'Low Stock': 'orange',
    'Out of Stock': 'red'
  }
  return colors[status] || 'default'
}
</script>
