<template>
  <div>
    <h1
      class="text-2xl sm:text-3xl font-bold text-[#202224] dark:text-white mb-6 tracking-tight"
    >
      {{ $t("dashboard.title") }}
    </h1>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <a-spin size="large" />
    </div>

    <div v-else class="space-y-6">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <a-card
          class="shadow-sm rounded-2xl border-none hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p
                class="text-base font-semibold text-[#202224] dark:text-dark-text-secondary opacity-70 mb-2"
              >
                {{ $t("dashboard.totalUsers") }}
              </p>
              <p
                class="text-3xl font-bold text-[#202224] dark:text-white mb-4 tracking-wide"
              >
                {{ formatNumber(stats.totalUsers) }}
              </p>
              <div class="flex items-center gap-2 text-sm">
                <span
                  class="text-[#00b69b] font-semibold flex items-center gap-1"
                >
                  <ArrowUpOutlined /> 8.5%
                </span>
                <span class="text-[#606060]">{{
                  $t("dashboard.upFromYesterday")
                }}</span>
              </div>
            </div>
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#e5eaff]"
            >
              <UsergroupAddOutlined class="text-2xl text-[#5a8cff]" />
            </div>
          </div>
        </a-card>

        <a-card
          class="shadow-sm rounded-2xl border-none hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p
                class="text-base font-semibold text-[#202224] dark:text-dark-text-secondary opacity-70 mb-2"
              >
                {{ $t("dashboard.totalOrders") }}
              </p>
              <p
                class="text-3xl font-bold text-[#202224] dark:text-white mb-4 tracking-wide"
              >
                {{ formatNumber(stats.totalOrders) }}
              </p>
              <div class="flex items-center gap-2 text-sm">
                <span
                  class="text-[#00b69b] font-semibold flex items-center gap-1"
                >
                  <ArrowUpOutlined /> 1.3%
                </span>
                <span class="text-[#606060]">{{
                  $t("dashboard.upFromPastWeek")
                }}</span>
              </div>
            </div>
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#fff3d6]"
            >
              <DropboxOutlined class="text-2xl text-[#ffbc01]" />
            </div>
          </div>
        </a-card>

        <a-card
          class="shadow-sm rounded-2xl border-none hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p
                class="text-base font-semibold text-[#202224] dark:text-dark-text-secondary opacity-70 mb-2"
              >
                {{ $t("dashboard.totalSales") }}
              </p>
              <p
                class="text-3xl font-bold text-[#202224] dark:text-white mb-4 tracking-wide"
              >
                ${{ formatNumber(stats.totalSales) }}
              </p>
              <div class="flex items-center gap-2 text-sm">
                <span
                  class="text-[#f93c65] font-semibold flex items-center gap-1"
                >
                  <ArrowDownOutlined /> 4.3%
                </span>
                <span class="text-[#606060]">{{
                  $t("dashboard.downFromYesterday")
                }}</span>
              </div>
            </div>
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#dcfce7]"
            >
              <LineChartOutlined class="text-2xl text-[#16a34a]" />
            </div>
          </div>
        </a-card>

        <a-card
          class="shadow-sm rounded-2xl border-none hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p
                class="text-base font-semibold text-[#202224] dark:text-dark-text-secondary opacity-70 mb-2"
              >
                {{ $t("dashboard.totalPending") }}
              </p>
              <p
                class="text-3xl font-bold text-[#202224] dark:text-white mb-4 tracking-wide"
              >
                {{ formatNumber(stats.totalPending) }}
              </p>
              <div class="flex items-center gap-2 text-sm">
                <span
                  class="text-[#00b69b] font-semibold flex items-center gap-1"
                >
                  <ArrowUpOutlined /> 1.8%
                </span>
                <span class="text-[#606060]">{{
                  $t("dashboard.upFromYesterday")
                }}</span>
              </div>
            </div>
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#ffded1]"
            >
              <FieldTimeOutlined class="text-2xl text-[#ff6a00]" />
            </div>
          </div>
        </a-card>
      </div>

      <div class="space-y-6">
        <a-card class="shadow-sm rounded-2xl border-none">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-[#202224] dark:text-white">
              {{ $t("dashboard.salesDetails") }}
            </h2>
            <a-select
              v-model:value="selectedMonth"
              style="width: 120px"
              class="rounded-lg"
            >
              <a-select-option value="october">October</a-select-option>
              <a-select-option value="november">November</a-select-option>
              <a-select-option value="december">December</a-select-option>
            </a-select>
          </div>
          <div class="relative h-64 w-full">
            <Line :data="chartData" :options="chartOptions" />
          </div>
        </a-card>

        <a-card class="shadow-sm rounded-2xl border-none">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-[#202224] dark:text-white">
              {{ $t("dashboard.dealsDetails") }}
            </h2>
            <a-select
              v-model:value="selectedDealMonth"
              style="width: 120px"
              class="rounded-lg"
            >
              <a-select-option value="october">October</a-select-option>
              <a-select-option value="november">November</a-select-option>
              <a-select-option value="december">December</a-select-option>
            </a-select>
          </div>
          <div class="overflow-x-auto">
            <a-table
              :columns="dealsColumns"
              :data-source="recentDeals"
              :pagination="false"
              size="middle"
              :row-class-name="() => 'hover:bg-gray-50'"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'product'">
                  <div class="flex items-center gap-3">
                    <img
                      :src="record.image"
                      :alt="record.product"
                      class="w-9 h-9 rounded-lg object-cover bg-gray-100"
                    />
                    <span
                      class="font-semibold text-sm text-[#202224] dark:text-white opacity-90"
                    >
                      {{ record.product }}
                    </span>
                  </div>
                </template>
                <template v-if="column.key === 'status'">
                  <a-tag
                    :color="getStatusColor(record.status)"
                    class="rounded-full px-4 py-1 font-bold text-xs border-none"
                  >
                    {{ record.status }}
                  </a-tag>
                </template>
              </template>
            </a-table>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UsergroupAddOutlined,
  DropboxOutlined,
  LineChartOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons-vue";
import type { ChartOptions } from "chart.js";
import { Line } from "vue-chartjs";
import { storeToRefs } from "pinia";
import { useDashboardStore } from "~/stores/dashboard";

definePageMeta({
  middleware: "auth",
  layout: "default",
});

const selectedMonth = ref("october");
const selectedDealMonth = ref("october");

const dashboardStore = useDashboardStore();
const { stats, loading } = storeToRefs(dashboardStore);

const fetchDashboardStats = async () => {
  try {
    await dashboardStore.fetchDashboardStats();
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    const { error: showError } = useNotification();
    showError("Error", "Failed to load dashboard statistics");
  }
};

const chartData = computed(() => ({
  labels: [
    "5k",
    "10k",
    "15k",
    "20k",
    "25k",
    "30k",
    "35k",
    "40k",
    "45k",
    "50k",
    "55k",
    "60k",
  ],
  datasets: [
    {
      label: "Sales",
      data: [20, 35, 45, 30, 60, 45, 60, 35, 75, 50, 65, 80],
      borderColor: "#4880ff",
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, "rgba(72, 128, 255, 0.4)");
        gradient.addColorStop(1, "rgba(72, 128, 255, 0.0)");
        return gradient;
      },
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}));

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: "index",
      intersect: false,
      backgroundColor: "#000",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "#fff",
      borderWidth: 0,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      border: {
        display: false,
      },
      grid: {
        color: "#f0f0f0",
      },
      ticks: {
        color: "#a0a0a0",
        callback: (value: any) => value + "%",
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#a0a0a0",
      },
    },
  },
};

