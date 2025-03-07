<script setup lang="ts">
import type {TravelEntry} from '@/types/models'
defineProps<{
  entry: TravelEntry
}>()
</script>

<template>
  <li v-if="entry" class="pb-3 sm:pb-4">
    <div class="flex items-center space-x-4 rtl:space-x-reverse">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">{{ entry.country }}</p>
      </div>
      <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white button-container">
        <button @click="$emit('edit')" class="edit">Edit</button>
        <button @click="$emit('delete')" class="delete">Delete</button>
      </div>
    </div>
  </li>
</template>
