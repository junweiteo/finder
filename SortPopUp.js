import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions
} from "react-native";
import { CheckBox } from 'react-native-elements'
import Loader from "./Loader";

const { width, height } = Dimensions.get('window')

class SortPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkbox1 : false,
            checkbox2 : false,
            checkbox3 : false,
            checkbox4 : false,
            loading: false,
        };
    }


    goBackPriceDown() {
        const { navigation, route } = this.props;
        navigation.goBack();
        route.params.sortPriceDown();
    }

    goBackPriceUp() {
        const { navigation, route } = this.props;
        navigation.goBack();
        route.params.sortPriceUp();
    }

    goBackAtoZ() {
        const { navigation, route } = this.props;
        navigation.goBack();
        route.params.sortAtoZ();
    }

    goBackZtoA() {
        const { navigation, route } = this.props;
        navigation.goBack();
        route.params.sortZtoA();
    }

    loading() {
        this.setState({
            loading: true,
        });
        setTimeout(() => {
            this.setState({
                loading: false,
            });
        }, 1000);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.checkboxContainer}>
                    <Loader
                        loading={this.state.loading} />
                    <View style={styles.padView}>
                    <Text style={styles.title}> Sort </Text>
                    </View>
                    <CheckBox
                        title= 'Price: Highest to Lowest'
                        containerStyle={styles.checkbox}
                        value={this.state.checkbox1}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        onPress={() =>
                        {this.setState({ checkbox1: !this.state.checkbox1 });
                            this.goBackPriceDown(); this.loading()} }
                        checked={this.state.checkbox1}
                    />
                    <CheckBox
                        title = 'Price: Lowest to Highest'
                        containerStyle={styles.checkbox}
                        value={this.state.checkbox2}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        onPress={() =>
                        {this.setState({ checkbox2: !this.state.checkbox2 });
                            this.goBackPriceUp(); this.loading()} }
                        checked={this.state.checkbox2}
                    />
                    <CheckBox
                        title = 'Item: A to Z'
                        containerStyle={styles.checkbox}
                        value={this.state.checkbox3}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        onPress={() =>
                        {this.setState({ checkbox3: !this.state.checkbox3 });
                            this.goBackAtoZ(); this.loading()} }
                        checked={this.state.checkbox3}
                    />
                    <CheckBox
                        title = 'Item: Z to A'
                        containerStyle={styles.checkbox}
                        value={this.state.checkbox4}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        onPress={() =>
                        {this.setState({ checkbox4: !this.state.checkbox4 });
                            this.goBackZtoA(); this.loading()} }
                        checked={this.state.checkbox4}
                    />
                    <TouchableOpacity
                        style = {styles.backButton}
                        onPress = {this.props.navigation.goBack}
                    >
                        <Text style={styles.backButtonText}> Back </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    padView: {
        height: 50,
    },
    title: {
        fontFamily:'Futura',
        fontSize: 30,
        height: height * 0.07,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 5,
    },
    checkboxContainer: {
        height: height * 0.6,
        width: width,
        backgroundColor:"#fff",
        justifyContent:"center",
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
    },
    checkbox: {
        width: width * 0.95,
        borderRadius: 10,
        marginTop: height * 0.02,
        alignSelf: 'center',
    },
    backButtonText: {
        color: '#fff8dc',
        fontFamily: 'Futura',
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: "#000000",
        borderRadius: 20,
        padding: 10,
        marginTop: height * 0.05,
        width: width * 0.25,
        alignSelf: 'center',
    }
});

export default SortPopUp;
