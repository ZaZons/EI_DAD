<template>
  <GameBoard card="1" />
  <p class="m-auto pt-4 text-center text-md">
    Difficulty Level: <strong>{{ gameStore.difficulty }}</strong>
  </p>
</template>

<script setup>
import GameBoard from '@/components/game/GameBoard.vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
</script>
