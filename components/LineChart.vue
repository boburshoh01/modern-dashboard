<template>
  <div class="relative w-full h-full">
    <canvas ref="chartCanvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
  }>;
}

const props = defineProps<{
  data: ChartData;
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartContext: CanvasRenderingContext2D | null = null;

const drawChart = () => {
  if (!process.client || !chartCanvas.value) return;

  const canvas = chartCanvas.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  chartContext = ctx;

  const rect = canvas.getBoundingClientRect();
  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = rect.width * devicePixelRatio;
  canvas.height = rect.height * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const width = rect.width;
  const height = rect.height;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  ctx.strokeStyle = "#e8e8e8";
  ctx.lineWidth = 1;

  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = padding + (chartHeight / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  const dataPoints = props.data.labels.length;
  for (let i = 0; i <= dataPoints; i++) {
    const x = padding + (chartWidth / dataPoints) * i;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(43, 48, 52, 0.4)";
  ctx.font = "12px Nunito Sans";
  ctx.textAlign = "right";
  for (let i = 0; i <= gridLines; i++) {
    const value = 100 - (100 / gridLines) * i;
    const y = padding + (chartHeight / gridLines) * i;
    ctx.fillText(`${value}%`, padding - 10, y + 4);
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(43, 48, 52, 0.4)";
  for (let i = 0; i < dataPoints; i++) {
    const x = padding + (chartWidth / (dataPoints - 1)) * i;
    ctx.fillText(props.data.labels[i], x, height - padding + 20);
  }

  const dataset = props.data.datasets[0];
  const maxValue = Math.max(...dataset.data);
  const minValue = Math.min(...dataset.data);
  const valueRange = maxValue - minValue || 1;

  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  for (let i = 0; i < dataset.data.length; i++) {
    const x = padding + (chartWidth / (dataset.data.length - 1)) * i;
    const normalizedValue = (dataset.data[i] - minValue) / valueRange;
    const y = height - padding - normalizedValue * chartHeight;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.lineTo(width - padding, height - padding);
  ctx.closePath();
  ctx.fillStyle = dataset.backgroundColor;
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = dataset.borderColor;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let i = 0; i < dataset.data.length; i++) {
    const x = padding + (chartWidth / (dataset.data.length - 1)) * i;
    const normalizedValue = (dataset.data[i] - minValue) / valueRange;
    const y = height - padding - normalizedValue * chartHeight;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.fillStyle = dataset.borderColor;
  for (let i = 0; i < dataset.data.length; i++) {
    const x = padding + (chartWidth / (dataset.data.length - 1)) * i;
    const normalizedValue = (dataset.data[i] - minValue) / valueRange;
    const y = height - padding - normalizedValue * chartHeight;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  const peakIndex = Math.floor((dataset.data.length - 1) * 0.35);
  const peakX = padding + (chartWidth / (dataset.data.length - 1)) * peakIndex;
  const peakY =
    height -
    padding -
    ((dataset.data[peakIndex] - minValue) / valueRange) * chartHeight;

  ctx.fillStyle = "#4880ff";
  ctx.beginPath();
  ctx.arc(peakX, peakY - 25, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.font = "bold 12px Nunito Sans";
  ctx.textAlign = "center";
  ctx.fillText("64,3664.77", peakX, peakY - 20);
};

onMounted(() => {
  if (import.meta.client && chartCanvas.value) {
    drawChart();

    const handleResize = () => drawChart();
    window.addEventListener("resize", handleResize);

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });
  }
});

watch(
  () => props.data,
  () => {
    if (import.meta.client && chartCanvas.value) {
      drawChart();
    }
  },
  { deep: true }
);
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
