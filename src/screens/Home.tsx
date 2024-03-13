import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { HStack, VStack, FlatList } from "native-base";
import { useState } from "react";

export function Home() {
  const [groups, setGroups] = useState([
    "chest",
    "back",
    "leg",
    "shoulder",
    "triceps",
    "biceps",
  ]);
  const [selectedGroup, setSelectedGroup] = useState("chest");

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={selectedGroup === item}
            onPress={() => setSelectedGroup(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{
          px: 8
        }}
        my={10}
        maxH={10}
      />
    </VStack>
  );
}
