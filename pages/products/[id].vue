<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/products">
        <a-button shape="circle" class="border-none shadow-none">
          <template #icon><ArrowLeftOutlined /></template>
        </a-button>
      </NuxtLink>
      <h1 class="text-2xl sm:text-3xl font-bold text-[#202224] tracking-tight">
        {{ isEdit ? $t("products.editProduct") : $t("products.form.addNew") }}
      </h1>
    </div>

    <a-card class="shadow-sm rounded-2xl border-none p-6">
      <a-form layout="vertical" :model="formState" @finish="handleSubmit">
        <a-divider orientation="left">{{
          $t("products.form.basic")
        }}</a-divider>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a-form-item
            :label="$t('products.form.title')"
            name="title"
            :rules="[{ required: true }]"
          >
            <a-input
              v-model:value="formState.title"
              placeholder="e.g. iPhone 15 Pro"
            />
          </a-form-item>

          <a-form-item :label="$t('products.form.brand')" name="brand">
            <a-input v-model:value="formState.brand" placeholder="e.g. Apple" />
          </a-form-item>

          <a-form-item
            :label="$t('products.form.category')"
            name="category"
            :rules="[{ required: true }]"
          >
            <a-select
              v-model:value="formState.category"
              :placeholder="$t('products.form.categoryPlaceholder')"
            >
              <a-select-option
                v-for="cat in productsStore.categories"
                :key="cat.slug || cat"
                :value="cat.slug || cat"
              >
                {{ cat.name || cat }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :label="$t('products.form.sku')" name="sku">
            <a-input v-model:value="formState.sku" placeholder="Unique SKU" />
          </a-form-item>
        </div>

        <a-form-item
          :label="$t('products.form.description')"
          name="description"
          :rules="[{ required: true }]"
        >
          <a-textarea
            v-model:value="formState.description"
            :rows="4"
            :placeholder="$t('products.form.descriptionPlaceholder')"
          />
        </a-form-item>

        <a-divider orientation="left">{{
          $t("products.form.pricing")
        }}</a-divider>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a-form-item
            :label="$t('products.form.price')"
            name="price"
            :rules="[{ required: true }]"
          >
            <a-input-number
              v-model:value="formState.price"
              class="w-full"
              :min="0"
            />
          </a-form-item>

          <a-form-item
            :label="$t('products.form.discount')"
            name="discountPercentage"
          >
            <a-input-number
              v-model:value="formState.discountPercentage"
              class="w-full"
              :min="0"
              :max="100"
            />
          </a-form-item>

          <a-form-item
            :label="$t('products.form.stock')"
            name="stock"
            :rules="[{ required: true }]"
          >
            <a-input-number
              v-model:value="formState.stock"
              class="w-full"
              :min="0"
            />
          </a-form-item>

          <a-form-item
            :label="$t('products.form.minOrder')"
            name="minimumOrderQuantity"
          >
            <a-input-number
              v-model:value="formState.minimumOrderQuantity"
              class="w-full"
              :min="1"
            />
          </a-form-item>

          <a-form-item
            :label="$t('products.form.availability')"
            name="availabilityStatus"
          >
            <a-select v-model:value="formState.availabilityStatus">
              <a-select-option value="In Stock">In Stock</a-select-option>
              <a-select-option value="Low Stock">Low Stock</a-select-option>
              <a-select-option value="Out of Stock"
                >Out of Stock</a-select-option
              >
            </a-select>
          </a-form-item>
        </div>

        <a-divider orientation="left">{{
          $t("products.form.details")
        }}</a-divider>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a-form-item :label="$t('products.form.weight')" name="weight">
            <a-input-number
              v-model:value="formState.weight"
              class="w-full"
              placeholder="Weight"
            />
          </a-form-item>
          <a-form-item
            :label="$t('products.form.returnPolicy')"
            name="returnPolicy"
          >
            <a-input
              v-model:value="formState.returnPolicy"
              placeholder="e.g. 30 days return"
            />
          </a-form-item>
          <a-form-item
            :label="$t('products.form.warranty')"
            name="warrantyInformation"
          >
            <a-input
              v-model:value="formState.warrantyInformation"
              placeholder="e.g. 1 Year Warranty"
            />
          </a-form-item>
          <a-form-item
            :label="$t('products.form.shipping')"
            name="shippingInformation"
          >
            <a-input
              v-model:value="formState.shippingInformation"
              placeholder="e.g. Ships in 2 days"
            />
          </a-form-item>
        </div>

        <a-form-item :label="$t('products.form.dimensions')">
          <div class="flex gap-2">
            <a-input-number
              v-if="formState.dimensions"
              v-model:value="formState.dimensions.width"
              placeholder="Width"
            />
            <a-input-number
              v-if="formState.dimensions"
              v-model:value="formState.dimensions.height"
              placeholder="Height"
            />
            <a-input-number
              v-if="formState.dimensions"
              v-model:value="formState.dimensions.depth"
              placeholder="Depth"
            />
          </div>
        </a-form-item>

        <a-divider orientation="left">{{
          $t("products.form.media")
        }}</a-divider>
        <a-form-item :label="$t('products.form.thumbnail')" name="thumbnail">
          <a-input
            v-model:value="formState.thumbnail"
            placeholder="https://..."
          />
        </a-form-item>

        <a-form-item :label="$t('products.form.images')">
          <div
            v-for="(img, index) in formState.images"
            :key="index"
            class="flex gap-2 mb-2"
          >
            <a-input
              v-if="formState.images"
              v-model:value="formState.images[index]"
              placeholder="Image URL"
            />
            <a-button
              danger
              @click="removeImage(index)"
              v-if="formState.images && formState.images.length > 1"
            >
              <DeleteOutlined />
            </a-button>
          </div>
          <a-button type="dashed" block @click="addImage">
            <PlusOutlined /> {{ $t("products.form.addImage") }}
          </a-button>
        </a-form-item>

        <div class="flex justify-end gap-3 mt-8">
          <NuxtLink to="/products">
            <a-button size="large">{{ $t("common.cancel") }}</a-button>
          </NuxtLink>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="productsStore.loading"
          >
            {{
              isEdit ? $t("products.form.update") : $t("products.form.create")
            }}
          </a-button>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import type { Product } from "~/types";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const { success, error } = useNotification();

const isEdit = computed(() => route.params.id && route.params.id !== "add");
const productId = route.params.id as string;

const formState = reactive<Partial<Product>>({
  title: "",
  description: "",
  category: "",
  price: 0,
  discountPercentage: 0,
  stock: 0,
  brand: "",
  sku: "",
  weight: 0,
  dimensions: { width: 0, height: 0, depth: 0 },
  warrantyInformation: "",
  shippingInformation: "",
  availabilityStatus: "In Stock",
  returnPolicy: "",
  minimumOrderQuantity: 1,
  thumbnail: "",
  images: [""],
});

onMounted(async () => {
  await productsStore.fetchCategories();

  if (isEdit.value) {
    try {
      const product = await productsStore.fetchProductById(Number(productId));
      Object.assign(formState, product);
      if (!formState.dimensions)
        formState.dimensions = { width: 0, height: 0, depth: 0 };
      if (!formState.images || formState.images.length === 0)
        formState.images = [""];
    } catch (err) {
      error("Error", "Failed to load product details");
      router.push("/products");
    }
  }
});

const addImage = () => {
  if (!formState.images) formState.images = [];
  formState.images.push("");
};

const removeImage = (index: number) => {
  if (formState.images) {
    formState.images.splice(index, 1);
  }
};

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await productsStore.updateProduct(Number(productId), formState);
      success("Success", "Product updated successfully");
    } else {
      await productsStore.addProduct(formState);
      success("Success", "Product created successfully");
    }
    router.push("/products");
  } catch (err) {
    error("Error", "Failed to save product");
  }
};
</script>
