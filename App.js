import React from 'react';
import {
    StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from "./Home";
import WelcomePage from "./WelcomePage";
import SignUp from "./SignUp";
import Main from './Main';
import MainList from "./MainList";
import SortPopUp from "./SortPopUp";
import FilterPopUp from "./FilterPopUp";
import Favourites from "./Favourites";
import Icon from "react-native-vector-icons/FontAwesome5";
import ForgotPassword from "./ForgotPassword";
import Profile from "./Profile";

const Stack = createStackNavigator();
const RootStack = createStackNavigator();
console.disableYellowBox = true;

function StackScreen({navigation}) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#000000',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontFamily: 'Futura',
                },
                headerBackTitleStyle: {
                    fontFamily: 'Futura',
                },
            }}>
            <Stack.Screen name="Home"
                          component={Home}
                          options={{
                              title: 'Home',
                              headerShown: false,
                          }}/>
            <Stack.Screen name="WelcomePage"
                          component={WelcomePage}
                          options={{
                              title: 'WelcomePage',
                              headerShown: false,
                              gestureEnabled: false,
                          }}
            />
            <Stack.Screen name="SignUp"
                          component={SignUp}
                          options={{
                              title: 'Sign Up',
                              headerShown: false,
                          }}
            />
            <Stack.Screen name="ForgotPassword"
                          component={ForgotPassword}
                          options={{
                              title: 'Forgot Password',
                              headerShown: false,
                          }}
            />
            <Stack.Screen name="Profile"
                          component={Profile}
                          options={{
                              title: '',
                              headerTransparent: true,
                              headerBackTitle: 'Back',
                              headerTintColor: 'black',
                          }}
            />
            <Stack.Screen name="Main"
                          component={Main}
                          options={{
                              title: 'Search',
                              headerLeft: null,
                              headerRight: () =>
                                  <Icon name={"heart"}
                                        color={"white"}
                                        size={20}
                                        onPress={() => navigation.navigate('Favourites')}
                                        style={{marginRight: 20}}
                                  />,
                              gestureEnabled: false,
                          }}
            />
            <Stack.Screen name="MainList"
                          component={MainList}
                          options={{
                              title: 'Search',
                              headerLeft: null,
                              headerRight: () =>
                                  <Icon name={"heart"}
                                        color={"white"}
                                        size={20}
                                        onPress={() => navigation.navigate('Favourites')}
                                        style={{marginRight: 20}}
                                  />,
                              gestureEnabled: false,
                          }}
            />
            <Stack.Screen name="Favourites"
                          component={Favourites}
                          options={{
                              title: 'Favourites',
                              headerBackTitle: 'Back'
                          }}
            />
        </Stack.Navigator>
    )
}

export default function App() {

    return (
        <NavigationContainer>
            <RootStack.Navigator mode = "modal"
                                 headerMode = "none"
            >
                <RootStack.Screen name="Main"
                                  component={StackScreen} />
                <RootStack.Screen name="SortPopUp"
                                  component={SortPopUp}
                                  options={{
                                      headerTransparent: true,
                                      cardStyle: {backgroundColor: "transparent"},
                                  }}
                />
                <RootStack.Screen name="FilterPopUp"
                                  component={FilterPopUp}
                                  options={{
                                      headerTransparent: true,
                                      cardStyle: {backgroundColor: "transparent"},
                                  }}
                />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButton: {
        backgroundColor: '#000000',
        borderRadius: 20,
        padding: 10,
        margin: 15,
        marginTop: 30,
        height: 40,
        width: '50%',
        marginLeft: 100,
        alignItems: 'center',
    },
    loginText: {
        color: '#fff8dc',
        fontFamily: 'Futura',
    },
    signUpButton: {
        backgroundColor: '#000000',
        borderRadius: 20,
        padding: 10,
        margin: 15,
        height: 40,
        marginLeft: 100,
        marginBottom: -50,
        width: '50%',
        alignItems: 'center',
    },
    signUpText: {
        color: '#fff8dc',
        fontFamily: 'Futura',
    },
    startButton: {
        backgroundColor: '#000000',
        borderRadius: 20,
        padding: 10,
        margin: 15,
        marginTop: 30,
        height: 40,
        alignItems: 'center'
    },
    startButtonText: {
        color: '#fff8dc',
        fontFamily: 'Futura',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
})
