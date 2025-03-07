<script setup lang="ts">
// Here are just imports of functions, types and components
import {ref} from "vue";
import type {Activities, Food, TravelEntry, PackList} from '@/types/models'
import TravelElement from '@/components/TravelEntry.vue'
import {computed} from "vue";
import TravelEntryForm from "@/components/TravelEntryForm.vue";

// Reactive variables
const showForm = ref(false);
const showTravelEntryTypeSelection = ref(false);
const travelEntries = ref<TravelEntry[]>([]);
const newTravelEntry = ref<TravelEntry>({
  type: '',
  country: '',
  city: '',
  activities: [],
  food: [],
  packList: [],
});
const showActivitiesInput = ref(false);
const activities = ref<Activities>({
  name: '',
  type: '',
  liked: false,
})
const showFoodInput = ref(false);
const food = ref<Food>({
  name: '',
  type: '',
  liked: false,
});
const showPackListInput = ref(false);
const packList = ref<PackList>({
  name: '',
  type: '',
  checked: false,
});
const currentEntryIndex = ref(-1);
const isEditing = ref(false);
const currentStep = ref(1);
const sortedActivities = computed(() => {
  return newTravelEntry.value.activities.slice().sort((a, b) => {
    // Sort by category (type)
    const categoryComparison = a.type.localeCompare(b.type);
    if (categoryComparison !== 0) return categoryComparison;

    // If categories are the same, sort by name
    return a.name.localeCompare(b.name);
  });
});
const sortedFood = computed(() => {
  return newTravelEntry.value.food.slice().sort((a, b) => {
    // Sort by type first
    const typeComparison = a.type.localeCompare(b.type);
    if (typeComparison !== 0) return typeComparison;

    // If types are the same, sort by name
    return a.name.localeCompare(b.name);
  });
});
const sortedPackList = computed(() => {
  return newTravelEntry.value.packList.slice().sort((a, b) => {
    // Sort by type first
    const typeComparison = a.type.localeCompare(b.type);
    if (typeComparison !== 0) return typeComparison;

    // If types are the same, sort by name
    return a.name.localeCompare(b.name);
  });
});


function goToStep(step: number) {
  currentStep.value = step;
}

// Function to retrieve all travel entries from localStorage
function loadTravelEntries() {
  const storedEntries = localStorage.getItem('travelEntries');
  travelEntries.value = storedEntries ? JSON.parse(storedEntries) as TravelEntry[] : [];

  if (storedEntries) {
    travelEntries.value = JSON.parse(storedEntries) as TravelEntry[];

    // Group storedEntries by country

    console.log('Loaded entries:', travelEntries.value);
  } else {
    console.log('No entries found in localStorage.');
  }
}

function toggleTravelEntryTypeSelection() {
  showTravelEntryTypeSelection.value = !showTravelEntryTypeSelection.value;

}



function resetNewEntry() {
  newTravelEntry.value = {
    type: '',
    country: '',
    city: '',
    activities: [],
    food: [],
    packList: [],
  };
}
function createEntry() {
  // Get existing entries from localStorage
  const existingEntries = localStorage.getItem('travelEntries');

  // Parse the existing entries or initialize an empty array
  const travelEntries: TravelEntry[] = existingEntries ? JSON.parse(existingEntries) : [];

  // Check if the entry already exists based on a unique field, like country and city
  const entryExists = travelEntries.some(entry =>
      entry.country === newTravelEntry.value.country && entry.city === newTravelEntry.value.city
  );

  if (!entryExists) {
    // If the entry does not exist, add the new entry
    travelEntries.push(newTravelEntry.value);

    // Save the updated array back to localStorage
    localStorage.setItem('travelEntries', JSON.stringify(travelEntries));

    // Load Entries again from LocalStorage
    loadTravelEntries();
    resetNewEntry();
  } else {
    console.log('Entry already exists');
  }
}
function addFoodItem() {
  if (!food.value.name || !food.value.type) {
    return;
  }
  newTravelEntry.value.food.push({
    name: food.value.name,
    type: food.value.type,
    liked: false,
  });
  food.value = {
    name: '',
    type: '',
    liked: false,
  };
}

function editEntry(index: number) {
  // Retrieve entry with given index from travelEntries array and assign it to newTravelEntry
  newTravelEntry.value = travelEntries.value[index];
  showForm.value = true;
  currentEntryIndex.value = index;
  isEditing.value = true;
}

function deleteEntry(index: number) {
  // Remove the entry from the travelEntries array
  travelEntries.value.splice(index, 1);

  // Update localStorage
  localStorage.setItem('travelEntries', JSON.stringify(travelEntries.value));

  console.log('Entry deleted:', index);
}

