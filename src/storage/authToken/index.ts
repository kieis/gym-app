import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_COLLECTION } from "@storage/config";

export async function get(): Promise<string | null> {
  try {
    const collection = await AsyncStorage.getItem(AUTH_TOKEN_COLLECTION);
    return collection;
  } catch (err) {
    throw err;
  }
}

export async function set(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_COLLECTION, token);
  } catch (err) {
    throw err;
  }
}

export async function remove(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_COLLECTION);
  } catch (err) {
    throw err;
  }
}