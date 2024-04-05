import { StyleSheet, Text, Pressable, View, Image } from "react-native"
import { useEffect } from "react"
import { useNavigation } from '@react-navigation/native';

export default BookingListItem = ({item}) => {
    const navigation = useNavigation()

    return (
        <Pressable onPress={() => navigation.navigate("BookingDetails", {...JSON.parse(JSON.stringify(item))})} >
            <View style={styles.listItem}>
                <View style={styles.horizontalContainer}>
                    <Text style={styles.title}>{item.vehicle.name} </Text>
                {item.booking.bookingStatus.toLowerCase() === 'declined' ? (
                     <View style={[styles.declinedStatus, { borderRadius: 20 }]}>
                       <Text style={styles.statusText}>Declined</Text>
                    </View>
                 ) : 
                 item.booking.bookingStatus.toLowerCase() === 'pending' ? (
                     <View style={[styles.pendingStatus, { borderRadius: 20 }]}>
                       <Text style={styles.statusText}>Pending</Text>
                    </View>
                 ) : 
                  item.booking.bookingStatus.toLowerCase() === 'confirmed' ? (
                    <View style={[styles.confirmedStatus, { borderRadius: 20 }]}>
                     <Text style={styles.statusText}>Confirmed</Text>
                    </View>
                ) :(
                      <Text style={styles.defaultStatus}>Unknown Status</Text>
                  )}
                </View>
                <View style={styles.horizontalContainer}>
                    <Text>By {item.renter.name} </Text>
                    <Image source = { {uri : item.renter.profilePicUrl}}  style={styles.renterImg} />
                </View>
            </View>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'column',
        justifyContent: "space-between",
        alignItems: 'flex-start',
        alignContent: 'center',
        alignSelf: 'center',
        width: '95%',
        marginVertical: 5,
        backgroundColor: '#C6EBC5',
        padding: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
           width: 0,
           height: -2,
        },
       shadowOpacity: 0.25,
       shadowRadius: 3.84,
       elevation: 5,
     },
     title: {
        fontSize: 15,
        textAlign: 'left',
        color: 'black',
        fontWeight: '600',
      },
      horizontalContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
      },
      renterImg: {
        width: 40,
        height: 40,
        borderRadius: 50
       },
       declinedStatus: {
        marginBottom: 6,
        borderRadius: 10,
        backgroundColor: '#EE4266',
        borderRadius: 20
       },
       pendingStatus: {
        marginBottom: 6,
        borderRadius: 10,
        backgroundColor: '#EE9322',
        borderRadius: 20
       },
       confirmedStatus: {
        marginBottom: 6,
        borderRadius: 10,
        backgroundColor: '#007F73',
        borderRadius: 20
       },
       statusText: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        color: 'white',
        fontWeight: '500',
        fontSize: 13
       }
})
