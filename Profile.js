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
    StatusBar, Dimensions
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon1 from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/Fontisto";
import * as Firebase from 'firebase/app';
import {BarPasswordStrengthDisplay} from 'react-native-password-strength-meter';
import firebase from "./config";

const { height } = Dimensions.get('window');

export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nameInputDisableStatus: false,
            emailInputDisableStatus: false,
            passwordInputDisableStatus: false,
            showEditNameButton: true,
            showEditEmailButton: true,
            showNewEmailBox: false,
            showEditPasswordButton: true,
            showNewPasswordBox: false,
            showUpdateNameButton: false,
            showUpdateEmailButton: false,
            showUpdatePasswordButton: false,
            name: '',
            email: '',
            confirmEmail: '',
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            passwordMeterShown: false,
            passwordTooShort: false,
            samePasswords: true,
        }
    }

    handleName = (name) => {
        this.setState({name: name});
    }

    handleEmail = (email) => {
        this.setState({email: email})
    }

    handleConfirmEmail = (email) => {
        this.setState({confirmEmail: email});
    }

    handleOldPassword = (password) => {
        this.setState({oldPassword: password})
    }

    handleNewPassword = (password) => {
        if (password.length < 6) {
            this.setState({passwordTooShort: true});
            this.setState({passwordMeterShown: false});
            this.setState({newPassword: password})
        } else {
            this.setState({passwordTooShort: false});
            this.setState({passwordMeterShown: true});
            this.setState({newPassword: password})
        }
    }

    handleConfirmNewPassword = (password) => {
        if (password != this.state.newPassword) {
            this.setState({samePasswords: false})
        } else {
            this.setState({samePasswords: true});
            this.setState({confirmNewPassword: password});
        }
    }

    editName = () => {
        this.setState({
            nameInputDisableStatus: true,
            showEditNameButton: false,
            showEditEmailButton: false,
            showEditPasswordButton: false,
            showUpdateNameButton: true,
        })
    }

    editEmail = () => {
        this.setState({
            emailInputDisableStatus: true,
            showEditNameButton: false,
            showEditEmailButton: false,
            showEditPasswordButton: false,
            showNewEmailBox: true,
            showUpdateEmailButton: true,
        })
    }

    editPassword = () => {
        this.setState({
            passwordInputDisableStatus: true,
            showEditNameButton: false,
            showEditEmailButton: false,
            showEditPasswordButton: false,
            showNewPasswordBox: true,
            showUpdatePasswordButton: true,
        })
    }

    goBack = () => {
        this.setState({
            nameInputDisableStatus: false,
            emailInputDisableStatus: false,
            passwordInputDisableStatus: false,
            showEditNameButton: true,
            showEditEmailButton: true,
            showEditPasswordButton: true,
            showNewEmailBox: false,
            showNewPasswordBox: false,
            showUpdateNameButton: false,
            showUpdateEmailButton: false,
            showUpdatePasswordButton: false,
        });
    }

    updateName = () => {
        this.setState({
            nameInputDisableStatus: false,
            showEditNameButton: true,
            showEditEmailButton: true,
            showEditPasswordButton: true,
            showUpdateNameButton: false,
        });
        firebase.auth().currentUser.updateProfile({
            displayName: this.state.name,
        });
        firebase.firestore()
            .collection('users')
            .doc(`${firebase.auth().currentUser.uid}`)
            .update({
                name: this.state.name
            })
    }

    updateEmail = () => {
        this.setState({
            emailInputDisableStatus: false,
            showEditNameButton: true,
            showEditEmailButton: true,
            showEditPasswordButton: true,
            showNewEmailBox: false,
            showUpdateEmailButton: false,
        });
        if (this.state.email == this.state.confirmEmail) {
            firebase.auth().currentUser.updateEmail(this.state.email)
                .then(() => {
                    Alert.alert(
                        'Email Updated',
                        'Your new email is ' + this.state.confirmEmail + '.');
                    firebase.firestore()
                        .collection('users')
                        .doc(`${firebase.auth().currentUser.uid}`)
                        .update({
                            email: this.state.email
                        })
                })
                .catch(error => {
                    if (error.code == 'auth/email-already-in-use') {
                        Alert.alert(
                            'Email Already Exists',
                            'Please enter a different email and try again.',
                            [{text: 'Try again'}])
                    } else if (error.code == 'auth/invalid-email') {
                        Alert.alert(
                            'Invalid Email',
                            'The email you entered is invalid. Please check your email and try again.',
                            [{text: 'Try again'}])
                    }
                });
        } else {
            Alert.alert(
                'Emails Mismatch',
                'Emails do not match. Please check your email and try again.',
                [{text: 'Try again'}])
        }
    }

    updatePassword = () => {
        this.setState({
            passwordInputDisableStatus: false,
            showEditNameButton: true,
            showEditEmailButton: true,
            showEditPasswordButton: true,
            showNewPasswordBox: false,
            showUpdatePasswordButton: false,
        });
        this.reauthenticate(this.state.oldPassword)
            .then(() => {
                firebase.auth().currentUser.updatePassword(this.state.newPassword)
                    .then(() => {
                        if (this.state.newPassword != this.state.confirmNewPassword) {
                            throw new Error();
                        } else {
                            Alert.alert(
                                'Password Updated',
                                'You can now sign in with your new password.');
                            firebase.auth().signOut()
                                .then(() => this.props.navigation.navigate('Home'));
                        }
                    })
                    .catch(() => {
                        if (this.state.newPassword.length < 6) {
                            Alert.alert(
                                'Password Too Short',
                                'New password must contain at least 6 characters. Please check your new password and try again.',
                                [{text: 'Try again'}]);
                        } else if (this.state.newPassword != this.state.confirmNewPassword) {
                            Alert.alert(
                                'Passwords Mismatch',
                                'New passwords do not match. Please check your new password and try again.',
                                [{text: 'Try again'}])
                        }
                    })
            })
            .catch((error) => {
                if (error.code == 'auth/wrong-password') {
                    Alert.alert(
                        'Wrong Password',
                        'The current password you entered is wrong. Please check your current password and try again.',
                        [{text: 'Try again'}])
                }
            });
    }

    reauthenticate = (password) => {
        const user = firebase.auth().currentUser;
        const cred = Firebase.auth.EmailAuthProvider.credential(user.email, password);
        return user.reauthenticateWithCredential(cred);
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <StatusBar barStyle="dark-content" backgroundColor="#000000"/>
                    <View style={styles.title}>
                        <Icon name="face" size={70}/>
                        <Text style={styles.titleText}> Profile </Text>
                    </View>

                    <View style={styles.inputs}>
                        <Icon1 name="person" size={20} style={styles.nameIcon}/>
                        <TextInput
                            style={[styles.nameBox, {borderBottomWidth: this.state.nameInputDisableStatus ? 2 : 0}]}
                            placeholder={firebase.auth().currentUser.displayName}
                            placeholderTextColor={this.state.nameInputDisableStatus ? 'silver' : 'black'}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={this.handleName}
                            editable={this.state.nameInputDisableStatus}/>
                    </View>
                    {this.state.showEditNameButton ?
                        (<TouchableOpacity
                            onPress={() => this.editName()}>
                            <View style={styles.editNameButton}>
                                <Icon1 name="edit" size={20}/>
                            </View>
                        </TouchableOpacity>)
                        :
                        null}

                    <View style={styles.inputs}>
                        <Icon name="email" size={16} style={styles.emailIcon}/>
                        <TextInput
                            style={[styles.emailBox, {borderBottomWidth: this.state.emailInputDisableStatus ? 2 : 0}]}
                            placeholder={this.state.showNewEmailBox ? 'New Email' : firebase.auth().currentUser.email}
                            placeholderTextColor={this.state.emailInputDisableStatus ? 'silver' : 'black'}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={this.handleEmail}
                            editable={this.state.emailInputDisableStatus}
                        />
                    </View>
                    {this.state.showEditEmailButton ?
                        (<TouchableOpacity
                            onPress={() => this.editEmail()}>
                            <View style={styles.editEmailButton}>
                                <Icon1 name="edit" size={20}/>
                            </View>
                        </TouchableOpacity>)
                        :
                        null}
                    {this.state.showNewEmailBox ?
                        (<View style={styles.inputs}>
                            <Icon name="email" size={16} style={styles.emailIcon}/>
                            <TextInput
                                style={[styles.emailBox, {borderBottomWidth: this.state.emailInputDisableStatus ? 2 : 0}]}
                                placeholder={'Confirm New Email'}
                                placeholderTextColor={'silver'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                textContentType={'emailAddress'}
                                onChangeText={this.handleConfirmEmail}
                                editable={this.state.emailInputDisableStatus}/>
                        </View>)
                        :
                        null
                    }

                    <View style={styles.inputs}>
                        <Icon2 name="locked" size={16} style={styles.passwordIcon}/>
                        <TextInput
                            style={[styles.passwordBox,
                                {
                                    borderBottomWidth: this.state.passwordInputDisableStatus ? 2 : 0,
                                    borderBottomColor: 'grey'
                                }]}
                            placeholder={this.state.passwordInputDisableStatus ? 'Old Password' : 'Password'}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={true}
                            onChangeText={this.handleOldPassword}
                            editable={this.state.passwordInputDisableStatus}/>
                    </View>
                    {this.state.showEditPasswordButton ?
                        (<TouchableOpacity
                            onPress={() => this.editPassword()}>
                            <View style={styles.editPasswordButton}>
                                <Icon1 name="edit" size={20}/>
                            </View>
                        </TouchableOpacity>)
                        :
                        null
                    }
                    {this.state.showNewPasswordBox ?
                        (<View style={{alignItems: 'center'}}>
                            <View style={styles.inputs}>
                                <Icon2 name="locked" size={16} style={styles.passwordIcon}/>
                                <TextInput
                                    style={[styles.passwordBox,
                                        {
                                            borderBottomWidth: this.state.passwordInputDisableStatus ? 2 : 0,
                                            borderBottomColor: this.state.passwordTooShort ? 'red' : 'grey'
                                        }]}
                                    placeholder={'New Password'}
                                    placeholderTextColor={'silver'}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={true}
                                    textContentType={'newPassword'}
                                    onChangeText={this.handleNewPassword}
                                    editable={this.state.passwordInputDisableStatus}/>
                            </View>
                            {this.state.passwordTooShort ?
                                (<Text style={styles.passwordTooShort}>Password must contain at least 6
                                    characters.</Text>)
                                :
                                null
                            }
                            {this.state.passwordMeterShown ?
                                (<BarPasswordStrengthDisplay
                                    password={this.state.newPassword}
                                    width={330}
                                    minLength={6}
                                    barColor={'white'}
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
                                <Icon2 name="locked" size={16} style={styles.passwordIcon}/>
                                <TextInput
                                    style={[styles.passwordBox,
                                        {
                                            borderBottomWidth: this.state.passwordInputDisableStatus ? 2 : 0,
                                            borderBottomColor: this.state.samePasswords ? 'grey' : 'red'
                                        }]}
                                    placeholder={'Confirm New Password'}
                                    placeholderTextColor={'silver'}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={true}
                                    textContentType={'newPassword'}
                                    onChangeText={this.handleConfirmNewPassword}
                                    editable={this.state.passwordInputDisableStatus}/>
                            </View>
                            {this.state.samePasswords ?
                                null
                                :
                                (<Text style={styles.passwordMismatch}>Passwords do not match.</Text>)
                            }
                        </View>)
                        :
                        null
                    }

                    {this.state.showUpdateNameButton ?
                        (<TouchableOpacity
                            style={styles.updateButton}
                            onPress={() => {
                                this.updateName()
                            }}>
                            <Text style={styles.updateText}> Update Name </Text>
                        </TouchableOpacity>)
                        :
                        null
                    }

                    {this.state.showUpdateEmailButton ?
                        (<TouchableOpacity
                            style={styles.updateButton}
                            onPress={() => {
                                this.updateEmail()
                            }}>
                            <Text style={styles.updateText}> Update Email </Text>
                        </TouchableOpacity>)
                        :
                        null
                    }

                    {this.state.showUpdatePasswordButton ?
                        (<TouchableOpacity
                            style={styles.updateButton}
                            onPress={() => {
                                this.updatePassword()
                            }}>
                            <Text style={styles.updateText}> Update Password </Text>
                        </TouchableOpacity>)
                        :
                        null
                    }

                    <TouchableOpacity
                        style={[styles.deleteButton,
                            {
                                marginTop:
                                    this.state.showNewEmailBox ? (height * 0.177) :
                                        this.state.showUpdateNameButton ? (height * 0.255) :
                                            this.state.showNewPasswordBox ? (height * 0.099) : (height * 0.3)
                            }]}
                        onPress={() => {
                            Alert.alert(
                                'You are about to delete your account.',
                                'Are you sure you want to delete your account?',
                                [
                                    {
                                        text: 'Yes',
                                        onPress: () =>
                                            Alert.prompt(
                                                'Enter your password to delete your account.',
                                                '',
                                                [
                                                    {
                                                        text: 'Cancel'
                                                    },
                                                    {
                                                        text: 'Delete',
                                                        onPress: (password) => {
                                                            firebase.firestore()
                                                                .collection('users')
                                                                .doc(`${firebase.auth().currentUser.uid}`)
                                                                .delete();
                                                            this.reauthenticate(password)
                                                                .then(() => {
                                                                    firebase.auth().currentUser.delete()
                                                                        .then(() => {
                                                                            this.props.navigation.navigate('Home');
                                                                            Alert.alert('Account Deleted',
                                                                                'Your account has been deleted successfully.'
                                                                            );
                                                                        })
                                                                        .catch((error) => {
                                                                        });
                                                                })
                                                                .catch((error) => {
                                                                    if (error.code == 'auth/wrong-password') {
                                                                        Alert.alert(
                                                                            'Wrong Password',
                                                                            'The password you entered is wrong. Please check your password and try again.',
                                                                            [{text: 'Try again'}])
                                                                    }
                                                                });
                                                            console.log("Delete Pressed, password: " + password);
                                                        }
                                                    },
                                                ],
                                                "secure-text"
                                            )
                                    },
                                    {
                                        text: 'No'
                                    }
                                ],
                                {cancelable: false}
                            )
                        }}>
                        <Text style={styles.deleteText}> Delete Account </Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 100,
        alignItems: 'center',
    },
    title: {
        margin: 25,
        marginTop: 10,
        height: 65,
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 55,
    },
    titleText: {
        color: 'black',
        fontFamily: 'Futura',
        fontSize: 40,
    },
    inputs: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameIcon: {
        marginLeft: 30,
        marginBottom: -30,
    },
    nameBox: {
        height: 40,
        color: 'black',
        marginLeft: -45,
        borderBottomColor: 'grey',
        fontSize: 16,
        width: '80%',
        textAlign: 'center',
        fontFamily: 'Futura',
        alignItems: 'center',
        marginTop: 30
    },
    editNameButton: {
        margin: 25,
        marginTop: -32,
        marginBottom: -10,
        height: 26,
        left: 150,
        alignItems: 'center'
    },
    emailIcon: {
        marginLeft: 30,
        marginBottom: -30,
    },
    emailBox: {
        height: 40,
        color: 'black',
        marginLeft: -45,
        borderBottomColor: 'grey',
        fontSize: 16,
        width: '80%',
        textAlign: 'center',
        fontFamily: 'Futura',
        alignItems: 'center',
        marginTop: 30,
    },
    editEmailButton: {
        margin: 25,
        marginTop: -32,
        marginBottom: -10,
        height: 26,
        left: 150,
        alignItems: 'center'
    },
    passwordIcon: {
        marginLeft: 30,
        marginBottom: -30,
    },
    passwordBox: {
        height: 40,
        color: 'black',
        marginLeft: -45,
        fontSize: 16,
        width: '80%',
        textAlign: 'center',
        fontFamily: 'Futura',
        alignItems: 'center',
        marginTop: 30,
    },
    editPasswordButton: {
        margin: 25,
        marginTop: -32,
        marginBottom: -10,
        height: 26,
        left: 150,
        alignItems: 'center'
    },
    passwordTooShort: {
        fontFamily: 'Futura',
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 5,
    },
    passwordMismatch: {
        fontFamily: 'Futura',
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 5,
    },
    updateButton: {
        backgroundColor: '#000000',
        borderRadius: 20,
        padding: 10,
        margin: 15,
        marginTop: 30,
        height: 40,
        width: 200,
        alignItems: 'center',
        marginBottom: -30,
    },
    updateText: {
        fontFamily: 'Futura',
        color: 'white',
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: '#f31541',
        borderRadius: 20,
        padding: 10,
        margin: 15,
        height: 40,
        width: 200,
        alignItems: 'center',
    },
    deleteText: {
        fontFamily: 'Futura',
        color: 'white',
        fontSize: 16,
    },
})
