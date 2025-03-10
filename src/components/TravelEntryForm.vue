<script setup lang="ts">
import {ref, computed} from "vue";
import {storeToRefs} from "pinia";
import {useTravelEntryStore} from "@/stores/travelEntry";

const {
  createTravelEntry,
  setActivity,
  deleteActivity,
} = useTravelEntryStore();
const {travelEntry, activity, food, packList} = storeToRefs(useTravelEntryStore());
const showActivitiesInput = ref(false);
const showFoodInput = ref(false);
const showPackListInput = ref(false);

const sortedActivities = computed(() => {
  return travelEntry.value.activities.slice().sort((a, b) => {
    // Sort by category (type)
    const categoryComparison = a.type.localeCompare(b.type);
    if (categoryComparison !== 0) return categoryComparison;

    // If categories are the same, sort by name
    return a.name.localeCompare(b.name);
  });
});
const sortedFood = computed(() => {
  return travelEntry.value.food.slice().sort((a, b) => {
    // Sort by type first
    const typeComparison = a.type.localeCompare(b.type);
    if (typeComparison !== 0) return typeComparison;

    // If types are the same, sort by name
    return a.name.localeCompare(b.name);
  });
});
const sortedPackList = computed(() => {
  return travelEntry.value.packList.slice().sort((a, b) => {
    // Sort by type first
    const typeComparison = a.type.localeCompare(b.type);
    if (typeComparison !== 0) return typeComparison;

    // If types are the same, sort by name
    return a.name.localeCompare(b.name);
  });
});

function toggleShowActivitiesInput() {
  showActivitiesInput.value = !showActivitiesInput.value;
}

const isEmptyEntry = computed(() => {
  const entry = travelEntry.value;
  return (
      entry.type === '' &&
      entry.country === '' &&
      entry.city === '' &&
      entry.activities.length === 0 &&
      entry.food.length === 0 &&
      entry.packList.length === 0
  );
});
</script>

<template>
  <section>
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white py-4">Create or Update Travel Entry</h2>
    <div class="mb-4">
      <label for="type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a Type</label>
      <select v-model="travelEntry.type" id="type"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required>
        <option selected>Choose a Travel Type</option>
        <option value="holiday">Holiday</option>
        <option value="trip">Weekend Trip</option>
      </select>
    </div>
    <div class="grid gap-6 mb-6 grid-cols-2">
      <div>
        <label for="country"
               class="sr-only block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
        <input v-model="travelEntry.country" type="text" id="country" name="country" placeholder="Country"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               required>
      </div>
      <div>
        <label for="city" class="sr-only block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
        <input v-model="travelEntry.city" type="text" id="city" name="city" placeholder="City/Island"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               required>
      </div>
    </div>
  </section>

  <!-- 🏄‍ Activities Section -->
  <section>
    <div class="flex justify-between">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white py-4">🏄‍ Activities</h2>
      <button type="button" @click="toggleShowActivitiesInput" class="self-start">
        {{ showActivitiesInput ? "Close" : "Add" }}
      </button>
    </div>
    <ul v-if="showActivitiesInput" class="mt-4 grid grid-cols-3 gap-4 items-end">
      <div>
        <label for="activity_name" class="sr-only block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Activity Name
        </label>
        <input v-model="activity.name" type="text" id="activity_name" placeholder="Activity Name"
               class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required>
      </div>
      <select v-model="activity.type" id="activity_type"
              class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white">
        <option disabled value="">Select Type</option>
        <option value="Walking">Walking</option>
        <option value="Beach">Beach</option>
        <option value="Park">Park</option>
        <option value="Shopping">Shopping</option>
        <option value="Sightseeing">Sightseeing</option>
        <option value="Spa">Spa</option>
      </select>
      <div class="text-right flex items-center space-x-2">
        <button type="button" @click="setActivity(activity)"
                class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Add
        </button>
      </div>
    </ul>
    <!-- Display Activities -->
    <ul class="my-8">
      <li v-for="(item, index) in sortedActivities" :key="index" class="flex items-center justify-between">
        <span>{{ item.name }} ({{ item.type }})</span>
        <div class="flex pt-2">
          <button @click="deleteActivity(index)"
                  class="px-3 py-1 text-white bg-red-600 rounded-lg hover:bg-red-700">
            Delete
          </button>
        </div>
      </li>
    </ul>
  </section>

  <section class="button-container my-16">
    <button @click="createTravelEntry(travelEntry)"
            type="submit"
            class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
      {{ isEmptyEntry ? "Create Entry" : "Update Entry" }}
    </button>
    <button @click="$emit('close')"
            type="button"
            class="px-6 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700">
      Close
    </button>
  </section>
</template>
