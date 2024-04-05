import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import BookingsScreen from './src/screens/BookingsScreen';
import ListingScreen from './src/screens/ListingScreen';
import SignInScreen from './src/screens/SignInScreen';
import { useEffect, useState, useContext, createContext, useNavigation } from 'react';
import { auth } from "./firebaseConfig"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { NavigationOptionsContext, NavigationOptionsProvider } from './src/providers/TabNavigationProvider';
import AppNavigation from './src/navigation/AppNavigation';

export default function App() {
  const [currentUser, setCurrentUser] = useState()


  const Stack = createNativeStackNavigator()

  useEffect(() => {
    const unsubscribeToUserDataChanges = onAuthStateChanged(auth, (user) => {
      console.log("user is ", user)
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribeToUserDataChanges
  })

  return (
    currentUser ?     (
      <AppNavigation/>
    )
    :
    (
      <SignInScreen />

      // <NavigationContainer>
      //     <Stack.Navigator initialRouteName='SignIn' 
      //     screenOptions={ {headerStyle: {backgroundColor: 'orangered'}, 
      //     headerTintColor: '#fff', 
      //     headerTitleStyle: {fontWeight: 'bold'}, } 
      //     }>
            
      //       <Stack.Screen name="SignIn" component={SignInScreen} />

      //     </Stack.Navigator>

      // </NavigationContainer>
    )

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
