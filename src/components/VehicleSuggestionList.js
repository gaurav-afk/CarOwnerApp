import { StyleSheet, Text, Pressable, View, FlatList } from "react-native"

export default VehicleSuggestionList = ({filteredVehicles, onPressVehicleSuggestion}) => {
    return (
        <FlatList
            data={filteredVehicles}
            key={ (item) => item.handle }
            style={
                styles.listContainer
            }
            renderItem={({item}) => 
                <Pressable style={styles.listContainer} onPress={() => onPressVehicleSuggestion(item)}>
                    <Text>{item.name}</Text>
                </Pressable>
            } 
            ItemSeparatorComponent={<View style={{height: 1, backgroundColor: 'gray', marginVertical: 10}} />}
        />
    )
}

const styles = StyleSheet.create({
    listItem: {
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    listContainer: {
        marginHorizontal: 15,
        borderRadius: 10,
        paddingVertical: 4,
        backgroundColor: "lightgreen",
    }
});