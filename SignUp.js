import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import Icon from "react-native-vector-icons/Fontisto";
import Icon1 from "react-native-vector-icons/MaterialIcons";
import {BarPasswordStrengthDisplay} from 'react-native-password-strength-meter';
import firebase from './config';

export default class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            passwordMeterShown: false,
            passwordTooShort: false,
            samePasswords: true,
        }
    }

    handleName = (name) => {
        this.setState({name: name})
    }

    handleEmail = (email) => {
        this.setState({email: email})
    }

    handlePassword = (password) => {
        if (password.length < 6) {
            this.setState({passwordTooShort: true});
            this.setState({passwordMeterShown: false});
            this.setState({password: password})
        } else {
            this.setState({passwordTooShort: false});
            this.setState({passwordMeterShown: true});
            this.setState({password: password})
        }
    }

    handleConfirmPassword = (password) => {
        if (password != this.state.password) {
            this.setState({samePasswords: false})
        } else {
            this.setState({samePasswords: true});
            this.setState({confirmPassword: password});
        }
    }

    handleNewUser = () => firebase.firestore()
        .collection('users')
        .doc(`${firebase.auth().currentUser.uid}`)
        .set({
            UID: firebase.auth().currentUser.uid,
            name: this.state.name,
            email: firebase.auth().currentUser.email,
            favourites: []
        })

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

    signUp = () => {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((res) => {
                if (this.state.password != this.state.confirmPassword) {
                    throw new Error();
                } else {
                    res.user.updateProfile({
                        displayName: this.state.name
                    });
                    this.login();
                    this.handleNewUser();
                }
            })
            .catch(error => {
                if (error.code == 'auth/invalid-email') {
                    Alert.alert(
                        'Invalid Email',
                        'The email you entered is invalid. Please check your email and try again.',
                        [{text: 'Try again'}])
                } else if (error.code == 'auth/email-already-in-use') {
                    Alert.alert(
                        'Email Already Exists',
                        'Please enter a different email and try again.',
                        [{text: 'Try again'}])
                } else if (this.state.password.length < 6) {
                    Alert.alert(
                        'Password Too Short',
                        'Password must contain at least 6 characters. Please check your password and try again.',
                        [{text: 'Try again'}])
                } else if (this.state.password != this.state.confirmPassword) {
                    Alert.alert(
                        'Passwords Mismatch',
                        'Passwords do not match. Please check your password and try again.',
                        [{text: 'Try again'}])
                }
            })
    }

    render() {

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{backgroundColor: '#f7e3e7'}}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Sign Up Now!</Text>
                        <View style={styles.inputs}>
                            <Icon1 name="face" size={20} style={styles.nameIcon}/>
                            <TextInput style={styles.nameBox}
                                       placeholder="Display Name"
                                       autoCapitalize={'words'}
                                       autoCorrect={false}
                                       textContentType={'name'}
                                       onChangeText={this.handleName}/>
                        </View>
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
                            <TextInput
                                style={[styles.passwordBox, {borderBottomColor: this.state.passwordTooShort ? 'red' : 'grey'}]}
                                placeholder="Password"
                                autoCapitalize="none"
                                maxLength={20}
                                autoCorrect={false}
                                secureTextEntry={true}
                                textContentType={'newPassword'}
                                onChangeText={this.handlePassword}
                            />
                        </View>
                        {this.state.passwordTooShort ?
                            (<Text style={styles.passwordTooShort}>Password must contain at least 6 characters.</Text>)
                            :
                            null
                        }
                        {this.state.passwordMeterShown ?
                            (<BarPasswordStrengthDisplay
                                password={this.state.password}
                                width={330}
                                minLength={6}
                                levels={[
                                    {
                                        label: 'Very weak',
                                        labelColor: '#ff5400',
                                        activeBarColor: '#ff5400',
                                    },
                                    {
                                        label: 'Weak',
                                        labelColor: '#ff6900',
                                        activeBarColor: '#ff6900',
                                    },
                                    {
                                        label: 'Fair',
                                        labelColor: '#fff200',
                                        activeBarColor: '#fff200',
                                    },
                                    {
                                        label: 'Strong',
                                        labelColor: '#14eb6e',
                                        activeBarColor: '#14eb6e',
                                    },
                                    {
                                        label: 'Very strong',
                                        labelColor: '#00ff6b',
                                        activeBarColor: '#00ff6b',
                                    },
                                ]}
                            />)
                            :
                            null
                        }
                        <View style={styles.inputs}>
                            <Icon name="locked" size={16} style={styles.confirmPasswordIcon}/>
                            <TextInput
                                style={[styles.confirmPasswordBox, {borderBottomColor: this.state.samePasswords ? 'grey' : 'red'}]}
                                placeholder="Confirm Password"
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry={true}
                                textContentType={'newPassword'}
                                onChangeText={this.handleConfirmPassword}/>
                        </View>
                        {this.state.samePasswords ?
                            null
                            :
                            (<Text style={styles.passwordMismatch}>Passwords do not match.</Text>)
                        }
                        <TouchableOpacity
                            style={styles.signUpButton}
                            onPress={
                                () => {
                                    this.signUp();
                                }}
                        >
                            <Text style={styles.signUpText}> Sign Up </Text>
                        </TouchableOpacity>
                        <View style={styles.inputs}>
                            <Text style={styles.loginText}>Have an account? Login </Text>
                            <Text
                                style={styles.hereText}
                                onPress={() => this.props.navigation.navigate('Home')}
                            >here </Text>
                        </View>
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
        backgroundColor: '#f7e3e7',
        height: '100%',
        width: '100%',
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
    nameIcon: {
        marginLeft: 30,
    },
    nameBox: {
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
    },
    emailIcon: {
        marginLeft: 30,
        marginBottom: -22,
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
        marginTop: 22,
    },
    passwordIcon: {
        marginLeft: 30,
        marginBottom: -11,
    },
    passwordBox: {
        height: 40,
        marginTop: 20,
        color: 'black',
        marginLeft: -45,
        fontSize: 16,
        borderBottomWidth: 2,
        width: '80%',
        textAlign: 'center',
        fontFamily: 'Futura',
        alignItems: 'center',
        marginBottom: 5,
    },
    passwordTooShort: {
        fontFamily: 'Futura',
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 5,
    },
    confirmPasswordIcon: {
        marginLeft: 30,
        marginBottom: -12,
    },
    confirmPasswordBox: {
        height: 40,
        marginTop: 17,
        color: 'black',
        marginLeft: -45,
        fontSize: 16,
        borderBottomWidth: 2,
        width: '80%',
        textAlign: 'center',
        fontFamily: 'Futura',
        alignItems: 'center',
    },
    passwordMismatch: {
        fontFamily: 'Futura',
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 5,
    },
    signUpButton: {
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
    signUpText: {
        fontFamily: 'Futura',
        color: 'white',
    },
    loginText: {
        fontFamily: 'Futura',
        color: 'black',
        marginTop: 50,
        fontSize: 16,
        marginBottom: -60,
    },
    hereText: {
        fontFamily: 'Futura',
        color: 'black',
        textDecorationLine: 'underline',
        marginTop: 50,
        fontSize: 16,
        marginBottom: -60,
    }
})
