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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const signUpSchema = yup.object({
  name: yup.string().required("Please enter your name"),
  email: yup
    .string()
    .required("Please enter a valid email address")
    .email("Invalid email address"),
  password: yup.string().required("Please enter a valid password"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Password needs to be equal"),
});

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(signUpSchema),
  });

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSignUp({
    name,
    email,
    password,
    confirmPassword,
  }: FormDataProps) {
    try {
      const response = await api.post("/users", {
        name,
        email,
        password,
      });

      toast.show({
        title: "Your solicitation have been successfully delivered",
        bg: "green.500",
        placement: "top"
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      toast.show({
        title: isAppError
          ? error.message
          : "Cannot create account, please try again later.",
        bg: "red.500",
        placement: "top"
      });
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
            Create your account
          </Heading>

          <Controller
            control={control}
            name="name"
            /*rules={{
              required: "Please enter your name",
            }} using yup*/
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Name"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            /*rules={{
              required: "Please enter a valid email address",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }} using yup*/
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirm password"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                enterKeyHint="send"
                errorMessage={errors.confirmPassword?.message}
              />
            )}
          />

          <Button
            title="Create and connect"
            onPress={handleSubmit(handleSignUp)}
          />
        </Center>

        <Center mt={24}>
          <Button
            title="Back to login"
            variant="outline"
            onPress={handleGoBack}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
