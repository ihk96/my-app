import { z } from "zod/v4";
import { APIClient } from "./api-client";
import type { AxiosResponse } from "axios";

export default {
	getFamilyPets: async function(familyId: string){
		const res: AxiosResponse<z.infer<typeof PetResponseData>[]> = await APIClient.get(`/families/${familyId}/pets`);

		return res;
	},
	createPet: async function(familyId: string, data: z.infer<typeof CreatePetRequestData>){
		const res: AxiosResponse<z.infer<typeof PetResponseData>> = await APIClient.post(`/families/${familyId}/pets`, data);

		return res;
	},
	getPet: async function(petId: string){
		const res: AxiosResponse<z.infer<typeof PetResponseData>> = await APIClient.get(`/pets/${petId}`);

		return res;
	},
	updatePet: async function(petId: string, data: z.infer<typeof UpdatePetRequestData>){
		const res: AxiosResponse<z.infer<typeof PetResponseData>> = await APIClient.put(`/pets/${petId}`, data);

		return res;
	},
	deletePet: async function(petId: string){
		const res: AxiosResponse<void> = await APIClient.delete(`/pets/${petId}`);

		return res;
	},
	getPetAdditionalInfo: async function(petId: string){
		const res: AxiosResponse<z.infer<typeof PetAdditionalInfoResponseData>[]> = await APIClient.get(`/pets/${petId}/additional-info`);

		return res;
	},
	savePetAdditionalInfo: async function(petId: string, data: z.infer<typeof PetAdditionalInfoInputData>[]){
		const res: AxiosResponse<z.infer<typeof PetAdditionalInfoResponseData>[]> = await APIClient.put(`/pets/${petId}/additional-info`, data);

		return res;
	},
	getPetCareItems: async function(petId: string){
		const res: AxiosResponse<z.infer<typeof PetCareItemResponseData>[]> = await APIClient.get(`/pets/${petId}/care/items`);

		return res;
	},
	createPetCareItem: async function(petId: string, data: z.infer<typeof CreatePetCareItemRequestData>){
		const res: AxiosResponse<z.infer<typeof PetCareItemWriteResponseData>> = await APIClient.post(`/pets/${petId}/care/items`, data);

		return res;
	},
	getPetCareItem: async function(itemId: string){
		const res: AxiosResponse<z.infer<typeof PetCareItemResponseData>> = await APIClient.get(`/pets/care/items/${itemId}`);

		return res;
	},
	updatePetCareItem: async function(itemId: string, data: z.infer<typeof UpdatePetCareItemRequestData>){
		const res: AxiosResponse<z.infer<typeof PetCareItemWriteResponseData>> = await APIClient.put(`/pets/care/items/${itemId}`, data);

		return res;
	},
	getPetCareItemSummary: async function(itemId: string){
		const res: AxiosResponse<z.infer<typeof PetCareItemSummaryResponseData>> = await APIClient.get(`/pets/care/items/${itemId}/summary`);

		return res;
	},
	createPetCareLog: async function(itemId: string, data: z.infer<typeof CreatePetCareLogRequestData>){
		const res: AxiosResponse<null> = await APIClient.post(`/pets/care/items/${itemId}/logs`, data);

		return res;
	},
	deletePetCareItem: async function(itemId: string){
		const res: AxiosResponse<null> = await APIClient.delete(`/pets/care/items/${itemId}`);

		return res;
	},
	deletePetCareLog: async function(logId: string){
		const res: AxiosResponse<null> = await APIClient.delete(`/pets/care/logs/${logId}`);

		return res;
	},
	getPetCareLog: async function(logId: string){
		const res: AxiosResponse<z.infer<typeof PetCareLogResponseData>> = await APIClient.get(`/pets/care/logs/${logId}`);

		return res;
	},
	getPetCareItemLogs: async function(itemId: string, start: string, end: string){
		const res: AxiosResponse<z.infer<typeof PetCareLogResponseData>[]> = await APIClient.get(`/pets/care/items/${itemId}/logs`, { params: { start, end } });

		return res;
	},
	getPetCareLogs: async function(petId: string, start: string, end: string){
		const res: AxiosResponse<z.infer<typeof PetCareLogResponseData>[]> = await APIClient.get(`/pets/${petId}/care/logs`, { params: { start, end } });

		return res;
	},
	getFamilyTodayCareItems: async function(familyId: string){
		const res: AxiosResponse<z.infer<typeof TodayPetCareItemResponseData>[]> = await APIClient.get(`/families/${familyId}/care/items/today`);

		return res;
	},
	updatePetCareLog: async function(logId: string, data: z.infer<typeof UpdatePetCareLogRequestData>){
		const res: AxiosResponse<z.infer<typeof PetCareLogResponseData>> = await APIClient.put(`/pets/care/logs/${logId}`, data);

		return res;
	},
}

export const PetResponseData = z.object({
	id: z.string(),
	name: z.string(),
	species: z.enum(["Dog", "Cat", "Lizard", "Bird", "Snake", "Hamster", "Turtle", "Other"]),
	birth_date: z.iso.date(),
	day_became_family: z.iso.date(),
	sex: z.enum(["Male", "Female", "Unknown"]),
	thumbnail: z.string(),
	original_image: z.string(),
	family_id: z.string(),
	created_at: z.iso.datetime(),
	updated_at: z.iso.datetime(),
	is_deleted: z.boolean(),
	deleted_at: z.iso.datetime().optional(),
});

