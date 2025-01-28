<script setup lang="ts">
// Here are just imports of functions, types and components
import {ref} from "vue";
import type {Activities, Food, TravelEntry, PackList} from '@/types/models'
import TravelElement from '@/components/TravelEntry.vue'

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
  hotels: [],
});
const error = ref('')
const entryCreated = ref(false);
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
const showHotelsInput = ref(false);
const hotels = ref({
  name: '',
  address: '',
  checkin: '',
  checkout: '',
});
const currentEntryIndex = ref(-1);
const isEditing = ref(false);
const currentStep = ref(1);

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

  if (!entryExists) {
    // If the entry does not exist, add the new entry
    travelEntries.push(newTravelEntry.value);

    // Save the updated array back to localStorage
    localStorage.setItem('travelEntries', JSON.stringify(travelEntries));

    // Load Entries again from LocalStorage
    loadTravelEntries();
    resetNewEntry();

    // Clear error
    error.value = ''

    console.log('Entry added:', newTravelEntry.value);
  } else {
    console.log('Entry already exists');
  }
  showForm.value = false;
}

function resetNewEntry() {
  newTravelEntry.value = {
    type: '',
    country: '',
    city: '',
    activities: [],
    food: [],
    packList: [],
    hotels: [],
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

function addHotelItem() {
  if (!hotels.value.name || !hotels.value.address || !hotels.value.checkin || !hotels.value.checkout) {
    return;
  }
  newTravelEntry.value.hotels.push({
    name: hotels.value.name,
    address: hotels.value.address,
    checkin: hotels.value.checkin,
    checkout: hotels.value.checkout,
  });
  hotels.value = {
    name: '',
    address: '',
    checkin: '',
    checkout: '',
  };
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

function toggleHotelsInput() {
  showHotelsInput.value = !showHotelsInput.value;
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
    <button @click="newTravelEntry.type = 'Holidays'; showForm = true; showTravelEntryTypeSelection = false; resetNewEntry();" class="button1">Holidays</button>
    <button @click="newTravelEntry.type = 'Weekend Trips'; showForm = true; showTravelEntryTypeSelection = false; resetNewEntry();" class="button1">Weekend Trips</button>
    <button @click="toggleTravelEntryTypeSelection" class="button1">Close</button>
  </div>


  <!-- This is the hidden form to create a new entry -->
  <div v-if="showForm && !showTravelEntryTypeSelection">
    <form id="addEntry" @submit.prevent="createEntry">
      <input v-model="newTravelEntry.type" type="text" name="type" placeholder="" class="titel" readonly>
      <input v-model="newTravelEntry.country" type="text" name="country" placeholder="Country" class="titel" required>
      <input v-model="newTravelEntry.city"  type="text" name="city" placeholder="City/Island" class="titel" required>
      <h2>Activities</h2>
      <div>
        <button type="button" @click="showActivitiesInput = !showActivitiesInput">
          {{ showActivitiesInput ? "Close" : "Add" }}
        </button>
        <ul v-if="showActivitiesInput">
          <input v-model="activities.name" type="text" name="activity" placeholder="Activity Name"/>
          <select v-model="activities.type">
            <option disabled value="">Select Type</option>
            <option value="Walking">Walking</option>
            <option value="Beach">Beach</option>
            <option value="Park">Park</option>
            <option value="Shopping">Shopping</option>
            <option value="Sightseeing">Sightseeing</option>
            <option value="Spa">Spa</option>
          </select>
          <button type="button" @click="addActivityItem" class="add">Add</button>
          <!-- Display Activities -->
          <ul>
            <li v-for="(item, index) in newTravelEntry.activities" :key="index">
              <span>{{ item.name }} ({{ item.type }})</span>
              <button @click="toggleActivityLike(index)" class="like-button">
                {{ item.liked ? "Unlike" : "Like" }}
              </button>
            </li>
          </ul>
        </ul>
      </div>
      <h2>Food</h2>
      <div>
        <button type="button" @click="showFoodInput = !showFoodInput">
          {{ showFoodInput ? "Close" : "Add" }}
        </button>
        <!-- List of Selected Food Items -->
        <ul v-if="showFoodInput">
          <input v-model="food.name" type="text" name="food" placeholder="Food"/>
          <select v-model="food.type">
            <option disabled value="">Select Type</option>
            <option value="cafe">Cafe</option>
            <option value="restaurant">Restaurant</option>
            <option value="breakfast">Breakfast</option>
            <option value="street food">Street Food</option>
            <option value="supermarket">Supermarket</option>
          </select>
          <button type="button" @click="addFoodItem" class="add">Add</button>
          <!-- Display Food Items -->
          <ul style="margin-top: 2rem;">
            <li v-for="(item, index) in newTravelEntry.food" :key="index">
              <span>{{ item.name }} ({{ item.type }})</span>
              <button @click="toggleFoodLike(index)" class="like-button">
                {{ item.liked ? "Unlike" : "Like" }}
              </button>
              <button @click="deleteFoodItem(index)">Delete</button>
            </li>
          </ul>
        </ul>
      </div>
      <h2>PackList</h2>
      <div>
        <button type="button" @click="showPackListInput = !showPackListInput">
          {{ showPackListInput ? "Close" : "Add" }}
        </button>
        <!-- List of Selected Food Items -->
        <ul v-if="showPackListInput">
          <input v-model="packList.name" type="text" name="packList" placeholder="PackList"/>
          <select v-model="packList.type">
            <option disabled value="">Select Type</option>
            <option value="toiletries">Toiletries</option>
            <option value="electronics">Electronics</option>
            <option value="medication">Medication</option>
          </select>
          <button type="button" @click="addPackListItem" class="add">Add</button>
          <!-- Display Food Items -->
          <ul>
            <li v-for="(item, index) in newTravelEntry.packList" :key="index">
              <span>{{ item.name }} ({{ item.type }})</span>
              <button @click="" class="like-button">
                {{ item.checked ? "Unlike" : "Checked" }}
              </button>
            </li>
          </ul>
        </ul>
      </div>
      <h2>Hotels</h2>
      <div>
        <!-- Button to toggle the form -->
        <button type="button" @click="showHotelsInput = !showHotelsInput">
          {{ showHotelsInput ? "Close" : "Add Hotel" }}
        </button>

        <!-- Form to add hotels -->
        <div v-if="showHotelsInput">
          <input
              v-model="hotels.name"
              type="text"
              placeholder="Hotel Name"
          />
          <input
              v-model="hotels.address"
              type="text"
              placeholder="Hotel Address"
          />
          <input
              v-model="hotels.checkin"
              type="text"
              placeholder="Check-in Time (e.g., 12:00 PM)"
          />
          <input
              v-model="hotels.checkout"
              type="text"
              placeholder="Check-out Time (e.g., 11:00 AM)"
          />
          <button type="button" @click="addHotelItem" class="add">
            Add Hotel
          </button>
        </div>

        <!-- Display List of Hotels -->
        <ul>
          <li v-for="(item, index) in newTravelEntry.hotels" :key="index">
          <span>
            <strong>Name:</strong> {{ item.name }} <br />
            <strong>Address:</strong> {{ item.address }} <br />
            <strong>Check-in:</strong> {{ item.checkin }} <br />
            <strong>Check-out:</strong> {{ item.checkout }}
          </span>
            <button
                @click=""
                class="remove-button">
              Remove
            </button>
          </li>
        </ul>
      </div>



      <button v-if="!isEditing" type="submit" class="create">Create Entry</button>
    </form>
    <button @click="showForm = !showForm; resetNewEntry();" class="button1">Close Form</button>
    <button v-if="isEditing" @click="updateEntry" class="button1">Save</button>
  </div>

  <!-- Display Error -->
  <div v-if="error" class="error">
    {{error}}
  </div>

  <!-- Here is the output of all entries -->
  <div v-if="!showForm && !showTravelEntryTypeSelection">
    <h2 class="entries">Holidays</h2>
    <div v-if="travelEntries.length">
        <div v-for="(entry, index) in travelEntries" class="entry-container">
          <template v-if="entry.type == 'Holidays'">
            <TravelElement :entry="entry"/>
            <div class="button-container">
              <button @click="editEntry(index)" class="edit">Edit</button>
              <button @click="deleteEntry(index)" class="delete">Delete</button>
            </div>
          </template>
        </div>
      <h2 class="entries">Weekend Trips</h2>
      <div v-for="(entry, index) in travelEntries" class="entry-container">
        <template v-if="entry.type == 'Weekend Trips'">
          <TravelElement :entry="entry"/>
          <div class="button-container">
            <button @click="editEntry(index)" class="edit">Edit</button>
            <button @click="deleteEntry(index)" class="delete">Delete</button>
          </div>
        </template>
      </div>
    </div>
    <div v-else>
      <p>No travel entries found.</p>
    </div>
  </div>
</template>


