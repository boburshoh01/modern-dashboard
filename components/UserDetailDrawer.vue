<template>
  <a-drawer
    v-model:open="visible"
    :title="$t('users.userDetails')"
    :width="600"
    placement="right"
  >
    <template v-if="user">
      <!-- User Header -->
      <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <img
          :src="user.image"
          :alt="user.firstName"
          class="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ user.firstName }} {{ user.lastName }}
          </h2>
          <p class="text-gray-500">@{{ user.username }}</p>
          <div class="flex gap-2 mt-2">
            <a-tag :color="getRoleColor(user.role)">
              {{ $t(`users.${user.role}`) }}
            </a-tag>
            <a-tag :color="getStatusColor(user.status)">
              {{ $t(`users.${user.status}`) }}
            </a-tag>
          </div>
        </div>
      </div>

      <!-- User Info Tabs -->
      <a-tabs>
        <!-- Personal Info -->
        <a-tab-pane key="personal" :tab="$t('users.personalInfo') || 'Personal'">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item :label="$t('users.email')">
              {{ user.email }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.phone')">
              {{ user.phone }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.age')">
              {{ user.age }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.gender')">
              {{ $t(`users.${user.gender}`) }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.birthDate')">
              {{ formatDate(user.birthDate) }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.maidenName')">
              {{ user.maidenName || '-' }}
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <!-- Physical -->
        <a-tab-pane key="physical" :tab="$t('users.physicalAttributes') || 'Physical'">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item :label="$t('users.bloodGroup')">
              {{ user.bloodGroup || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.height')">
              {{ user.height ? `${user.height} cm` : '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.weight')">
              {{ user.weight ? `${user.weight} kg` : '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.eyeColor')">
              {{ user.eyeColor || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.hairColor')">
              {{ user.hair?.color || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.hairType')">
              {{ user.hair?.type || '-' }}
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <!-- Address -->
        <a-tab-pane key="address" :tab="$t('users.address')">
          <a-descriptions :column="1" bordered size="small">
            <a-descriptions-item :label="$t('users.street')">
              {{ user.address?.address || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.city')">
              {{ user.address?.city || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.state')">
              {{ user.address?.state || '-' }} ({{ user.address?.stateCode }})
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.postalCode')">
              {{ user.address?.postalCode || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.country')">
              {{ user.address?.country || '-' }}
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <!-- Professional -->
        <a-tab-pane key="professional" :tab="$t('users.professional') || 'Professional'">
          <a-descriptions :column="1" bordered size="small">
            <a-descriptions-item :label="$t('users.university')">
              {{ user.university || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.company')">
              {{ user.company?.name || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.department')">
              {{ user.company?.department || '-' }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('users.jobTitle')">
              {{ user.company?.title || '-' }}
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
      </a-tabs>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import type { User } from '~/types'

interface Props {
  user?: User | null
}

defineProps<Props>()

const visible = defineModel<boolean>('open', { default: false })

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: 'red',
    moderator: 'orange',
    user: 'blue'
  }
  return colors[role] || 'default'
}

const getStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    active: 'green',
    inactive: 'default',
    suspended: 'red'
  }
  return colors[status || 'active'] || 'default'
}
</script>
