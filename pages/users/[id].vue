<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink to="/users">
          <a-button
            type="text"
            shape="circle"
            class="flex items-center justify-center"
          >
            <LeftOutlined />
          </a-button>
        </NuxtLink>
        <h1
          class="text-3xl font-bold text-[#202224] dark:text-white tracking-tight font-['Nunito_Sans']"
        >
          {{ isEditMode ? $t("users.editUser") : $t("users.addUser") }}
        </h1>
      </div>
      <a-button
        type="primary"
        size="large"
        class="bg-[#4880ff] px-8 rounded-lg font-semibold h-11 border-none"
        :loading="loading"
        @click="handleSubmit"
      >
        {{ $t("users.saveUser") }}
      </a-button>
    </div>

    <a-form layout="vertical" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-6">
        <div
          class="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col items-center text-center"
        >
          <div
            class="w-32 h-32 rounded-full bg-gray-100 dark:bg-dark-main mb-4 overflow-hidden relative group"
          >
            <img
              v-if="formState.image"
              :src="formState.image"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-gray-300"
            >
              <UserOutlined class="text-4xl" />
            </div>
            <div
              class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <span class="text-white font-semibold">{{
                $t("users.change")
              }}</span>
            </div>
          </div>
          <a-input
            v-model:value="formState.image"
            :placeholder="$t('users.imageUrl')"
            class="text-center text-sm dark:bg-dark-main dark:text-white dark:border-dark-border"
          />
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {{ $t("users.pasteUrl") }}
          </p>
        </div>

        <div
          class="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border space-y-4"
        >
          <h3 class="font-bold text-lg mb-4 dark:text-white">
            {{ $t("users.form.personal") }}
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <a-form-item :label="$t('users.form.firstName')" required>
              <a-input v-model:value="formState.firstName" />
            </a-form-item>
            <a-form-item :label="$t('users.form.lastName')" required>
              <a-input v-model:value="formState.lastName" />
            </a-form-item>
          </div>
          <a-form-item :label="$t('users.form.maidenName')">
            <a-input v-model:value="formState.maidenName" />
          </a-form-item>
          <div class="grid grid-cols-2 gap-4">
            <a-form-item :label="$t('users.form.age')" required>
              <a-input-number
                v-model:value="formState.age"
                class="w-full"
                :min="18"
              />
            </a-form-item>
            <a-form-item :label="$t('users.form.gender')" required>
              <a-select v-model:value="formState.gender">
                <a-select-option value="male">{{
                  $t("users.genders.male")
                }}</a-select-option>
                <a-select-option value="female">{{
                  $t("users.genders.female")
                }}</a-select-option>
                <a-select-option value="other">{{
                  $t("users.genders.other")
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <a-form-item :label="$t('users.form.birthDate')" required>
            <a-date-picker
              v-model:value="formState.birthDate"
              value-format="YYYY-MM-DD"
              class="w-full"
            />
          </a-form-item>
        </div>

        <div
          class="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border space-y-4"
        >
          <h3 class="font-bold text-lg mb-4 dark:text-white">
            {{ $t("users.form.physical") }}
          </h3>
          <div class="grid grid-cols-3 gap-4">
            <a-form-item :label="$t('users.form.height')">
              <a-input-number v-model:value="formState.height" class="w-full" />
            </a-form-item>
            <a-form-item :label="$t('users.form.weight')">
              <a-input-number v-model:value="formState.weight" class="w-full" />
            </a-form-item>
            <a-form-item :label="$t('users.form.bloodGroup')">
              <a-select v-model:value="formState.bloodGroup">
                <a-select-option
                  v-for="g in [
                    'A+',
                    'A-',
                    'B+',
                    'B-',
                    'AB+',
                    'AB-',
                    'O+',
                    'O-',
                  ]"
                  :key="g"
                  :value="g"
                  >{{ g }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <a-form-item :label="$t('users.form.eyeColor')">
              <a-input v-model:value="formState.eyeColor" />
            </a-form-item>
            <a-form-item :label="$t('users.form.hairColor')">
              <a-input v-model:value="formState.hair.color" />
            </a-form-item>
          </div>
          <a-form-item :label="$t('users.form.hairType')">
            <a-select v-model:value="formState.hair.type">
              <a-select-option value="Straight">{{
                $t("users.hairTypes.Straight")
              }}</a-select-option>
              <a-select-option value="Wavy">{{
                $t("users.hairTypes.Wavy")
              }}</a-select-option>
              <a-select-option value="Curly">{{
                $t("users.hairTypes.Curly")
              }}</a-select-option>
              <a-select-option value="Kinky">{{
                $t("users.hairTypes.Kinky")
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div
          class="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border"
        >
          <h3 class="font-bold text-lg mb-4 dark:text-white">
            {{ $t("users.form.contact") }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a-form-item :label="$t('users.form.email')" required>
              <a-input v-model:value="formState.email" />
            </a-form-item>
            <a-form-item :label="$t('users.form.phone')" required>
              <a-input v-model:value="formState.phone" />
            </a-form-item>
          </div>
          <a-divider orientation="left">{{
            $t("users.form.address")
          }}</a-divider>
          <a-form-item :label="$t('users.form.street')">
            <a-input v-model:value="formState.address.address" />
          </a-form-item>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <a-form-item :label="$t('users.form.city')">
              <a-input v-model:value="formState.address.city" />
            </a-form-item>
            <a-form-item :label="$t('users.form.state')">
              <a-input v-model:value="formState.address.state" />
            </a-form-item>
            <a-form-item :label="$t('users.form.stateCode')">
              <a-input v-model:value="formState.address.stateCode" />
            </a-form-item>
            <a-form-item :label="$t('users.form.postalCode')">
              <a-input v-model:value="formState.address.postalCode" />
            </a-form-item>
            <a-form-item :label="$t('users.form.country')">
              <a-input v-model:value="formState.address.country" />
            </a-form-item>
          </div>
        </div>

        <div
          class="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border"
        >
          <h3 class="font-bold text-lg mb-4 dark:text-white">
            {{ $t("users.form.professional") }}
          </h3>
          <a-form-item :label="$t('users.form.university')">
            <a-input v-model:value="formState.university" />
          </a-form-item>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a-form-item :label="$t('users.form.company')">
              <a-input v-model:value="formState.company.name" />
            </a-form-item>
            <a-form-item :label="$t('users.form.department')">
              <a-input v-model:value="formState.company.department" />
            </a-form-item>
            <a-form-item :label="$t('users.form.jobTitle')">
              <a-input v-model:value="formState.company.title" />
            </a-form-item>
          </div>
        </div>

        <div
          class="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border"
        >
          <h3 class="font-bold text-lg mb-4 dark:text-white">
            {{ $t("users.form.account") }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a-form-item :label="$t('users.username')" required>
              <a-input v-model:value="formState.username" />
            </a-form-item>
            <a-form-item
              :label="$t('users.form.password')"
              :required="!isEditMode"
            >
              <a-input-password v-model:value="formState.password" />
            </a-form-item>
            <a-form-item :label="$t('users.role')" required>
              <a-select v-model:value="formState.role">
                <a-select-option value="user">{{
                  $t("common.roles.user")
                }}</a-select-option>
                <a-select-option value="moderator">{{
                  $t("common.roles.moderator")
                }}</a-select-option>
                <a-select-option value="admin">{{
                  $t("common.roles.admin")
                }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$t('users.status')">
              <a-select v-model:value="formState.status">
                <a-select-option value="active">{{
                  $t("common.status.active")
                }}</a-select-option>
                <a-select-option value="inactive">{{
                  $t("common.status.inactive")
                }}</a-select-option>
                <a-select-option value="suspended">{{
                  $t("common.status.suspended")
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <a-divider />
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a-form-item label="EIN">
              <a-input v-model:value="formState.ein" />
            </a-form-item>
            <a-form-item label="SSN">
              <a-input v-model:value="formState.ssn" />
            </a-form-item>
            <a-form-item :label="$t('users.form.userAgent')">
              <a-input v-model:value="formState.userAgent" />
            </a-form-item>
          </div>
        </div>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { LeftOutlined, UserOutlined } from "@ant-design/icons-vue";
import type { User } from "~/types";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();
const { success, error } = useNotification();

const isEditMode = computed(() => route.params.id && route.params.id !== "add");
const loading = ref(false);

const formState = reactive({
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  hair: { color: "", type: "" },
  address: {
    address: "",
    city: "",
    state: "",
    stateCode: "",
    postalCode: "",
    country: "",
  },
  company: { name: "", department: "", title: "" },
  role: "user",
  status: "active",
} as unknown as User);

onMounted(async () => {
  if (isEditMode.value) {
    const id = Number(route.params.id);
    if (!isNaN(id)) {
      try {
        const user = await usersStore.fetchUserById(id);
        if (user) {
          Object.assign(formState, user);
          if (!formState.hair) formState.hair = { color: "", type: "" };
          if (!formState.address)
            formState.address = {
              address: "",
              city: "",
              state: "",
              stateCode: "",
              postalCode: "",
              country: "",
            };
          if (!formState.company)
            formState.company = { name: "", department: "", title: "" };
        }
      } catch {
        error("Error", "Failed to load user");
        router.push("/users");
      }
    }
  }
});

const handleSubmit = async () => {
  try {
    if (!formState.firstName || !formState.lastName || !formState.email) {
      error("Validation Error", "Please fill in all required fields");
      return;
    }

    loading.value = true;
    if (isEditMode.value) {
      await usersStore.updateUser(Number(route.params.id), formState);
      success("Updated", "User updated successfully");
      router.push("/users");
    } else {
      await usersStore.addUser(formState);
      success("Created", "User created successfully");
      router.push("/users");
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save user";
    error("Error", message);
  } finally {
    loading.value = false;
  }
};
</script>
