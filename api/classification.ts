import { ClassifierResponse, HarmfulItem } from "@/constants/types";
import {
  harmfulItemPostProcessing,
  harmfulItemPreProcessing,
} from "@/core/openai";
import axios from "axios";

export const fetchHarmfulItems = async (
  category: string,
  items: string,
): Promise<HarmfulItem[] | null> => {
  const { classifierEnpoint, classifierPayload, classifierHeader } =
    harmfulItemPreProcessing(category, items);

  try {
    const response: ClassifierResponse = await axios.post(
      classifierEnpoint,
      classifierPayload,
      classifierHeader,
    );

    return harmfulItemPostProcessing(response);
  } catch (error) {
    return null;
  }
};
