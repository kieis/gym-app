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
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";

const PHOTO_SIZE = 33;

const profileSchema = yup
  .object({
    name: yup.string().required("Please enter a name."),
    password: yup
      .string()
      .min(6, "Password must be at least 6 digits.")
      .nullable()
      .transform((value) => (!!value ? value : null)), //resets from "" to null
    confirmPassword: yup
      .string()
      .nullable()
      .transform((value) => (!!value ? value : null))
      .oneOf([yup.ref("password"), null], "Passwords must be equals.")
      .when("password", {
        is: (Field: any) => Field, //check if password has content
        then: (schema) =>
          schema
            .nullable()
            .required("Please enter the confirmation password.")
            .transform((value) => (!!value ? value : null)),
      }),
  })
  .shape({
    email: yup.string().nonNullable().required(),
    oldPassword: yup.string().nullable(),
  });

type FormDataProps = yup.InferType<typeof profileSchema>;

export function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [userPhotoUri, setUserPhotoUri] = useState(
    "https://github.com/kieis.png"
  );

  const { user, updateUserProfile } = useAuth();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

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

  async function handleUpdateProfile(data: FormDataProps) {
    try {
      setIsLoading(true);
      await api.put("/users", data);

      await updateUserProfile({
        ...user,
        name: data.name,
      });

      toast.show({
        title: "Profile updated successfully",
        placement: "top",
        bg: "green.500",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      toast.show({
        title: isAppError ? error.message : "Can't update profile.",
        placement: "top",
        bg: "red.500",
      });
    } finally {
      setIsLoading(false);
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
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Name"
                bg="gray.600"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="E-mail"
                bg="gray.600"
                value={value}
                onChangeText={onChange}
                isDisabled
              />
            )}
          />
        </VStack>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2} fontFamily="heading">
            Change password
          </Heading>

          <Controller
            control={control}
            name="oldPassword"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Old password"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.oldPassword?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="New password"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirm new password"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirmPassword?.message}
              />
            )}
          />

          <Button
            title="Update"
            mt={4}
            onPress={handleSubmit(handleUpdateProfile)}
            isLoading={isLoading}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
