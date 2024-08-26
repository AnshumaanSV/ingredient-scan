import { HarmfulItem } from "@/constants/types";
import axios from "axios";

interface ClassifierResponse {
    choices: Array<
    {
        message: {
            content: string;
        }
    }>
}

const LIST_ITEM_DELIMITER = "(SPLIT_LI_HERE)"
const DESCRIPTION_DELIMITER = ":::"

export const fetchHarmfulItems = async (category:string, items: string): Promise<HarmfulItem[] | null> => {
    const prompt = `Here is an ingredient item for a/an ${category}. List all the unhealthy ingredients from this list and provide a one-liner explanation of why each ingredient is harmful. Format each item as follows: item_name${DESCRIPTION_DELIMITER} description. Separate each item with ${LIST_ITEM_DELIMITER}. If you cannot provide the list, respond with "Please try again."
    Ingredients: ${items}`;

    const classifierEnpoint = process.env.EXPO_PUBLIC_OPENAI_URL as string;
 
    const classifierPayload = {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      };

    const classifierHeader = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_KEY}`,
      },
    };

    try {
      const response = await axios.post(
        classifierEnpoint,
        classifierPayload,
        classifierHeader
      );

      const substanceString = (response.data as ClassifierResponse).choices[0].message.content;
      const substances = substanceString.split(LIST_ITEM_DELIMITER);

      let isResponseMalformed = false;

      const harmfulSubstances = substances.map((substance) => {
        const [itemName, description] = substance.split(DESCRIPTION_DELIMITER);

        if (!itemName || !description) isResponseMalformed = true;

        return {
          itemName: itemName.trim(),
          description: description.trim(),
        };
      });

      return isResponseMalformed ? null : harmfulSubstances;
    } catch (error) {
        return null;
    }

}