const { t } = useI18n();

const dealsColumns = computed(() => [
  { title: t("dashboard.productName"), key: "product", dataIndex: "product" },
  { title: t("dashboard.location"), key: "location", dataIndex: "location" },
  { title: t("dashboard.dateTime"), key: "date", dataIndex: "date" },
  { title: t("dashboard.piece"), key: "piece", dataIndex: "piece" },
  { title: t("dashboard.amount"), key: "amount", dataIndex: "amount" },
  { title: t("dashboard.status"), key: "status", dataIndex: "status" },
]);

const recentDeals = ref([
  {
    key: "1",
    product: "Apple Watch",
    location: "6096 Marjolaine Landing",
    date: "12.09.2019 - 12.53 PM",
    piece: "423",
    amount: "$34,295",
    status: "Delivered",
    image: "https://via.placeholder.com/100?text=Apple+Watch",
  },
  {
    key: "2",
    product: "Apple Watch",
    location: "6096 Marjolaine Landing",
    date: "12.09.2019 - 12.53 PM",
    piece: "423",
    amount: "$34,295",
    status: "Pending",
    image: "https://via.placeholder.com/100?text=Apple+Watch",
  },
  {
    key: "3",
    product: "Apple Watch",
    location: "6096 Marjolaine Landing",
    date: "12.09.2019 - 12.53 PM",
    piece: "423",
    amount: "$34,295",
    status: "Rejected",
    image: "https://via.placeholder.com/100?text=Apple+Watch",
  },
]);

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "#00b69b";
    case "Pending":
      return "#ffbc01";
    case "Rejected":
      return "#ef3826";
    default:
      return "default";
  }
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(num);
};

onMounted(() => {
  fetchDashboardStats();
});
</script>

<style scoped>
:deep(.ant-card) {
  font-family: "Nunito Sans", sans-serif;
}
</style>