function updateEntry() {
  // Update the entry in the travelEntries array
  travelEntries.value[currentEntryIndex.value] = newTravelEntry.value;

  // Update localStorage
  localStorage.setItem('travelEntries', JSON.stringify(travelEntries.value));

  // Load Entries again from LocalStorage
  loadTravelEntries();

  // Clear error
  error.value = ''

  showForm.value = false;
  currentEntryIndex.value = -1;

}

function addFoodItem() {
  if (!food.value.name || !food.value.type) {
    return;
  }
  newTravelEntry.value.food.push({
    name: food.value.name,
    type: food.value.type,
    liked: false,
  });
  food.value = {
    name: '',
    type: '',
    liked: false,
  };
}

function deleteFoodItem(index: number) {
  newTravelEntry.value.food.splice(index, 1);
}

function addActivityItem() {
  if (!activities.value.name || !activities.value.type) {
    return;
  }

  // Ensure activities is an array
  if (!Array.isArray(newTravelEntry.value.activities)) {
    newTravelEntry.value.activities = [];
  }

  newTravelEntry.value.activities.push({
    name: activities.value.name,
    type: activities.value.type,
    liked: false,
  });
  activities.value = {
    name: '',
    type: '',
    liked: false,
  };
}

function deleteActivityItem(index: number) {
  newTravelEntry.value.activities.splice(index, 1);
}

function addPackListItem() {
  if (!packList.value.name || !packList.value.type) {
    return;
  }

  // Ensure packList exists and is an array
  if (!Array.isArray(newTravelEntry.value.packList)) {
    newTravelEntry.value.packList = []; // Initialize as an array
  }

  newTravelEntry.value.packList.push({
    name: packList.value.name,
    type: packList.value.type,
    checked: false,
  });

  packList.value = {
    name: '',
    type: '',
    checked: false,
  };
}

function deletePackListItem(index: number) {
  newTravelEntry.value.packList.splice(index, 1);
}

function toggleActivityLike(index: number) {
  newTravelEntry.value.activities[index].liked = !newTravelEntry.value.activities[index].liked;
}

function toggleFoodLike(index: number) {
  newTravelEntry.value.food[index].liked = !newTravelEntry.value.food[index].liked;
}

function toggleFoodInput() {
  showFoodInput.value = !showFoodInput.value;
}

function toggleActivitiesInput() {
  showActivitiesInput.value = !showActivitiesInput.value;
}

function togglePackListInput() {
  showPackListInput.value = !showPackListInput.value;
}


// Call the function when the component is mounted to load the entries
loadTravelEntries();
</script>

<template>
  <div class="dark dark:bg-gray-800 dark:text-white w-full h-screen py-8">
    <div class="container">



      <!-- This is the button to display the form for new entries -->

        <button v-if="!showForm && !showTravelEntryTypeSelection" @click="toggleTravelEntryTypeSelection"
                class="button1">Add Entry
        </button>

      <div class="button-container" v-if="!showForm && showTravelEntryTypeSelection">
        <button
            @click="newTravelEntry.type = 'Holidays'; showForm = true; showTravelEntryTypeSelection = false; resetNewEntry();"
            class="button1">Holidays
        </button>
        <button
            @click="newTravelEntry.type = 'Weekend Trips'; showForm = true; showTravelEntryTypeSelection = false; resetNewEntry();"
            class="button1">Weekend Trips
        </button>
        <button @click="toggleTravelEntryTypeSelection" class="button1">Close</button>
      </div>

      <TravelEntryForm v-if="isEditing" @close="isEditing != isEditing" />


      <!-- Here is the output of all entries -->
      <div v-if="!showForm && !showTravelEntryTypeSelection">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Holidays</h2>
        <div v-if="travelEntries.length">
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <template v-for="(entry, index) in travelEntries">
              <TravelElement v-if="entry.type === 'Holidays'"
                             @edit="editEntry(index)"
                             @delete="deleteEntry(index)"
                             :entry="entry" />
            </template>
          </ul>

          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mt-4">Weekend Trips</h2>
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <template v-for="(entry, index) in travelEntries">
              <TravelElement v-if="entry.type === 'Weekend Trips'"
                             @edit="editEntry(index)"
                             @delete="deleteEntry(index)"
                             :entry="entry" />
            </template>
          </ul>
        </div>
        <div v-else>
          <p class="text-sm text-gray-500 dark:text-gray-400">No travel entries found.</p>
        </div>
      </div>
    </div>
  </div>
</template>


