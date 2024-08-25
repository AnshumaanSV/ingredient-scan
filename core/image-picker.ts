
import * as ImagePicker from "expo-image-picker";

export const imagePicker = async (): Promise<string> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    } 

    return "";
  };