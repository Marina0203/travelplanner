<script setup lang="ts">
// Here are just imports of functions, types and components
import {onMounted, ref} from "vue";
import TravelElement from '@/components/TravelEntry.vue'
import TravelEntryForm from "@/components/TravelEntryForm.vue";
import {useTravelEntryStore} from "@/stores/travelEntry";
import {storeToRefs} from "pinia";

const {
  editTravelEntry,
  deleteTravelEntry,
  resetTravelEntry,
  loadTravelEntries,
  toggleShowForm
} = useTravelEntryStore();
const {travelEntries, showForm} = storeToRefs(useTravelEntryStore());

onMounted(() => {
  loadTravelEntries();
});
</script>

<template>
  <div class="dark dark:bg-gray-800 dark:text-white h-full min-h-screen py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">

      <template v-if="!showForm">
        <!-- Travel Entry Create Action -->
        <section id="travel-entry-actions" class="text-center mb-6">
          <button @click="toggleShowForm(); resetTravelEntry();">
            Add Entry
          </button>
        </section>

        <!-- Output of Travel Entries -->
        <section id="travel-entries" class="py-8">
          <div v-if="travelEntries.length" class="space-y-6">
            <section id="travel-entries-holidays">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Holidays</h2>
              <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                <template v-for="(entry, index) in travelEntries">
                  <TravelElement v-if="entry.type === 'holiday'"
                                 @edit="editTravelEntry(index); toggleShowForm()"
                                 @delete="deleteTravelEntry(index)"
                                 :entry="entry"/>
                </template>
              </ul>
            </section>

            <section id="travel-entries-weekens-trips">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mt-4">Weekend Trips</h2>
              <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                <template v-for="(entry, index) in travelEntries">
                  <TravelElement v-if="entry.type === 'trip'"
                                 @edit="editTravelEntry(index); toggleShowForm()"
                                 @delete="deleteTravelEntry(index)"
                                 :entry="entry"/>
                </template>
              </ul>
            </section>
          </div>
          <div v-else class="text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">No travel entries found.</p>
          </div>
        </section>
      </template>

      <!-- Travel Entry Create and Update Form -->
      <section v-if="showForm" id="travel-entry-form" class="max-w-lg mx-auto">
        <TravelEntryForm @close="toggleShowForm"/>
      </section>
    </div>
  </div>
</template>


