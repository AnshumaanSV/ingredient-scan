export interface HarmfulItem {
  itemName: string;
  description: string;
}

export interface ClassifierResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}
