import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_COLLECTION } from "@storage/config";

type AuthTokenProps = {
  token: string;
  refresh_token: string;
};

export async function get(): Promise<AuthTokenProps | null> {
  try {
    const collection = await AsyncStorage.getItem(AUTH_TOKEN_COLLECTION);
    return collection ? JSON.parse(collection) : null;
  } catch (err) {
    throw err;
  }
}

export async function set({
  token,
  refresh_token,
}: AuthTokenProps): Promise<void> {
  try {
    await AsyncStorage.setItem(
      AUTH_TOKEN_COLLECTION,
      JSON.stringify({ token, refresh_token })
    );
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
