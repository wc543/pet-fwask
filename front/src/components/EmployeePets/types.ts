export interface Pet {
    pet_id: number;
    name: string;
    type: string;
    breed: string;
    size: number;
    gender: string;
    age: number;
    color: string;
    created_by_id: number;
    fosterable: boolean;
    pet_image_url: string;
    shelter_time: Date;
    current_foster: number;
    current_adopter: number;
    note: string;
}