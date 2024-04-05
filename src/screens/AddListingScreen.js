import { useEffect, useState } from "react"
import { StyleSheet, Text, TextInput, Pressable, View, Image, ScrollView } from "react-native"
import { db, auth } from "../../firebaseConfig"
import { doc, writeBatch } from "firebase/firestore";
import VehicleSuggestionList from "../components/VehicleSuggestionList";

const AddListingScreen = () => {
    const [selectedVehicle, setSelectedVehicle] = useState({})
    const [filteredVehicles, setfilteredVehicles] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showVehicleSuggestions, setShowVehicleSuggestions] = useState(true)

    useEffect(() => {
        fetch("https://laichunyin.github.io/MADS-4014-Project/vehicles.json").then((response) => {
            console.log("data from api is ", response, response.ok)
            if(response.ok) {
                return response.json()
            }
            else {
                throw "response failed"
            }
        })
        .then((data) => {
            data.forEach(element => {
                const vehicle = {
                    handle: element.handle,
                    name: `${element["make"]} ${element["model"]} ${element["trim"]}` ?? "",
                    photoUrl: element.images[0]["url_full"] ?? "",
                    capacity: String(element.seats_max) ?? "",
                    modelYear: String(element["model_year"]) ?? "",
                    make: element["make"] ?? "",
                    doors: String(element.doors) ?? "",
                }
                console.log("vehicle is ", vehicle)
                vehicles.push(vehicle)
            });

            setVehicles(vehicles)
        })
        .catch((err) => {
            console.log(`error when fetching ${err}`)
        })
        .finally(() => {setIsLoading(false)})
    }, [])

    const validateSelectedVehicle = () => {
        const requiredKeys = ["handle", "name", "photoUrl", "capacity", "modelYear", "make", "licensePlate", "location", "price", "doors"]
        const selectedVehicleKeys = Object.keys(selectedVehicle)

        requiredKeys.every(key => {
            if (!selectedVehicleKeys.includes(key)) return false
            if (selectedVehicle[key] === null || selectedVehicle[key] === undefined) return false
            if (typeof selectedVehicle[key] === "string" && selectedVehicle[key].length < 1) return false
        });
        return true
    }

    const filterVechiles = (vehiclesName) => {
        let result = []
        const keywords = vehiclesName.split(" ")
        console.log("keywords are ", keywords)

        vehicles.forEach((car) => {
            if (keywords.some((substring) => car.name.toLowerCase().includes(substring.toLowerCase()))) {
                console.log("including ", car.name)
                result.push(car)
            }
        })
        console.log("filter cars total: ", result.length)
        console.log("filtered car is ", result.slice(0, 10))
        setfilteredVehicles(result.slice(0, 10))
    }

    const setVehicleProperty = (partialVehicle) => {
        console.log("selected and partial ", selectedVehicle, partialVehicle)
        const newVehicle = {...selectedVehicle, ...partialVehicle}
        console.log("new car ", newVehicle)
        setSelectedVehicle(newVehicle)
    }

    const onVehicleNameChange = (vehicleName) => {
        setVehicleProperty({"name": vehicleName})
        setShowVehicleSuggestions(true)
        filterVechiles(vehicleName)
    }

    const createRentalListing = async () => {
        if(validateSelectedVehicle(selectedVehicle)) {

            try {
                const batch = writeBatch(db)
                const vehicleId = selectedVehicle.licensePlate
                console.log("vehicle id is ", vehicleId)
                const vehicleDocRef = doc(db, "Vehicles", vehicleId)
                const carOwnerDocRef = doc(db, "Car_Owners", auth.currentUser.email)
                console.log("auth email ", auth.currentUser.email)
                console.log("doc ref ", typeof carOwnerDocRef, carOwnerDocRef)

                batch.set(doc(db, "Vehicles", vehicleId), {...selectedVehicle, "owner": carOwnerDocRef})
                batch.set(doc(carOwnerDocRef, "Vehicles", vehicleId), {"vehicleId": vehicleDocRef})

                console.log("before commit")
                await batch.commit()
                console.log("batch commited")
                setSelectedVehicle({})
            }
            catch(err) {
                console.log("cannot save listing: ", err)
            }

        }
        else {
            console.log("invalid data")
            alert("All fields should not be empty")
        }
    }

    const onPressVehicleSuggestion = (car) => {
        console.log("selecting car ", car)
        setSelectedVehicle(car)
        setShowVehicleSuggestions(false)
    } 

    return (
        <ScrollView style={styles.container}>
        <View>
            <Text style={styles.textFieldHeading}>Vehicle Name: </Text>
            <TextInput
            style={styles.textField}
                placeholder = "Enter Vehicle Name"
                value = {selectedVehicle.name}
                onChangeText = {onVehicleNameChange}
            />
            {/* horizontal set to true to avoid the VirtualizedLists error */}
            <ScrollView horizontal={true}>
            {
                <View style={styles.listContainer}>
                    {
                        showVehicleSuggestions && filteredVehicles.length > 0 &&
                        <VehicleSuggestionList filteredVehicles={filteredVehicles} onPressVehicleSuggestion={onPressVehicleSuggestion} />
                    }
                </View>
            }
            </ScrollView>

            <Text style={styles.textFieldHeading}>Make: </Text>
            <TextInput
                placeholder = "Enter Vehicle Make"
                style={styles.textField}
                value = {selectedVehicle.make}
                onChangeText = {value => setVehicleProperty({"make": value})}
            />

            <Text style={styles.textFieldHeading}>Model Year: </Text>
            <TextInput
                placeholder = "Enter Model Year"
                style={styles.textField}
                value = {selectedVehicle.modelYear}
                onChangeText = {value => setVehicleProperty({"modelYear": value})}
            />

            <Text style={styles.textFieldHeading}>Capacity: </Text>
            <TextInput
                placeholder = "Enter Seat Capacity"
                style={styles.textField}
                value = {selectedVehicle.capacity}
                onChangeText = {value => setVehicleProperty({"capacity": value})}
            />

            <Text style={styles.textFieldHeading}>Doors: </Text>
            <TextInput
                placeholder = "Enter the number of doors"
                style={styles.textField}
                value = {selectedVehicle.doors}
                onChangeText = {value => setVehicleProperty({"doors": value})}
            />
            
            <Text style={styles.textFieldHeading}>License Plate: </Text>
            <TextInput
                placeholder = "Enter License Plate"
                style={styles.textField}
                value = {selectedVehicle.licensePlate}
                onChangeText = {value => setVehicleProperty({"licensePlate": value})}
            />

            <Text style={styles.textFieldHeading}>Pick Up Location: </Text>
            <TextInput
                placeholder = "Choose Pick Up Location"
                style={styles.textField}
                value = {selectedVehicle.location}
                onChangeText = {value => setVehicleProperty({"location": value})}
            />

            <Text style={styles.textFieldHeading}>Rental Price: </Text>
            <TextInput
                placeholder = "Enter Rental Price per week"
                style={styles.textField}
                value = {selectedVehicle.price}
                onChangeText = {value => setVehicleProperty({"price": value})}
            />

            {
                selectedVehicle.photoUrl?.length > 0  &&
                <Image source = { {uri : selectedVehicle.photoUrl}}  style={styles.imageStyle} />
            }

            <Pressable onPress={createRentalListing} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save</Text>
            </Pressable>
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 15
    },
    textFieldHeading: {
        fontSize: 15,
        alignSelf: 'flex-start',
        marginHorizontal: 12,
        paddingTop: 10
    },
    textField: {
        borderWidth: 2,
        borderColor: 'grey',
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    saveButton: {
        width: '70%',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'orange',
        padding: 15,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 80
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white'
    },
    imageStyle: {
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
         width: '80%', 
         height: 200
    },
    listContainer: {
        width: 400,
    }
  });

export default AddListingScreen