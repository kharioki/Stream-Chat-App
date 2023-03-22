import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Chat,
  OverlayProvider,
  ChannelList,
  Channel,
  MessageList,
  MessageInput,
  Thread,
  ChannelPreviewMessenger,
} from 'stream-chat-expo';
import { StreamChat } from 'stream-chat';
import { chatApiKey, chatUserId } from './chatConfig';
import { useChatClient } from './useChatClient';
import { AppProvider, useAppContext } from './AppContext';

const Stack = createStackNavigator();

const ChannelScreen = (props) => {
  const { navigation } = props;
  const { channel, setThread } = useAppContext();

  return (
    <Channel channel={channel}>
      <MessageList
        onThreadSelect={(message) => {
          if (channel?.id) {
            setThread(message);
            navigation.navigate('Thread');
          }
        }}
      />
      <MessageInput />
    </Channel>
  );
}

const filters = {
  members: {
    '$in': [chatUserId]
  },
}

const sort = {
  last_message_at: -1,
};

const CustomListItem = props => {
  const { unread } = props;
  const backgroundColor = unread ? '#e6f7ff' : '#fff';
  return (
    <View style={{ backgroundColor }}>
      <ChannelPreviewMessenger {...props} />
    </View>
  )
}

const ChannelListScreen = (props) => {
  const { setChannel } = useAppContext();
  return (
    <ChannelList
      onSelect={(channel) => {
        const { navigation } = props;
        setChannel(channel);
        navigation.navigate('Channel');
      }}
      Preview={CustomListItem}
      filters={filters}
      sort={sort}
    />
  );
};

const ThreadScreen = () => {
  const { channel, thread } = useAppContext();
  return (
    <Channel channel={channel} thread={thread} threadList>
      <Thread />
    </Channel>
  );
}

const chatTheme = {
  channelPreview: {
    container: {
      backgroundColor: 'transparent',
    }
  }
};

const chatClient = StreamChat.getInstance(chatApiKey);

const NavigationStack = () => {
  const { clientIsReady } = useChatClient();

  if (!clientIsReady) {
    return <Text>Loading chat..</Text>;
  }

  return (
    <OverlayProvider value={{ theme: chatTheme }}>
      <Chat client={chatClient}>
        <Stack.Navigator>
          <Stack.Screen name="ChannelList" component={ChannelListScreen} />
          <Stack.Screen name="Channel" component={ChannelScreen} />
          <Stack.Screen name="Thread" component={ThreadScreen} />
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
