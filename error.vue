<template>
  <div
    class="min-h-screen bg-[#4880ff] relative flex items-center justify-center p-4 overflow-hidden"
  >
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <svg
        class="w-full h-full"
        viewBox="0 0 1440 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0H1440V1024H0V0Z" fill="url(#paint0_linear)" />
        <path
          d="M1440 256C1300 256 1200 128 1000 128C800 128 700 256 500 256C300 256 200 128 0 128V1024H1440V256Z"
          fill="white"
          fill-opacity="0.1"
        />
        <path
          d="M1440 400C1300 400 1200 272 1000 272C800 272 700 400 500 400C300 400 200 272 0 272V1024H1440V400Z"
          fill="white"
          fill-opacity="0.05"
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="720"
            y1="0"
            x2="720"
            y2="1024"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0" />
            <stop offset="1" stop-color="white" stop-opacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div
      class="bg-white rounded-[24px] shadow-2xl w-full max-w-[630px] p-12 relative z-10 flex flex-col items-center text-center"
    >
      <div class="w-full max-w-[400px] mb-8">
        <svg
          viewBox="0 0 440 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-full h-auto"
        >
          <rect x="0" y="0" width="440" height="280" rx="20" fill="#EAF2FF" />
          <path
            d="M0 20C0 8.95431 8.95431 0 20 0H420C431.046 0 440 8.95431 440 20V54H0V20Z"
            fill="#D0E2FF"
          />
          <circle cx="34" cy="27" r="6" fill="#FF5F56" />
          <circle cx="56" cy="27" r="6" fill="#FFBD2E" />
          <circle cx="78" cy="27" r="6" fill="#27C93F" />
          <rect
            x="110"
            y="17"
            width="80"
            height="20"
            rx="10"
            fill="white"
            fill-opacity="0.5"
          />

          <rect x="0" y="54" width="440" height="226" rx="0" fill="#4880FF" />
          <path
            d="M0 54H440V260C440 271.046 431.046 280 420 280H20C8.9543 280 0 271.046 0 260V54Z"
            fill="#4880FF"
          />

          <g transform="translate(60, 80)">
            <path
              d="M30 0L0 50V70H30V90H50V70H65V50H50V0H30ZM30 50H20L30 35V50Z"
              fill="#FFB800"
              transform="scale(1.5)"
            />
            <path
              d="M100 0C85 0 75 15 75 45C75 75 85 90 100 90C115 90 125 75 125 45C125 15 115 0 100 0ZM100 70C95 70 93 60 93 45C93 30 95 20 100 20C105 20 107 30 107 45C107 60 105 70 100 70Z"
              fill="#FFB800"
              transform="scale(1.5) translate(-15, 0)"
            />
            <path
              d="M170 0L140 50V70H170V90H190V70H205V50H190V0H170ZM170 50H160L170 35V50Z"
              fill="#FFB800"
              transform="scale(1.5) translate(-30, 0)"
            />
          </g>

          <rect
            x="50"
            y="210"
            width="30"
            height="8"
            rx="4"
            fill="white"
            fill-opacity="0.8"
          />
          <rect
            x="50"
            y="230"
            width="60"
            height="8"
            rx="4"
            fill="white"
            fill-opacity="0.8"
          />

          <circle cx="350" cy="240" r="4" fill="white" fill-opacity="0.8" />
          <circle cx="370" cy="240" r="4" fill="white" fill-opacity="0.8" />
          <circle cx="390" cy="240" r="4" fill="white" fill-opacity="0.8" />
        </svg>
      </div>

      <h2 class="text-2xl font-bold text-[#202224] mb-8">
        {{ errorTitle }}
      </h2>

      <p
        v-if="error.statusCode !== 404"
        class="text-gray-500 mb-8 max-w-[400px]"
      >
        {{ errorMessage }}
      </p>

      <div class="w-full max-w-[340px]">
        <a-button
          type="primary"
          block
          size="large"
          class="h-[60px] rounded-[12px] bg-[#4880ff] border-none text-lg font-bold shadow-lg shadow-blue-500/30 hover:bg-[#3d70eb] transition-all"
          @click="handleError"
        >
          Back to Dashboard
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
});

const errorTitle = computed(() => {
  if (props.error.statusCode === 404) return "Looks like you've got lost....";
  if (props.error.statusCode === 403) return "Access Denied";
  return "Something Went Wrong";
});

const errorMessage = computed(() => {
  if (props.error.statusCode === 404) {
    return "Oops! The page you're looking for doesn't exist. It might have been moved or deleted.";
  }
  if (props.error.statusCode === 403) {
    return "Sorry, you don't have permission to access this page. Please contact your administrator.";
  }
  return "An unexpected error occurred. Our team has been notified and is working on a fix.";
});

const handleError = () => clearError({ redirect: "/dashboard" });
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&display=swap");

:deep(.ant-btn-primary) {
  background-color: #4880ff !important;
}

:deep(.ant-btn-primary:hover) {
  background-color: #3d70eb !important;
}
</style>
