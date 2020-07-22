import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
} from 'react-native';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import firebase from "./config";

export default class WelcomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: firebase.auth().currentUser.displayName
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}> Welcome, {this.state.name} </Text>
                </View>
                <TouchableOpacity
                    onPress={() =>
                        this.props.navigation.navigate('Main')}>
                        <Icon name="arrow-right-circle" size={40} style={styles.arrowIcon}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#fff0f5',
        height: '100%',
        width: '100%',
    },
    title: {
        fontFamily: 'Futura',
        textAlign: 'center',
        marginBottom: 30,
    },
    titleText: {
        marginTop: 180,
        fontFamily: 'Futura',
        fontSize: 35,
        textAlign: 'center',
        marginBottom: 30,
    },
    arrowIcon: {
        marginTop: 250,
    }
})

