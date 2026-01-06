<template>
  <a-modal
    v-model:open="visible"
    :title="mode === 'create' ? $t('products.addProduct') : $t('products.editProduct')"
    :width="800"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="formRules"
      layout="vertical"
      class="mt-4"
    >
      <a-row :gutter="16">
        <!-- Title -->
        <a-col :span="12">
          <a-form-item :label="$t('products.productName')" name="title">
            <a-input v-model:value="formState.title" />
          </a-form-item>
        </a-col>

        <!-- Category -->
        <a-col :span="12">
          <a-form-item :label="$t('products.category')" name="category">
            <a-select v-model:value="formState.category">
              <a-select-option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
                {{ cat.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <!-- Description -->
        <a-col :span="24">
          <a-form-item :label="$t('products.description')" name="description">
            <a-textarea v-model:value="formState.description" :rows="3" />
          </a-form-item>
        </a-col>

        <!-- Price -->
        <a-col :span="8">
          <a-form-item :label="$t('products.price')" name="price">
            <a-input-number v-model:value="formState.price" :min="0" :precision="2" prefix="$" style="width: 100%" />
          </a-form-item>
        </a-col>

        <!-- Discount -->
        <a-col :span="8">
          <a-form-item :label="$t('products.discountPercentage')" name="discountPercentage">
            <a-input-number v-model:value="formState.discountPercentage" :min="0" :max="100" suffix="%" style="width: 100%" />
          </a-form-item>
        </a-col>

        <!-- Stock -->
        <a-col :span="8">
          <a-form-item :label="$t('products.stock')" name="stock">
            <a-input-number v-model:value="formState.stock" :min="0" style="width: 100%" />
          </a-form-item>
        </a-col>

        <!-- Rating -->
        <a-col :span="8">
          <a-form-item :label="$t('products.rating')" name="rating">
            <a-rate v-model:value="formState.rating" allow-half />
          </a-form-item>
        </a-col>

        <!-- Availability Status -->
        <a-col :span="8">
          <a-form-item :label="$t('products.availability')" name="availabilityStatus">
            <a-select v-model:value="formState.availabilityStatus">
              <a-select-option value="In Stock">{{ $t('products.inStock') }}</a-select-option>
              <a-select-option value="Low Stock">{{ $t('products.lowStock') }}</a-select-option>
              <a-select-option value="Out of Stock">{{ $t('products.outOfStock') }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <!-- Min Order Qty -->
        <a-col :span="8">
          <a-form-item :label="$t('products.minOrderQty')" name="minimumOrderQuantity">
            <a-input-number v-model:value="formState.minimumOrderQuantity" :min="1" style="width: 100%" />
          </a-form-item>
        </a-col>

        <!-- Brand -->
        <a-col :span="8">
          <a-form-item :label="$t('products.brand')" name="brand">
            <a-input v-model:value="formState.brand" />
          </a-form-item>
        </a-col>

        <!-- SKU -->
        <a-col :span="8">
          <a-form-item :label="$t('products.sku')" name="sku">
            <a-input v-model:value="formState.sku" />
          </a-form-item>
        </a-col>

        <!-- Weight -->
        <a-col :span="8">
          <a-form-item :label="$t('products.weight')" name="weight">
            <a-input-number v-model:value="formState.weight" :min="0" suffix="kg" style="width: 100%" />
          </a-form-item>
        </a-col>

        <!-- Dimensions -->
        <a-col :span="24">
          <a-form-item :label="$t('products.dimensions')">
            <a-row :gutter="8">
              <a-col :span="8">
                <a-input-number v-model:value="formState.dimensions.width" :min="0" :placeholder="$t('products.width')" style="width: 100%" />
              </a-col>
              <a-col :span="8">
                <a-input-number v-model:value="formState.dimensions.height" :min="0" :placeholder="$t('products.height')" style="width: 100%" />
              </a-col>
              <a-col :span="8">
                <a-input-number v-model:value="formState.dimensions.depth" :min="0" :placeholder="$t('products.depth')" style="width: 100%" />
              </a-col>
            </a-row>
          </a-form-item>
        </a-col>

        <!-- Warranty -->
        <a-col :span="12">
          <a-form-item :label="$t('products.warranty')" name="warrantyInformation">
            <a-input v-model:value="formState.warrantyInformation" />
          </a-form-item>
        </a-col>

        <!-- Shipping -->
        <a-col :span="12">
          <a-form-item :label="$t('products.shipping')" name="shippingInformation">
            <a-input v-model:value="formState.shippingInformation" />
          </a-form-item>
        </a-col>

        <!-- Return Policy -->
        <a-col :span="24">
          <a-form-item :label="$t('products.returnPolicy')" name="returnPolicy">
            <a-input v-model:value="formState.returnPolicy" />
          </a-form-item>
        </a-col>

        <!-- Tags -->
        <a-col :span="24">
          <a-form-item :label="$t('products.tags')" name="tags">
            <a-select v-model:value="formState.tags" mode="tags" :placeholder="$t('common.select')" />
          </a-form-item>
        </a-col>

        <!-- Thumbnail -->
        <a-col :span="24">
          <a-form-item :label="$t('products.thumbnail')" name="thumbnail">
            <a-input v-model:value="formState.thumbnail" :placeholder="$t('validation.url')" />
          </a-form-item>
        </a-col>

        <!-- Images -->
        <a-col :span="24">
          <a-form-item :label="$t('products.images')" name="images">
            <a-select v-model:value="formState.images" mode="tags" :placeholder="$t('validation.url')" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import type { Product, ProductFormData } from '~/types'

interface Props {
  product?: Product | null
  mode: 'create' | 'edit'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const visible = defineModel<boolean>('open', { default: false })

const { t } = useI18n()
const { showSuccess, showError } = useNotification()

const productsStore = useProductsStore()
const { categories } = storeToRefs(productsStore)

const formRef = ref<FormInstance>()
const loading = ref(false)

const initialState: ProductFormData = {
  title: '',
  description: '',
  category: '',
  price: 0,
  discountPercentage: 0,
  rating: 0,
  stock: 0,
  tags: [],
  brand: '',
  sku: '',
  weight: 0,
  dimensions: { width: 0, height: 0, depth: 0 },
  warrantyInformation: '',
  shippingInformation: '',
  availabilityStatus: 'In Stock',
  returnPolicy: '',
  minimumOrderQuantity: 1,
  images: [],
  thumbnail: ''
}

const formState = reactive<ProductFormData>({ ...initialState })

const formRules = {
  title: [{ required: true, message: t('validation.required') }],
  description: [{ required: true, message: t('validation.required') }],
  category: [{ required: true, message: t('validation.required') }],
  price: [{ required: true, message: t('validation.required') }],
  stock: [{ required: true, message: t('validation.required') }]
}

// Watch for product changes
watch(
  () => props.product,
  (newProduct) => {
    if (newProduct && props.mode === 'edit') {
      Object.assign(formState, {
        title: newProduct.title,
        description: newProduct.description,
        category: newProduct.category,
        price: newProduct.price,
        discountPercentage: newProduct.discountPercentage,
        rating: newProduct.rating,
        stock: newProduct.stock,
        tags: newProduct.tags || [],
        brand: newProduct.brand || '',
        sku: newProduct.sku,
        weight: newProduct.weight,
        dimensions: newProduct.dimensions || { width: 0, height: 0, depth: 0 },
        warrantyInformation: newProduct.warrantyInformation,
        shippingInformation: newProduct.shippingInformation,
        availabilityStatus: newProduct.availabilityStatus,
        returnPolicy: newProduct.returnPolicy,
        minimumOrderQuantity: newProduct.minimumOrderQuantity,
        images: newProduct.images || [],
        thumbnail: newProduct.thumbnail
      })
    } else {
      Object.assign(formState, initialState)
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    let result
    if (props.mode === 'create') {
      result = await productsStore.createProduct(formState)
    } else if (props.product) {
      result = await productsStore.updateProduct(props.product.id, formState)
    }

    if (result?.success) {
      showSuccess(
        props.mode === 'create'
          ? t('products.createSuccess')
          : t('products.updateSuccess')
      )
      emit('success')
      visible.value = false
    } else {
      showError(result?.error || 'Operation failed')
    }
  } catch {
    // Validation failed
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  formRef.value?.resetFields()
  visible.value = false
}
</script>
