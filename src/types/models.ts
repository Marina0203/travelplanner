export type TravelEntry = {
    type: string,
    country: string,
    city: string,
    activities: string,
    food: Array<Food>,
    firstAid: string,
    packingList: string
    hotels: string
}

type FoodOption ="cafe" | "restaurant" | "breakfast" | "street food" | "supermarket"

export type Food = {
    name: string,
    type: FoodOption,
}