export const CreatePetRequestData = z.object({
	name: z.string(),
	species: z.enum(["Dog", "Cat", "Lizard", "Bird", "Snake", "Hamster", "Turtle", "Other"]),
	birth_date: z.iso.date(),
	day_became_family: z.iso.date(),
	sex: z.enum(["Male", "Female", "Unknown"]),
	thumbnail: z.string(),
	original_image: z.string(),
});

export const UpdatePetRequestData = z.object({
	name: z.string(),
	species: z.enum(["Dog", "Cat", "Lizard", "Bird", "Snake", "Hamster", "Turtle", "Other"]),
	birth_date: z.iso.date(),
	day_became_family: z.iso.date(),
	sex: z.enum(["Male", "Female", "Unknown"]),
  original_image: z.string(),
	thumbnail: z.string(),
});

export const PetAdditionalInfoResponseData = z.object({
	id: z.string(),
	pet_id: z.string(),
	info: z.string(),
	order_num: z.number().int(),
});

export const PetAdditionalInfoInputData = z.object({
	info: z.string(),
	order_num: z.number().int(),
});

export const PetCareItemCycleData = z.object({
	interval: z.number().int(),
	interval_type: z.enum(["AfterDays", "Weeks", "Months"]),
	start_date: z.iso.date(),
	weekdays: z.array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])).optional(),
	monthdays: z.array(z.number().int()).optional(),
});

export const CreatePetCareItemRequestData = z.object({
	name: z.string(),
  emoji: z.string(),
	cycle_type: z.enum(["Anytime", "Regular"]),
	weekdays: z.array(z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])).optional(),
	monthdays: z.array(z.number().int()).optional(),
	start_date: z.iso.date().optional(),
	interval_type: z.enum(["AfterDays", "Weeks", "Months"]).optional(),
	interval: z.number().int().optional(),
});

export const UpdatePetCareItemRequestData = CreatePetCareItemRequestData;

export const PetCareItemResponseData = z.object({
	family_name: z.string(),
	id: z.string(),
	created_at: z.iso.datetime(),
	cycle_type: z.enum(["Anytime", "Regular"]),
	is_deleted: z.boolean(),
	cycle: PetCareItemCycleData.optional(),
	creator_id: z.string(),
	target_pet_name: z.string(),
  emoji: z.string(),
	name: z.string(),
	family_id: z.string(),
	creator_name: z.string(),
	deleted_at: z.iso.datetime().optional(),
	updated_at: z.iso.datetime(),
	target_pet_id: z.string(),
});

export const PetCareItemWriteResponseData = z.object({
	family_name: z.string(),
	id: z.string(),
	created_at: z.iso.datetime(),
	cycle_type: z.enum(["Anytime", "Regular"]),
	is_deleted: z.boolean(),
	creator_id: z.string(),
	target_pet_name: z.string(),
  emoji: z.string(),
	name: z.string(),
	family_id: z.string(),
	interval_type: z.enum(["AfterDays", "Weeks", "Months"]).optional(),
	creator_name: z.string(),
	start_date: z.iso.date().optional(),
	interval: z.number().int().optional(),
	deleted_at: z.iso.datetime().optional(),
	updated_at: z.iso.datetime(),
	target_pet_id: z.string(),
});

export const CreatePetCareLogRequestData = z.object({
	memo: z.string(),
	performed_at: z.string(),
});

export const UpdatePetCareLogRequestData = CreatePetCareLogRequestData;

export const PetCareLogResponseData = z.object({
	id: z.string(),
	pet_care_item_id: z.string(),
	pet_care_item_name: z.string(),
  pet_care_item_emoji: z.string(),
	target_pet_id: z.string(),
	target_pet_name: z.string(),
	performed_at: z.string(),
	created_at: z.iso.datetime(),
	updated_at: z.iso.datetime(),
	memo: z.string(),
	creator_id: z.string(),
	creator_name: z.string(),
});

export const PetCareItemSummaryResponseData = z.object({
	pet_care_item_id: z.string(),
	name: z.string(),
	last_care_log: z.object({
		log_id: z.string(),
		performed_at: z.string(),
	}).optional(),
	next_care_date: z.iso.date().optional(),
	this_month_logs_count: z.number().int(),
});

export const TodayPetCareItemResponseData = z.object({
	id: z.string(),
	family_id: z.string(),
	family_name: z.string(),
	name: z.string(),
  emoji: z.string(),
	creator_id: z.string(),
	creator_name: z.string(),
	created_at: z.iso.datetime(),
	updated_at: z.iso.datetime(),
	cycle_type: z.enum(["Anytime", "Regular"]),
	target_pet_id: z.string(),
	target_pet_name: z.string(),
	interval: z.number().int().optional(),
	interval_type: z.enum(["AfterDays", "Weeks", "Months"]).optional(),
	last_care_at: z.iso.datetime({ local: true }).optional(),
});
