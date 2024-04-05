import { useCallback, useState } from "react"
import { StyleSheet, Text, View, FlatList, ActivityIndicator, ScrollView } from "react-native"
import { db, auth } from "../../firebaseConfig"
import { collection, getDoc, getDocs, query } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native"
import VehicleListItem from "../components/VehicleListItem";

const ListingScreen = () => {
    const [vehicles, setVehicles] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    
    const fetchVehicles = async () => {
        try {
            console.log("start fetching vehicles ")

            const querySnapshot = await getDocs(query(collection(db, `/Car_Owners/${auth.currentUser.email}/Vehicles`)))
            console.log("result is ", querySnapshot.docs)
            const getVehiclesPromises = querySnapshot.docs.map(async (document) => {
                console.log("getting vehicle id ", document.data())

                const vehicleDoc = await getDoc(document.data().vehicleId)

                return {"vehicle": { "licensePlate": vehicleDoc.id, ...vehicleDoc.data()}}
            })

            let result = await Promise.all(getVehiclesPromises)
            console.log("vehicles are ", result)
    
            setVehicles(result)
            setIsLoading(false)
        }
        catch(err) {
            console.log("cannot fetch from fb: ", err)
            setIsLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            console.log("focusing on vehicles")
            fetchVehicles()
        }, [])
    )

    return (
            <View style={styles.container}>
            {   isLoading ?
                <ActivityIndicator color="blue" size="large" animating={true} style={styles.indicator}/>
                :
                vehicles.length > 0 ?
                    <View style={styles.listContainer}>
                        <FlatList 
                            data={vehicles}
                            key={(item) => item.licensePlate}
                            renderItem={({item}) => <VehicleListItem vehicle={item.vehicle} />}
                        />
                    </View>
                :
                <View style={styles.centeredContainer}>
                    <Text style={styles.noListingText}>No Listing Found</Text>
                </View>
            }
            </View>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        width: 400
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 15
    },
  });

export default ListingScreen