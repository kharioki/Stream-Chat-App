import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Chat,
  OverlayProvider,
  ChannelList,
} from 'stream-chat-expo';
import { StreamChat } from 'stream-chat';
import { chatApiKey, chatUserId } from './chatConfig';
import { useChatClient } from './useChatClient';
import { AppProvider, useAppContext } from './AppContext';

const Stack = createStackNavigator();

const HomeScreen = () => <Text>Home Screen</Text>;

const ChannelScreen = () => {
  return null;
}

const filters = {
  members: {
    '$in': [chatUserId]
  },
}

const sort = {
  last_message_at: -1,
};

const ChannelListScreen = (props) => {
  const { setChannel } = useAppContext();
  return (
    <ChannelList
      onSelect={(channel) => {
        const { navigation } = props;
        setChannel(channel);
        navigation.navigate('Channel');
      }}
      filters={filters}
      sort={sort}
    />
  );
};

const chatClient = StreamChat.getInstance(chatApiKey);

const NavigationStack = () => {
  const { clientIsReady } = useChatClient();

  if (!clientIsReady) {
    return <Text>Loading chat..</Text>;
  }

  return (
    <OverlayProvider>
      <Chat client={chatClient}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ChannelList" component={ChannelListScreen} />
          <Stack.Screen name="Channel" component={ChannelScreen} />
        </Stack.Navigator>
      </Chat>
    </OverlayProvider>
  )
};

export default function App() {
  return (
    <AppProvider>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <NavigationStack />
        </NavigationContainer>
        <StatusBar style="auto" />
      </SafeAreaView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
