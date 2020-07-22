import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Text, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import Icon from "react-native-vector-icons/Fontisto";
import fire from "./config";

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
        }
    }

    handleEmail = (email) => {
        this.setState({email: email})
    }

    sendEmail = () => {
        fire.auth().sendPasswordResetEmail(this.state.email)
            .then(() => {
                Alert.alert(
                    'Reset Password',
                    'Password reset email sent successfully. Please check your email.')
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
                }
            })
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.title}>Forgot Password?</Text>
                    <View style={styles.inputs}>
                        <Icon name="email" size={16} style={styles.emailIcon}/>
                        <TextInput style={styles.emailBox}
                                   placeholder="Email"
                                   autoCapitalize="none"
                                   autoCorrect={false}
                                   textContentType={'emailAddress'}
                                   onChangeText={this.handleEmail}/>
                    </View>
                    <TouchableOpacity
                        style={styles.sendEmailButton}
                        onPress={
                            () => {
                                this.sendEmail();
                            }}
                    >
                        <Text style={styles.sendEmailText}> Send Email </Text>
                    </TouchableOpacity>
                    <View style={styles.inputs}>
                        <Text style={styles.loginText}>Login with your new password </Text>
                        <Text
                            style={styles.hereText}
                            onPress={() => this.props.navigation.goBack()}
                        >here </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        marginTop: 220,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Futura',
        fontSize: 40,
        textAlign: 'center',
        marginBottom: 30,
    },
    inputs: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emailIcon: {
        marginLeft: 30,
        marginBottom: -5,
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
    sendEmailButton: {
        backgroundColor: '#000000',
        borderRadius: 20,
        padding: 10,
        margin: 15,
        marginTop: 40,
        height: 40,
        width: 200,
        alignItems: 'center',
        marginBottom: -30,
    },
    sendEmailText: {
        fontFamily: 'Futura',
        color: 'white',
        fontSize: 16,
    },
    loginText: {
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
