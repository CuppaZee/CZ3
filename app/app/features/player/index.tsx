import { H2, XStack, YStack, Text } from "@cz3/app_ui";
import { Outlet, useMatch } from "react-router";
import { ScrollView } from "react-native";

export function PlayerScreen() {
  const { params: { player = null } = {} } = useMatch("/player/:player/*") ?? {};
  if (!player) {
    return <H2>No player found</H2>;
  }
  return (
    <XStack height="100vh" flex={1}>
      <YStack
        display="none"
        $gtMd={{
          display: "flex",
        }}
        my="$4"
        mr="$4"
        position="relative"
        top="$0"
        bottom="$0"
        borderTopRightRadius="$4"
        borderBottomRightRadius="$4"
        bc="$backgroundSoft"
        borderWidth={2}
        borderLeftWidth={0}
        borderColor="$borderColor"
        p="$2"
        elevation="$4"
        w={300}
      >
        <H2>{player}</H2>
        <Text fontFamily="$body">This is a sidebar. I might put some things here eventually.</Text>
      </YStack>
      <YStack flex={1} w={0}>
        <ScrollView style={{ flex: 1 }}>
          <Outlet />
        </ScrollView>
      </YStack>
    </XStack>
  );
}
