import { Text, Button } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationOptionsProvider } from '../providers/TabNavigationProvider';
import BookingsScreen from '../screens/BookingsScreen';
import ListingScreen from '../screens/ListingScreen';
import { signOut } from "firebase/auth"
import { auth } from "../../firebaseConfig"
import { BookingsProvider } from '../providers/BookingsProvider';
import AddListingScreen from '../screens/AddListingScreen';

const Tab = createBottomTabNavigator()

export default AppNavigation = () => {
    const logout = async () => {
        try {
            if (auth.currentUser === null) {
                console.log("no user has logged in")
            }
            else {                
                await signOut(auth)
                console.log("sign out success")
            }
            setCurrentUser(null)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <BookingsProvider>
        <NavigationOptionsProvider>
        <NavigationContainer>
          <Tab.Navigator initialRouteName='Listing'>
          <Tab.Screen name="AddListing" component={AddListingScreen}
            options={{
              tabBarLabel: ({ focused, color }) => (
                <Text style={{ color: focused ? '#fa7070' : 'grey' }}>Add Listing</Text>
              ),
              headerRight: () => (
                <Button
                  onPress={logout}
                  title="Logout"
                />
              ),
              tabBarIcon: ({ color, size, focused }) => (
                <FontAwesome name="list"  style={{ color: focused ? '#fa7070' : 'grey' }} size={20} />
              ),
            }}
          />
          <Tab.Screen name="Listing" component={ListingScreen}
            options={{
              tabBarLabel: ({ focused, color }) => (
                <Text style={{ color: focused ? '#fa7070' : 'grey' }}>Vehicles</Text>
              ),
              headerRight: () => (
                <Button
                  onPress={logout}
                  title="Logout"
                />
              ),
              tabBarIcon: ({ color, size, focused }) => (
                <FontAwesome name="car"  style={{ color: focused ? '#fa7070' : 'grey' }} size={20} />
              ),
            }}
          />
          <Tab.Screen name="Bookings" component={BookingsScreen}
            options={{
              tabBarLabel: ({ focused, color }) => (
                <Text style={{ color: focused ? '#fa7070' : 'grey' }}>Bookings</Text>
              ),
              headerRight: () => (
                <Button
                  onPress={logout}
                  title="Logout"
                />
              ),
              tabBarIcon: ({ focused }) => (
                <FontAwesome name="calendar"  style={{ color: focused ? '#fa7070' : 'grey' }} size={20} />
              ),
            }}
          />
          </Tab.Navigator>
        </NavigationContainer>
      </NavigationOptionsProvider>
      </BookingsProvider>
    )
}