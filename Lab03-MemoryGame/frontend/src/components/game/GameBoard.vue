<template>
  <div class="m-auto pt-10 grid gap-10 p-4 max-w-lg grid-cols-4">
    <MemoryCard v-for="item in cards" :card="item" :key="item" />
  </div>
</template>

<script setup>
import MemoryCard from './MemoryCard.vue'
import { ref } from 'vue'
const cards = ref([1, 2, 3, 4, 5, 6, 7, 8])
</script>
