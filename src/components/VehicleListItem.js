import { useEffect } from "react"
import { StyleSheet, Text, View, Image } from "react-native"

export default VehicleListItem = ({vehicle}) => {

    return (
        <View style={styles.listItem}>
            <Text style={styles.title}>{vehicle.name}</Text>
            <Image source = { {uri : vehicle.photoUrl}}  style={{ width: 100, height: 60 }} />
            <Text>License: {vehicle.licensePlate}</Text>
            <Text>Make: {vehicle.make}</Text>
            <Text>Model Year: {vehicle.modelYear}</Text>
            <Text>Location: {vehicle.location}</Text>
            <Text>Price: {vehicle.price}</Text>
            <Text>Capacity: {vehicle.capacity}</Text>
            <Text>Doors: {vehicle.doors}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
        textAlign: 'left',
        color: 'black',
        fontWeight: '600',
      },
    listItem: {
        flexDirection: 'column',
        justifyContent: "space-between",
        alignItems: 'flex-start',
        alignContent: 'center',
        alignSelf: 'center',
        width: '90%',
        flex: 1,
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
})