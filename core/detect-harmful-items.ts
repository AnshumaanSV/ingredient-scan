import { fetchHarmfulItems } from "@/api/classification";
import { imageToText } from "@/api/ocr";
import { HarmfulItem } from "@/constants/types";

export const detectHarmfulItems = async (image: string, category: string): Promise<HarmfulItem[] | null> => {
    const imageText = await imageToText(image);
    if (!imageText) {
      return null;
    }

    const harmfulItems = await fetchHarmfulItems(category, imageText);
    if (!harmfulItems) {
      return null;
    }

    return harmfulItems;
}