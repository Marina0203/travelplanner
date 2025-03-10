export type TravelEntry = {
    type: string,
    country: string,
    city: string,
    activities: Array<Activity>,
    food: Array<Food>,
    packList: Array<PackList>,
}

type ActivitiesOption = "walking" | "beach" | "park" | "shopping" | "sightseeing" | "spa" | ""

export type Activity = {
    name: string,
    type: ActivitiesOption,
    liked: boolean,
}

type FoodOption = "cafe" | "restaurant" | "breakfast" | "street food" | "supermarket" | ""

export type Food = {
    name: string,
    type: FoodOption,
    liked: boolean,
}

type PackListOption = "toiletries" | "electronics" | "medication" | ""

export type PackList = {
    name: string,
    type: PackListOption,
    checked: boolean,
}

export type Hotels = {
    name: string,
    address: string,
    checkin: string,
    checkout: string,
}
