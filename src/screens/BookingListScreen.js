import { StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native"
import { collection, getDoc, getDocs, query } from "firebase/firestore";
import { useContext, useCallback } from "react"
import { auth, db } from "../../firebaseConfig"
import { useFocusEffect } from '@react-navigation/native';
import { BookingsContext } from '../providers/BookingsProvider';
import BookingListItem from "../components/BookingListItem"

const BookingListScreen = () => {
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
                console.log("booking ", { "id": bookingDoc.id, ...bookingDoc.data(), ...vehicleDoc.data()})
                console.log("before serial ", {"booking": {"id": bookingDoc.id, ...bookingDoc.data()}, "vehicle": { "licensePlate": vehicleDoc.id, ...vehicleDoc.data()}, "renter": {"id": renterDoc.id, ...renterDoc.data()}})
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
        useCallback(() => {
            console.log("focusing on book list")
            fetchBookings()
        }, [])
    )


    const updateBooking = (id, newBooking) => {
        console.log("updating booking")
        const indexToBeUpdated = bookings.findIndex((booking) => booking.id === id)
        bookings[indexToBeUpdated] = newBooking
        setBookings(bookings)
    }

    return (
        <View style={styles.bookingTextContainer}>
            {
                isLoading ? (
                    <ActivityIndicator color="blue" size="large" animating={true} style={styles.indicator}/>
                ) : (
                    bookings.length > 0 ?
                    <FlatList 
                        data={bookings}
                        key={(item) => item.booking.id}
                        renderItem={({item}) => 
                            <BookingListItem item={item} updateBooking={updateBooking}/>
                        }
                    />
                    :
                    <View style={styles.centeredContainer}>
                    <Text style={styles.bookingText}>No Bookings at this moment</Text>
                </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    indicator: {
        height: '100%'
    },
    bookingTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookingText: {
        alignSelf: 'center', 
        textAlign: 'center', 
        padding: 20,
        borderRadius: 10,
        fontWeight: '600',
    }
})


export default BookingListScreen