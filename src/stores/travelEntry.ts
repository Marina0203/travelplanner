import {ref} from 'vue'
import {defineStore} from 'pinia'
import type {Activity, Food, PackList, TravelEntry} from "@/types/models";

export const useTravelEntryStore = defineStore('travelEntryStore', () => {
    const travelEntries = ref<TravelEntry[]>([]);
    const travelEntry = ref<TravelEntry>({
        type: '',
        country: '',
        city: '',
        activities: [],
        food: [],
        packList: [],
    });
    const activity = ref<Activity>({
        name: '',
        type: '',
        liked: false,
    })
    const food = ref<Food>({
        name: '',
        type: '',
        liked: false,
    });
    const packList = ref<PackList>({
        name: '',
        type: '',
        checked: false,
    });
    const error = ref('');
    const showForm = ref(false);

    function loadTravelEntries() {
        const storedEntries = localStorage.getItem('travelEntries');
        storedEntries ? setTravelEntries(JSON.parse(storedEntries) as TravelEntry[]) : setTravelEntries([]);
        return storedEntries;
    }

    function setTravelEntries(newTravelEntries: TravelEntry[]) {
        travelEntries.value = newTravelEntries;
    }

    function editTravelEntry(index: number) {
        resetError();
        travelEntry.value = travelEntries.value[index];
    }

    function setTravelEntry(newTravelEntry: TravelEntry) {
        travelEntry.value = newTravelEntry;
    }

    function resetTravelEntry() {
        error.value = '';
        travelEntry.value = {
            type: '',
            country: '',
            city: '',
            activities: [],
            food: [],
            packList: [],
        };
    }

    function createTravelEntry(newTravelEntry: TravelEntry) {
        if (!newTravelEntry.country || !newTravelEntry.city) {
            error.value = 'Please enter a country and a city';
            return;
        }

        resetError();

        // Get existing entries from localStorage
        const existingEntries = loadTravelEntries();

        // Parse the existing entries or initialize an empty array
        const travelEntries: TravelEntry[] = existingEntries ? JSON.parse(existingEntries) : [];

        // Check if the entry already exists based on a unique field, like country and city
        const entryExists = travelEntries.some(entry =>
            entry.country === travelEntry.value.country && entry.city === travelEntry.value.city
        );

        if (!entryExists) {
            // If the entry does not exist, add the new entry
            travelEntries.push(travelEntry.value);

            // Save the updated array back to localStorage
            localStorage.setItem('travelEntries', JSON.stringify(travelEntries));

            // reset the current entry
            resetTravelEntry();
        } else {
            // If the entry already exists, update the existing entry
            updateTravelEntry(travelEntries.findIndex(entry =>
                entry.country === travelEntry.value.country && entry.city === travelEntry.value.city))
        }
        toggleShowForm();
    }

    function updateTravelEntry(index: number) {
        // Update the entry in the travelEntries array
        travelEntries.value[index] = travelEntry.value;

        // Update localStorage
        localStorage.setItem('travelEntries', JSON.stringify(travelEntries.value));

        // Load Entries again from LocalStorage
        loadTravelEntries();
    }

    function deleteTravelEntry(index: number) {
        // Remove the entry from the travelEntries array
        travelEntries.value.splice(index, 1);

        // Update localStorage
        localStorage.setItem('travelEntries', JSON.stringify(travelEntries.value));

        // reset the current entry
        resetTravelEntry();
    }

    function setActivity(newActivity: Activity) {
        activity.value = newActivity;
        addActivityToTravelEntry();
    }

    function deleteActivity(index: number) {
        travelEntry.value.activities.splice(index, 1);
        resetActivity();
    }

    function resetActivity() {
        activity.value = {
            name: '',
            type: '',
            liked: false,
        }
    }

    function addActivityToTravelEntry() {
        travelEntry.value.activities.push(activity.value);
        resetActivity();
    }

    function setFood(newFood: Food) {
        food.value = newFood;
        addFoodToTravelEntry();
    }

    function deleteFood(index: number) {
        travelEntry.value.food.splice(index, 1);
        resetFood();
    }

    function resetFood() {
        food.value = {
            name: '',
            type: '',
            liked: false,
        }
    }

    function addFoodToTravelEntry() {
        travelEntry.value.food.push(food.value);
        resetFood();
    }

    function setPackList(newPackList: PackList) {
        packList.value = newPackList;
        addPackListToTravelEntry();
    }

    function deletePackList(index: number) {
        travelEntry.value.packList.splice(index, 1);
        resetPackList();
    }

    function resetPackList() {
        packList.value = {
            name: '',
            type: '',
            checked: false,
        }
    }

    function addPackListToTravelEntry() {
        travelEntry.value.packList.push(packList.value);
        resetPackList();
    }

    function setTravelEntryType(type: string) {
        travelEntry.value.type = type;
    }

    function resetError() {
        error.value = '';
    }

    function toggleShowForm() {
        showForm.value = !showForm.value;
    }


    return {
        travelEntries,
        travelEntry,
        activity,
        food,
        packList,
        error,
        showForm,
        setTravelEntries,
        setTravelEntry,
        editTravelEntry,
        resetTravelEntry,
        createTravelEntry,
        updateTravelEntry,
        deleteTravelEntry,
        setTravelEntryType,
        setActivity,
        deleteActivity,
        resetActivity,
        addActivityToTravelEntry,
        setFood,
        deleteFood,
        resetFood,
        addFoodToTravelEntry,
        setPackList,
        deletePackList,
        resetPackList,
        addPackListToTravelEntry,
        loadTravelEntries,
        toggleShowForm,
        resetError
    }
})
