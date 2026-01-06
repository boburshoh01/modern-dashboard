<template>
  <a-modal
    v-model:open="visible"
    :title="mode === 'create' ? $t('users.addUser') : $t('users.editUser')"
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
      <a-tabs>
        <!-- Personal Info Tab -->
        <a-tab-pane key="personal" :tab="$t('users.personalInfo') || 'Personal Info'">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item :label="$t('users.firstName')" name="firstName">
                <a-input v-model:value="formState.firstName" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.lastName')" name="lastName">
                <a-input v-model:value="formState.lastName" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.maidenName')" name="maidenName">
                <a-input v-model:value="formState.maidenName" />
              </a-form-item>
            </a-col>

            <a-col :span="8">
              <a-form-item :label="$t('users.username')" name="username">
                <a-input v-model:value="formState.username" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.email')" name="email">
                <a-input v-model:value="formState.email" type="email" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.phone')" name="phone">
                <a-input v-model:value="formState.phone" />
              </a-form-item>
            </a-col>

            <a-col v-if="mode === 'create'" :span="12">
              <a-form-item :label="$t('users.password')" name="password">
                <a-input-password v-model:value="formState.password" />
              </a-form-item>
            </a-col>

            <a-col :span="8">
              <a-form-item :label="$t('users.age')" name="age">
                <a-input-number v-model:value="formState.age" :min="18" :max="120" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.gender')" name="gender">
                <a-select v-model:value="formState.gender">
                  <a-select-option value="male">{{ $t('users.male') }}</a-select-option>
                  <a-select-option value="female">{{ $t('users.female') }}</a-select-option>
                  <a-select-option value="other">{{ $t('users.other') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.birthDate')" name="birthDate">
                <a-date-picker v-model:value="birthDateValue" style="width: 100%" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item :label="$t('users.image')" name="image">
                <a-input v-model:value="formState.image" :placeholder="$t('validation.url')" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>

        <!-- Physical Attributes Tab -->
        <a-tab-pane key="physical" :tab="$t('users.physicalAttributes') || 'Physical'">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item :label="$t('users.bloodGroup')" name="bloodGroup">
                <a-select v-model:value="formState.bloodGroup">
                  <a-select-option v-for="bg in bloodGroups" :key="bg" :value="bg">
                    {{ bg }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.height')" name="height">
                <a-input-number v-model:value="formState.height" :min="0" suffix="cm" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.weight')" name="weight">
                <a-input-number v-model:value="formState.weight" :min="0" suffix="kg" style="width: 100%" />
              </a-form-item>
            </a-col>

            <a-col :span="8">
              <a-form-item :label="$t('users.eyeColor')" name="eyeColor">
                <a-select v-model:value="formState.eyeColor">
                  <a-select-option v-for="color in eyeColors" :key="color" :value="color">
                    {{ color }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.hairColor')">
                <a-select v-model:value="formState.hair!.color">
                  <a-select-option v-for="color in hairColors" :key="color" :value="color">
                    {{ color }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.hairType')">
                <a-select v-model:value="formState.hair!.type">
                  <a-select-option value="Straight">{{ $t('users.straight') }}</a-select-option>
                  <a-select-option value="Wavy">{{ $t('users.wavy') }}</a-select-option>
                  <a-select-option value="Curly">{{ $t('users.curly') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>

        <!-- Address Tab -->
        <a-tab-pane key="address" :tab="$t('users.address')">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item :label="$t('users.street')">
                <a-input v-model:value="formState.address.address" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.city')">
                <a-input v-model:value="formState.address.city" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.state')">
                <a-input v-model:value="formState.address.state" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.postalCode')">
                <a-input v-model:value="formState.address.postalCode" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('users.country')">
                <a-input v-model:value="formState.address.country" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>

        <!-- Professional Tab -->
        <a-tab-pane key="professional" :tab="$t('users.professional') || 'Professional'">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item :label="$t('users.university')" name="university">
                <a-input v-model:value="formState.university" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.company')">
                <a-input v-model:value="formState.company!.name" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.department')">
                <a-input v-model:value="formState.company!.department" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="$t('users.jobTitle')">
                <a-input v-model:value="formState.company!.title" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>

        <!-- Account Tab -->
        <a-tab-pane key="account" :tab="$t('users.account') || 'Account'">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item :label="$t('users.role')" name="role">
                <a-select v-model:value="formState.role">
                  <a-select-option value="admin">{{ $t('users.admin') }}</a-select-option>
                  <a-select-option value="moderator">{{ $t('users.moderator') }}</a-select-option>
                  <a-select-option value="user">{{ $t('users.user') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="$t('users.status')" name="status">
                <a-select v-model:value="formState.status">
                  <a-select-option value="active">{{ $t('users.active') }}</a-select-option>
                  <a-select-option value="inactive">{{ $t('users.inactive') }}</a-select-option>
                  <a-select-option value="suspended">{{ $t('users.suspended') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import dayjs, { type Dayjs } from 'dayjs'
import type { FormInstance } from 'ant-design-vue'
import type { User, UserFormData } from '~/types'

interface Props {
  user?: User | null
  mode: 'create' | 'edit'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const visible = defineModel<boolean>('open', { default: false })

const { t } = useI18n()
const { showSuccess, showError } = useNotification()

const usersStore = useUsersStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const birthDateValue = ref<Dayjs | null>(null)

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const eyeColors = ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Amber']
const hairColors = ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White']

const initialState: UserFormData = {
  firstName: '',
  lastName: '',
  maidenName: '',
  age: 18,
  gender: 'male',
  email: '',
  phone: '',
  username: '',
  password: '',
  birthDate: '',
  image: '',
  bloodGroup: '',
  height: 0,
  weight: 0,
  eyeColor: '',
  hair: { color: '', type: '' },
  address: {
    address: '',
    city: '',
    state: '',
    stateCode: '',
    postalCode: '',
    country: ''
  },
  university: '',
  company: { name: '', department: '', title: '' },
  role: 'user',
  status: 'active'
}

const formState = reactive<UserFormData>({ ...initialState })

const formRules = {
  firstName: [{ required: true, message: t('validation.required') }],
  lastName: [{ required: true, message: t('validation.required') }],
  username: [{ required: true, message: t('validation.required') }],
  email: [
    { required: true, message: t('validation.required') },
    { type: 'email', message: t('validation.email') }
  ],
  password: props.mode === 'create' ? [{ required: true, message: t('validation.required') }] : []
}

// Watch for user changes
watch(
  () => props.user,
  (newUser) => {
    if (newUser && props.mode === 'edit') {
      Object.assign(formState, {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        maidenName: newUser.maidenName || '',
        age: newUser.age,
        gender: newUser.gender,
        email: newUser.email,
        phone: newUser.phone,
        username: newUser.username,
        birthDate: newUser.birthDate,
        image: newUser.image || '',
        bloodGroup: newUser.bloodGroup || '',
        height: newUser.height || 0,
        weight: newUser.weight || 0,
        eyeColor: newUser.eyeColor || '',
        hair: newUser.hair || { color: '', type: '' },
        address: newUser.address || { address: '', city: '', state: '', stateCode: '', postalCode: '', country: '' },
        university: newUser.university || '',
        company: newUser.company || { name: '', department: '', title: '' },
        role: newUser.role,
        status: newUser.status || 'active'
      })
      birthDateValue.value = newUser.birthDate ? dayjs(newUser.birthDate) : null
    } else {
      Object.assign(formState, initialState)
      birthDateValue.value = null
    }
  },
  { immediate: true }
)

// Watch birthDate
watch(birthDateValue, (val) => {
  formState.birthDate = val ? val.format('YYYY-MM-DD') : ''
})

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    let result
    if (props.mode === 'create') {
      result = await usersStore.createUser(formState)
    } else if (props.user) {
      result = await usersStore.updateUser(props.user.id, formState)
    }

    if (result?.success) {
      showSuccess(
        props.mode === 'create'
          ? t('users.createSuccess')
          : t('users.updateSuccess')
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
