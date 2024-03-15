import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_COLLECTION } from "@storage/config";
import { AppError } from "@utils/AppError";
import { UserDTO } from "@dtos/UserDTO";

export async function get(): Promise<UserDTO | null> {
  try {
    const collection = await AsyncStorage.getItem(USER_COLLECTION);
    return collection ? JSON.parse(collection) : null;
  } catch (err) {
    throw err;
  }
}

export async function set(user: UserDTO): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(user));
  } catch (err) {
    throw err;
  }
}

export async function remove(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_COLLECTION);
  } catch (err) {
    throw err;
  }
}