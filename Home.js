import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    StatusBar,
    TextInput,
    TouchableOpacity,
    Text,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    SafeAreaView
} from 'react-native';
import Icon from "react-native-vector-icons/Fontisto";
import firebase from "./config";

export default class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
    }

    handleEmail = (email) => {
        this.setState({email: email})
    }

    handlePassword = (password) => {
        this.setState({password: password})
    }

    login = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.props.navigation.navigate('WelcomePage');
            })
            .catch(error => {
                if (error.code == 'auth/invalid-email') {
                    Alert.alert(
                        'Invalid Email',
                        'The email you entered is invalid. Please check your email and try again.',
                        [{text: 'Try again'}])
                } else if (error.code == 'auth/user-not-found') {
                    Alert.alert(
                        'Incorrect Email',
                        'The email you entered does not appear to belong to an account. ' +
                        'Please check your email and try again.',
                        [{text: 'Try again'}])
                } else if (error.code == 'auth/wrong-password') {
                    Alert.alert(
                        'Incorrect Password',
                        'Try again or click Forgot Password to reset it.',
                        [{text: 'Try again'}]);
                }
            });
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.container}>
                    <StatusBar barStyle="dark-content" backgroundColor="#000000"/>
                    <Image source={{uri: 'https://i.imgur.com/l8cADUr.png'}}
                           style={styles.myImage}
                    />
                    <View style={styles.inputs}>
                        <Icon name="email" size={16} style={styles.emailIcon}/>
                        <TextInput style={styles.emailBox}
                                   placeholder="Email"
                                   autoCapitalize="none"
                                   autoCorrect={false}
                                   textContentType={'emailAddress'}
                                   onChangeText={this.handleEmail}/>
                    </View>
                    <View style={styles.inputs}>
                        <Icon name="locked" size={16} style={styles.passwordIcon}/>
                        <TextInput style={styles.passwordBox}
                                   placeholder="Password"
                                   autoCapitalize="none"
                                   autoCorrect={false}
                                   secureTextEntry={true}
                                   textContentType={'password'}
                                   onChangeText={this.handlePassword}/>
                    </View>
                    <View style={styles.loginContainer}>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={() => this.login()}
                        >
                            <Text style={styles.loginText}> Login </Text>
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={styles.forgotPasswordText}
                        onPress={() => this.props.navigation.navigate('ForgotPassword')}
                    >Forgot password? </Text>
                    <View style={styles.inputs}>
                        <Text style={styles.signUpText}>No account? Sign up </Text>
                        <Text
                            style={styles.hereText}
                            onPress={() => this.props.navigation.navigate('SignUp')}
                        >here </Text>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 100,
        alignItems: 'center',
    },
    inputs: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    myImage: {
        width: 300,
        height: 300,
    },
    emailIcon: {
        marginLeft: 30,
        marginBottom: -10,
    },
    emailBox: {
        height: 40,
        color: 'black',
        marginLeft: -45,
        borderBottomColor: 'grey',
        fontSize: 16,
        borderBottomWidth: 2,
        width: '80%',
        textAlign: 'center',
        fontFamily: 'Futura',
        alignItems: 'center',
        marginTop: 10,
    },
    passwordIcon: {
        marginLeft: 30,
        marginBottom: -30,
    },
    passwordBox: {
        height: 40,
        marginTop: 30,
        color: 'black',
        marginLeft: -45,
        borderBottomColor: 'grey',
        fontSize: 16,
        borderBottomWidth: 2,
        width: '80%',
        textAlign: 'center',
        fontFamily: 'Futura',
        alignItems: 'center',
    },
    loginContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: -10,
        marginTop: 50,
    },
    loginButton: {
        backgroundColor: '#000000',
        borderRadius: 20,
        padding: 10,
        margin: 15,
        height: 40,
        width: 200,
        alignItems: 'center',
    },
    loginText: {
        color: '#fff8dc',
        fontFamily: 'Futura',
        fontSize: 16,
    },
    forgotPasswordText: {
        fontFamily: 'Futura',
        color: 'black',
        textDecorationLine: 'underline',
        marginTop: 50,
        fontSize: 16,
        marginBottom: -40,
    },
    signUpText: {
        fontFamily: 'Futura',
        color: 'black',
        marginTop: 50,
        fontSize: 16,
        marginBottom: -40,
    },
    hereText: {
        fontFamily: 'Futura',
        color: 'black',
        textDecorationLine: 'underline',
        marginTop: 50,
        fontSize: 16,
        marginBottom: -40,
    }
})
