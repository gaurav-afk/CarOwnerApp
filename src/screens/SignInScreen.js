import { useState } from "react"
import { StyleSheet, Text, TextInput, Pressable, View, ImageBackground } from "react-native"
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";

const SignInScreen = () => {
    const [username, setUserName] = useState()
    const [password, setPassword] = useState()

    const signIn = async () => {
        try {
            const docRef = doc(db, "Car_Owners", username)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                console.log("is car owner")
                await signInWithEmailAndPassword(auth, username, password)
                console.log("signin success: ", auth.currentUser)
            }
            else {
                console.log("not a car owner")
                alert("Invalid credentials")
            }

        }
        catch (err) {
            console.log("sign in error: ", err)
            alert("Sign in failed")
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{
                    // uri: 'https://i.pinimg.com/originals/76/49/ba/7649ba7c0d31bf9667faa7e123df34ef.jpg' 
                    // uri: 'https://www.wsupercars.com/thumbnails-phone/Lamborghini/2024-Lamborghini-Revuelto-007.jpg' 
                    // uri: 'https://w0.peakpx.com/wallpaper/107/777/HD-wallpaper-nissan-240z-black-car-cool-jdm-minimalistic-modified-tunning-thumbnail.jpg' 
                    // uri: 'https://i.pinimg.com/originals/0e/d5/42/0ed542baebfe0c854c8c81112ce25a99.jpg' 
                    uri: 'https://w0.peakpx.com/wallpaper/461/348/HD-wallpaper-bmw-car-cars-cool-minimalistic-modified-porche-purple-turbo.jpg'
                    // uri: 'https://www.wsupercars.com/thumbnails-phone/Lamborghini/2024-Lamborghini-Revuelto-007.jpg' 

                }}
                style={styles.backgroundImage}
            >
                <View style={styles.overlay} />

                <View style={styles.content}>
                    <Text style={styles.appTitle}>Car Owner App</Text>
                    <Text style={styles.textFieldHeading}>Username: </Text>
                    <TextInput
                        style={styles.textField}
                        placeholder="Enter User Name"
                        value={username}
                        onChangeText={setUserName}
                    />

                    <Text style={styles.textFieldHeading}>Password: </Text>
                    <TextInput
                        style={styles.textField}
                        placeholder="Enter Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />

                    <Pressable onPress={signIn} style={styles.signInButton}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    textFieldHeading: {
        fontSize: 18,
        alignSelf: 'center',
        color: 'white',
        marginHorizontal: 10,
        paddingTop: 10
    },
    textField: {
        borderWidth: 2,
        borderColor: 'white',
        color: 'white',
        padding: 10,
        width: '80%',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    signInButton: {
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
    appTitle: {
        fontSize: 50,
        fontWeight: "bold",
        justifyContent: "center",
        color: "white"
      }
});

export default SignInScreen