import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from "native-base";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const PHOTO_SIZE = 33;

export function Profile() {
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [userPhotoUri, setUserPhotoUri] = useState(
    "https://github.com/kieis.png"
  );

  const toast = useToast();

  async function handleSelectUserPhoto() {
    setIsPhotoLoading(true);

    try {
      const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (selectedPhoto.canceled) {
        return;
      }

      const photoUri = selectedPhoto.assets[0].uri;
      const photoInfo = await FileSystem.getInfoAsync(photoUri);

      if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 5) {
        return toast.show({
          title: "This image is so big, choose another max 5MB.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      setUserPhotoUri(photoUri);
    } catch (error) {
      console.log(error);
    } finally {
      setIsPhotoLoading(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Profile" />

      <ScrollView>
        <Center mt={6} px={10}>
          {isPhotoLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={{ uri: userPhotoUri }}
              alt="User photo"
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity onPress={handleSelectUserPhoto}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Change photo
            </Text>
          </TouchableOpacity>
        </Center>

        <VStack px={10}>
          <Input placeholder="Name" bg="gray.600" />
          <Input placeholder="Email" bg="gray.600" isDisabled />
        </VStack>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2} fontFamily="heading">
            Change password
          </Heading>

          <Input bg="gray.600" placeholder="Old password" secureTextEntry />
          <Input bg="gray.600" placeholder="New password" secureTextEntry />
          <Input
            bg="gray.600"
            placeholder="Confirm new password"
            secureTextEntry
          />

          <Button title="Update" mt={4} />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
