import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "./ChatScreen";
import StatusScreen from "./StatusScreen";
import CallScreen from "./CallingScreen";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "./ProfileScreen";

const Tabs =  createBottomTabNavigator();
export default function HomeTabs(){
    return(
          <Tabs.Navigator screenOptions={({route})=>({
            tabBarIcon:({color})=>{
                let iconName = "chatbubble-ellipses";
                if(route.name==='Cahts') iconName="chatbubble-ellipses";
                else if(route.name==="Status") iconName="time";
                else if(route.name==="Calls") iconName="call";
                return<Ionicons name={iconName as any} size={28} color={color}/>
            },
            tabBarLabelStyle:{fontSize:16},
            tabBarActiveTintColor:"#22c55e",
            tabBarInactiveTintColor:"#d1d5db",
            tabBarStyle:{
                height:80,
                backgroundColor:"#fff",
                paddingTop:8,
            }
          })}>
        <Tabs.Screen name="Chats" component={ChatScreen} options={{headerShown:false}}/>
         <Tabs.Screen name="Status" component={StatusScreen} options={{headerShown:false}}/>
          <Tabs.Screen name="Calls" component={CallScreen} options={{headerShown:false}}/>
    </Tabs.Navigator>
    );
  
    
}

