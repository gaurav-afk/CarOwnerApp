import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useContext, useCallback } from 'react';
import { NavigationOptionsContext  } from "../providers/TabNavigationProvider"
import BookingsNavigation from '../navigation/BookingsNavigation';
import { useFocusEffect } from '@react-navigation/native';
import { BookingsContext } from '../providers/BookingsProvider';
import { auth, db } from "../../firebaseConfig"
import { collection, getDoc, getDocs, query } from "firebase/firestore";

const Stack = createNativeStackNavigator()

const BookingsScreen = () => {
    const navigation = useNavigation()
    const { tabSetOptions, setTabSetOptions } = useContext(NavigationOptionsContext)
    const { isLoading, setIsLoading, bookings, setBookings } = useContext(BookingsContext)

    const fetchBookings = async () => {
        try {
            console.log("start fetching booking ")
            const querySnapshot = await getDocs(query(collection(db, `/Car_Owners/${auth.currentUser.email}/bookings`)))
            console.log("result is ", querySnapshot.docs)
            const getBookingsPromises = querySnapshot.docs.map(async (document) => {
                console.log("getting booking id ", document.data().bookingId)

                const bookingRef = document.data().bookingId
                const bookingDoc = await getDoc(bookingRef)
                console.log("bookingdoc ", bookingDoc.data())
                const vehicleRef = bookingDoc.data().vehicle
                console.log("vehicle ref ", vehicleRef)
                const vehicleDoc = await getDoc(vehicleRef)

                const renterRef = bookingDoc.data().renter
                const renterDoc = await getDoc(renterRef)
                
                console.log("renter doc is ", renterDoc.data())
                console.log("booking doc is ", bookingDoc.data())
                console.log("vehicle doc is ", vehicleDoc.data())
                console
                console.log("booking ", { "id": bookingDoc.id, ...bookingDoc.data(), ...vehicleDoc.data()})
                console.log("before serial ", {"booking": {"id": bookingDoc.id, ...bookingDoc.data()}, "vehicle": { "licensePlate": vehicleDoc.id, ...vehicleDoc.data()}, "renter": {"id": renterDoc.id, ...renterDoc.data()}})
                // stringify and then parse the object to remove the non-serializable fields, which should not be passed through navigation
                console.log("after serial ", JSON.parse(JSON.stringify({"booking": {"id": bookingDoc.id, ...bookingDoc.data()}, "vehicle": { "licensePlate": vehicleDoc.id, ...vehicleDoc.data()}, "renter": {"id": renterDoc.id, ...renterDoc.data()}})))
                return {"booking": {"id": bookingDoc.id, ...bookingDoc.data()}, "vehicle": { "licensePlate": vehicleDoc.id, ...vehicleDoc.data()}, "renter": {"id": renterDoc.id, ...renterDoc.data()}}
            })

            const result = await Promise.all(getBookingsPromises)
            console.log("bookings are ", result)
    
            setBookings(result)
            setIsLoading(false)
        }
        catch(err) {
            console.log("cannot fetch from fb: ", err)
            setIsLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {fetchBookings()}, [])
    )

    useEffect(() => {
        console.log("in bookingscreen ", navigation.getState(), navigation.getState().routes[navigation.getState().index].name, navigation.getState().index)
        console.log("in booking screen: ", navigation, navigation.setOptions)
        setTabSetOptions(() => navigation.setOptions)
    }, [])

    return (
        <BookingsNavigation bookings={bookings} isLoading={isLoading} />
    )
}


export default BookingsScreen