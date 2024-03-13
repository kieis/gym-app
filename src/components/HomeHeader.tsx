import { Center, HStack, Heading, Icon, Text, VStack } from "native-base";
import { UserPhoto } from "./UserPhoto";

import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export function HomeHeader() {
  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8}>
      <UserPhoto
        source={{ uri: "https://github.com/kieis.png" }}
        alt="Profile Photo"
        size={16}
        mr={4}
      />

      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Hello,
        </Text>
        <Heading color="gray.100" fontSize="md">
          Dirlan Ferreira
        </Heading>
      </VStack>

      <Center>
        <TouchableOpacity onPress={() => {}}>
          <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
        </TouchableOpacity>
      </Center>
    </HStack>
  );
}
