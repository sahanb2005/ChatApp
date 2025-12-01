import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import ContactScreen from './src/screens/ContactScreen';
import AvatarScreen from './src/screens/AvatarScreen';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { UserRegistrationProvider } from './src/components/UserContext';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import HomeTabs from './src/screens/HomeTabs';
import SingleChatScreen from './src/screens/SingleChatScreen';
import { WebSocketProvider } from './src/socket/WebSocketProvider';
import NewChatScreen from './src/screens/NewChatScreen';
import NewContactScreen from './src/screens/NewContactScreen';
import SettingScreen from './src/screens/SettingScreen';
import CallingScreen from './src/screens/CallingScreen';
import { AuthProvider, AuthContext } from './src/components/AuthProvider';
import { useContext } from 'react';

export type RootStack = {
  SplashScreen: undefined;
  SignUpScreen: undefined;
  HomeScreen: undefined;
  ProfileScreen: undefined;
  SettingScreen: undefined;
  ContactScreen: undefined;
  AvatarScreen: undefined;
  NewChatScreen: undefined;
  SingheChatScreen: {
    chatId: number;
    friendName: string;
    lastSeenTime: string;
    profimeImage: string;
  };
  NewContactScreen: undefined;
  CallingScreen : undefined;
};

const Stack = createNativeStackNavigator<RootStack>();

function ChatApp() {
  const auth = useContext(AuthContext);

  return (
    <WebSocketProvider userId={auth ? Number(auth.userId) : 0}>
      <ThemeProvider>
        <UserRegistrationProvider>
           <NavigationContainer>
          <Stack.Navigator initialRouteName="SplashScreen">
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUpScreen"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SingheChatScreen"
              component={SingleChatScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NewContactScreen"
              component={NewContactScreen}
               options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SettingScreen"
              component={SettingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CallingScreen"
              component={CallingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NewChatScreen"
              component={NewChatScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ContactScreen"
              component={ContactScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AvatarScreen"
              component={AvatarScreen}
              options={{ headerShown: false }}
            />
            
          </Stack.Navigator>
          </NavigationContainer>
        </UserRegistrationProvider>
      </ThemeProvider>
    </WebSocketProvider>
  );
}

export default function App() {
  return (
    <AlertNotificationRoot>
      <AuthProvider>
        
            <ChatApp/>
          
      </AuthProvider>
    </AlertNotificationRoot>
  );
}
