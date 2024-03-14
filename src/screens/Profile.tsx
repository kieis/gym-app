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
} from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

const PHOTO_SIZE = 33;

export function Profile() {
  const [isPhotoLoading, setIsPhotoLoading] = useState(true);

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
              source={{ uri: "https://github.com/kieis.png" }}
              alt="User photo"
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity>
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

          <Input placeholder="Name" bg="gray.600" />
          <Input placeholder="Email" bg="gray.600" isDisabled />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2}>
            Change password
          </Heading>

          <Input bg="gray.600" placeholder="Old password" secureTextEntry />
          <Input bg="gray.600" placeholder="New password" secureTextEntry />
          <Input
            bg="gray.600"
            placeholder="Confirm new password"
            secureTextEntry
          />

          <Button title="Update" mt={4}/>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
