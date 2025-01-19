<script setup lang="ts">
// Here are just imports of functions, types and components
import {ref} from "vue";
import type {TravelEntry} from '@/types/models'
import TravelElement from '@/components/TravelEntry.vue'

// Reactive variables
const showForm = ref(false);
const showTravelEntryTypeSelection = ref(false);
const travelEntries = ref<TravelEntry[]>([]);
const newTravelEntry = ref<TravelEntry>({
  type: '',
  country: '',
  city: '',
  activities: '',
  food: [],
  firstAid: '',
  packingList: '',
  hotels: '',
});
const error = ref('')
const entryCreated = ref(false);
const showFoodInput = ref(false);
const food = ref('')
const currentEntryIndex = ref(-1);
const isEditing = ref(false);



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

function createEntry() {
  isEditing.value = false;
  // Get existing entries from localStorage
  const existingEntries = localStorage.getItem('travelEntries');

  // Parse the existing entries or initialize an empty array
  const travelEntries: TravelEntry[] = existingEntries ? JSON.parse(existingEntries) : [];

  // Check if the entry already exists based on a unique field, like country and city
  const entryExists = travelEntries.some(entry =>
      entry.country === newTravelEntry.value.country && entry.city === newTravelEntry.value.city
  );

  if (entryExists) {
    error.value = 'Entry already exists';
  } else {
    travelEntries.push(newTravelEntry.value);
    localStorage.setItem('travelEntries', JSON.stringify(travelEntries));
    loadTravelEntries();
    error.value = '';
    console.log('Entry added:', newTravelEntry.value);
  }

  if (!entryExists) {
    // If the entry does not exist, add the new entry
    travelEntries.push(newTravelEntry.value);

    // Save the updated array back to localStorage
    localStorage.setItem('travelEntries', JSON.stringify(travelEntries));

    // Load Entries again from LocalStorage
    loadTravelEntries();

    // Clear error
    error.value = ''

    console.log('Entry added:', newTravelEntry.value);
  } else {
    console.log('Entry already exists');
  }
  showForm.value = false;
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
function addNewFoodEntry() {
  // Add the transport value to newTravelEntry.transport array
  newTravelEntry.value.food.push(food.value);
  food.value = '';
  showFoodInput.value = false;
}

function togglefoodInput() {
  showFoodInput.value = !showFoodInput.value;
}
// Call the function when the component is mounted to load the entries
loadTravelEntries();
</script>

<template>
  <!-- This is the button to display the form for new entries -->
  <div class="entry-btn">
    <button v-if="!showForm && !showTravelEntryTypeSelection" @click="toggleTravelEntryTypeSelection" class="button1">Add Entry</button>
  </div>
  <div v-if="!showForm && showTravelEntryTypeSelection">
    <button @click="newTravelEntry.type = 'Holidays'; showForm = true; showTravelEntryTypeSelection" class="button1">Holidays</button>
    <button @click="newTravelEntry.type = 'Weekend Trips'; showForm = true" class="button1">Weekend Trips</button>
    <button @click="toggleTravelEntryTypeSelection" class="button1">Close</button>
  </div>


  <!-- This is the hidden form to create a new entry -->
  <div v-if="showForm && !showTravelEntryTypeSelection">
    <form id="addEntry" @submit.prevent="createEntry">
      <input v-model="newTravelEntry.country" type="text" name="country" placeholder="Country" class="titel" required>
      <input v-model="newTravelEntry.city"  type="text" name="city" placeholder="City/Island" class="titel" required>
      <textarea v-model="newTravelEntry.activities" name="activities" placeholder="Activities" rows="10" class="text"></textarea>
      <h2>Food</h2>
      <div>
        <button type="button" @click="showFoodInput = !showFoodInput">
          {{ showFoodInput ? "Close" : "Food" }}
        </button>
        <!-- List of Selected Food Items -->
        <ul v-if="newTravelEntry.food">
          <li v-for="food in newTravelEntry.food">{{food}}</li>
        </ul>
        <button type="button" @click="togglefoodInput">+</button>
        <input v-if="showFoodInput" v-model="showFoodInput" type="text" name="transport" placeholder="Food"/>
        <button v-if="showFoodInput" @click="addNewFoodEntry">Save</button>
      </div>
      <textarea v-model="newTravelEntry.firstAid" name="firstAid" placeholder="First Aid" rows="10" class="text"></textarea>
      <textarea v-model="newTravelEntry.packingList" name="careProducts" placeholder="Packing List" rows="10" class="text"></textarea>
      <textarea v-model="newTravelEntry.hotels" name="hotels" placeholder="Hotels" rows="10" class="text"></textarea>
      <button v-if="!isEditing" type="submit" class="create">Create Entry</button>
    </form>
    <button @click="showForm = !showForm" class="button1">Close Form</button>
    <button v-if="isEditing" @click="updateEntry" class="button1">Save</button>
  </div>

  <!-- Display Error -->
  <div v-if="error" class="error">
    {{error}}
  </div>

  <!-- Here is the output of all entries -->
  <div v-if="!showForm && !showTravelEntryTypeSelection">
    <h2 class="entries">Travel Entries</h2>
    <div v-if="travelEntries.length">
        <div v-for="(entry, index) in travelEntries" class="entry-container">
          <TravelElement :entry="entry"/>
          <div class="button-container">
            <button @click="editEntry(index)" class="edit">Edit</button>
            <button @click="deleteEntry(index)" class="delete">Delete</button>
          </div>
        </div>
    </div>
    <div v-else>
      <p>No travel entries found.</p>
    </div>
  </div>
</template>


