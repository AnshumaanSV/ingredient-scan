const LIST_ITEM_DELIMITER = "(SPLIT_LI_HERE)";
const DESCRIPTION_DELIMITER = ":::";

export const harmfulItemPreProcessing = (category: string, items: string) => {
  const prompt = `Here is an ingredient item for a/an ${category}. List all the unhealthy ingredients from this list and provide a one-liner explanation of why each ingredient is harmful. Format each item as follows: item_name${DESCRIPTION_DELIMITER} description. Separate each item with ${LIST_ITEM_DELIMITER}. If you cannot provide the list, respond with "Please try again."
    Ingredients: ${items}`;

  const classifierPayload = {
    model: "gpt-4o-mini",
    input: prompt,
  };

  return { classifierPayload };
};

export const harmfulItemPostProcessing = (aiResponse: string) => {
  const substances = aiResponse.split(LIST_ITEM_DELIMITER);

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
};
