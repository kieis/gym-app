import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
} from "native-base";

import LogoSvg from "@assets/logo.svg";
import BackgroundImg from "@assets/background.png";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { useState } from "react";

type FormDataProps = {
  email: string;
  password: string;
};

const signInSchema = yup.object({
  email: yup
    .string()
    .required("Please enter a valid email address")
    .email("Invalid email address"),
  password: yup.string().required("Please enter a valid password"),
});

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(signInSchema),
  });

  function handleCreateAccount() {
    navigation.navigate("signUp");
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    setIsLoading(true);
    try {
      await signIn({ email, password });
    } catch (error) {
      const isAppError = error instanceof AppError;

      setIsLoading(false);

      toast.show({
        title: isAppError ? error.message : "Can't connect, try again later",
        placement: "top",
        bg: "red.500",
      });
    } finally {
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="People training"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Train your mind and body
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Access your account
          </Heading>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Password"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button
            title="Connect"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </Center>

        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Don't have access yet?
          </Text>

          <Button
            title="Create Account"
            variant="outline"
            onPress={handleCreateAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
