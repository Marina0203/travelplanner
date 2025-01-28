export type TravelEntry = {
    type: string,
    country: string,
    city: string,
    activities: Array<Activities>,
    food: Array<Food>,
    packList: Array<PackList>,
    hotels: Array<Hotels>,
}

type ActivitiesOption = "walking" | "beach" | "park" | "shopping" | "sightseeing" | "spa" | ""

export type Activities = {
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