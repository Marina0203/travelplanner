<script setup lang="ts">
import type {TravelEntry} from "@/types/models";
import {ref, defineProps, defineEmits, computed} from "vue";

const emits = defineEmits([
  "close",
  "submit",
  "delete",
  "add-item",
  "toggle-like",
  "delete-item",
  "addFoodItem",
  "addPackListItem",
  "show-activities",
  "show-packlist-input",

]);

defineProps({
  newTravelEntry: {
    type: Object as () => TravelEntry,
    required: true,
  }
})

const showActivitiesInput = ref(false);
const showFoodInput = ref(false);
const showPackListInput = ref(false);
const activities = ref({
  name: '',
  type: '',
  liked: false,
});
const food = ref({
  name: '',
  type: '',
  liked: false,
});
const packList = ref({
  name: '',
  type: '',
  checked: false,
});
const sortedActivities = computed(() => {
  return newTravelEntry.value.activities.slice().sort((a, b) => {
    // Sort by category (type)
    const categoryComparison = a.type.localeCompare(b.type);
    if (categoryComparison !== 0) return categoryComparison;

    // If categories are the same, sort by name
    return a.name.localeCompare(b.name);
  });
});

</script>

<template>
  <!-- This is the hidden form to create a new entry -->
  <form id="addEntry"  @submit="$emit('submit')">
    <input v-model="newTravelEntry.country" type="text" name="country" placeholder="Country" class="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900
               focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
           required>
    <input v-model="newTravelEntry.city" type="text" name="city" placeholder="City/Island" class="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900
               focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
           required>

    <!-- 🏄‍ Activities Section -->
    <div class="flex items-center py-4">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white py-4">🏄‍ Activities</h2>
      <button type="button" @click="$emit('show-activities')">
        {{ showActivitiesInput ? "Close" : "Add" }}
      </button>
      <ul v-if="showActivitiesInput" class="mt-4 grid grid-cols-3 gap-4 items-end">
        <div>
          <label for="activity_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Activity Name
          </label>
          <input v-model="activities.name" type="text" id="activity_name" placeholder="Activity Name"
                 class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required>
        </div>
        <select v-model="activities.type" id="activity_type"
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
          <button type="button" @click="$emit('add-item')"
                  class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Add
          </button>
        </div>

        <!-- Display Activities -->
        <ul class="space-y-3">
          <li v-for="(item, index) in sortedActivities" :key="index" class="flex items-center justify-between">
            <span>{{ item.name }} ({{ item.type }})</span>
            <div class="flex space-x-4 pt-2">
              <button
                  @click="$emit('toggle-like', index)"
                  :class="item.liked ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-700'"
                  class="px-3 py-1 text-white rounded-lg transition">
                {{ item.liked ? "Liked" : "Like" }}
              </button>
              <button @click="$emit('delete-item', index)"
                      class="px-3 py-1 text-white bg-red-600 rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </li>
        </ul>
      </ul>
    </div>

    <!-- 🍓 Food Section -->
    <div class="flex items-center py-4">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white py-4">🍓 Food</h2>
      <div v-if="showFoodInput" class="mt-4 grid grid-cols-3 gap-4 items-end">
        <div>
          <label for="food_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Food Name
          </label>
          <input v-model="food.name" type="text" id="food_name" placeholder="Food"
                 class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required>
        </div>
        <div>
          <label for="food_type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select Type
          </label>
          <select v-model="food.type" id="food_type"
                  class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white">
            <option disabled value="">Select Type</option>
            <option value="cafe">Cafe</option>
            <option value="restaurant">Restaurant</option>
            <option value="breakfast">Breakfast</option>
            <option value="street food">Street Food</option>
            <option value="supermarket">Supermarket</option>
          </select>
        </div>
        <div class="text-right flex items-center space-x-2">
          <button type="button" @click="$emit('addFoodItem')"
                  class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Add
          </button>
        </div>
      </div>
    </div>

    <!-- 📓 Packlist Section -->
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white py-4">📓 Packlist</h2>
    <div>
      <button type="button"  @click="$emit('show-packlist-input')"
              class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
        {{ showPackListInput ? "Close" : "Add" }}
      </button>
      <div v-if="showPackListInput" class="mt-4 grid grid-cols-3 gap-4 items-end">
        <div>
          <label for="packlist_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item
            Name</label>
          <input v-model="packList.name" type="text" id="packlist_name" placeholder="Packlist Item"
                 class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" required>
        </div>
        <div>
          <label for="packlist_type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select
            Type</label>
          <select v-model="packList.type" id="packlist_type"
                  class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white">
            <option disabled value="">Select Type</option>
            <option value="toiletries">Toiletries</option>
            <option value="electronics">Electronics</option>
            <option value="medication">Medication</option>
          </select>
        </div>
        <div class="text-right flex items-center space-x-2">
          <button type="button" @click="$emit('addPackListItem')"
                  class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Add
          </button>
        </div>
      </div>
    </div>

    <div class="button-container">
      <button @click="$emit('delete')"
              class="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
        Remove
      </button>
      <button @click="$emit('create')"
              type="submit"
              class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
        Create Entry
      </button>
      <button @click="$emit('close')"
              type="button"
              class="px-6 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700">
        Close
      </button>
    </div>
  </form>
</template>
