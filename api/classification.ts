import { ClassifierResponse, HarmfulItem } from "@/constants/types";
import {
  harmfulItemPostProcessing,
  harmfulItemPreProcessing,
} from "@/core/openai";
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

export const fetchHarmfulItems = async (
  category: string,
  items: string,
): Promise<HarmfulItem[] | null> => {
  const { classifierPayload } = harmfulItemPreProcessing(category, items);

  try {
    const response = await client.responses.create(classifierPayload);

    return harmfulItemPostProcessing(response.output_text);
  } catch (error) {
    return null;
  }
};
