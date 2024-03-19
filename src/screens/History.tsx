import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import {
  Center,
  Heading,
  SectionList,
  Text,
  VStack,
  useToast,
} from "native-base";
import { useCallback, useState } from "react";

export function History() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [exercises, setExercises] = useState<HistoryByDayDTO []>([]);

  async function fetchHistory() {
    try {
      setIsLoading(true);
      const response = await api.get("history");
      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      toast.show({
        title: isAppError ? error.message : "Can't load history.",
        placement: "top",
        bg: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  return (
    <VStack flex={1}>
      <ScreenHeader title="Exercises History" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard group={item.group} exercise={item.name} hour={item.hour} />}
        renderSectionHeader={({ section }) => (
          <Heading
            color="gray.200"
            fontSize="md"
            mt={10}
            mb={3}
            fontFamily="heading"
          >
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={
          exercises.length === 0 && {
            flex: 1,
            justifyContent: "center",
          }
        }
        ListEmptyComponent={() => (
          <Text>There are no exercises registered today.</Text>
        )}
      />
    </VStack>
  );
}
