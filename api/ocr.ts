import axios from "axios";
import { EncodingType, readAsStringAsync } from "expo-file-system";

interface OCRResponse {
    responses: Array<{
        textAnnotations: Array<{
            description: string;
        }>
    }>
}

export const imageToText = async (imageUri: string): Promise<string | null> => {
    const base64Image = await readAsStringAsync(imageUri, {
        encoding: EncodingType.Base64,
      });

      const ocrEndpoint =
      `${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_VISION_URL}?key=${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY}`;

      const ocrPayload = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: "TEXT_DETECTION",
              },
            ],
          },
        ],
      };

      try {
        const response = await axios.post(ocrEndpoint, ocrPayload);
        return (response.data as OCRResponse).responses[0].textAnnotations[0].description;
      } catch (error) {
        return null;
      }
}