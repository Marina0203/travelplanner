<script setup lang="ts">
import {ref} from "vue";
import type {TravelEntry} from '@/types/models'
const props = defineProps<{
  entry: array<FoodEntry>

}>()

const showEntry = ref(false)
</script>

<template>
  <div v-if="entry">
    <a @click="showEntry = !showEntry">{{entry.country}}</a>
    <ul v-if="showEntry">
      <li>{{entry.city}}</li>
      <li>{{entry.activities}}</li>
      <li>{{entry.food}}</li>
      <li>{{entry.firstAid}}</li>
      <li>{{entry.packingList}}</li>
      <li>{{entry.hotels}}</li>
    </ul>
  </div>
</template>
