import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput, Keyboard, TouchableWithoutFeedback,
} from "react-native";
import ModalFilterPicker from 'react-native-modal-filter-picker';
import Loader from "./Loader";

let options = require('./brands.json');

class FilterPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            priceFrom: '',
            priceTo: '',
            brands: [],
            visible: false,
            loading: false
        };
    }

    handlePriceFrom = min => {
        this.setState({priceFrom: min})
    }

    handlePriceTo = max => {
        this.setState({priceTo: max})
    }

    goBack() {
        const { navigation, route } = this.props;
        navigation.goBack();
        route.params.filterPriceandBrand(this.state.priceFrom, this.state.priceTo, this.state.brands);
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
        const { visible, brands } = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.filterContainer}>
                    <Text style={styles.title}> Filter </Text>
                    <Text style={styles.priceText}> Price Range: </Text>
                    <View style={{flexDirection:"row"}}>
                        <View style={{flex:1}}>
                            <TextInput style = {styles.priceFrom}
                                       keyboardType={'numeric'}
                                       placeholder="Price From"
                                       onChangeText = {min => this.handlePriceFrom(min)}
                            />
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style = {styles.priceTo}
                                       keyboardType={'numeric'}
                                       placeholder="Price To"
                                       onChangeText = {max => this.handlePriceTo(max)}
                            />
                        </View>
                    </View>
                    <Text style={styles.brandText}> Brand: </Text>
                    {/*<ScrollingBrands />*/}
                    <View style={stylesModal.container}>
                        <TouchableOpacity style={stylesModal.buttonContainer}
                                          onPress={this.onShow}>
                            <Text style={stylesModal.buttonText}> Select Brands Here </Text>
                        </TouchableOpacity>
                        <Text style={stylesModal.label}>
                            Selected: {brands} </Text>
                        <ModalFilterPicker
                            visible={visible}
                            options={options}
                            onSelect={this.onSelect}
                            onCancel={this.onCancel}
                            placeholderText={'Filter brands...'}
                            cancelButtonText={'Back'}
                            overlayStyle={stylesModal.modalBackground}
                            listContainerStyle={stylesModal.modalContainer}
                            filterTextInputStyle={stylesModal.filterText}
                            optionTextStyle={stylesModal.optionsText}
                            cancelButtonTextStyle={stylesModal.backButtonText}
                            cancelButtonStyle={stylesModal.backButton}
                        />
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <View style={{flex:1}}>
                            <TouchableOpacity
                                style = {styles.backButton}
                                onPress = {this.props.navigation.goBack}
                            >
                                <Text style={styles.backButtonText}> Back </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{borderLeftWidth: 0, borderLeftColor: 'white'}}/>
                        <View style={{ flex: 1}}>
                            <Loader
                                loading={this.state.loading} />
                            <TouchableOpacity
                                style = {styles.doneButton}
                                onPress = { () => {this.goBack(); this.loading() }}
                            >
                                <Text style={styles.backButtonText}> Done </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            </TouchableWithoutFeedback>
        );
    }

    onShow = () => {
        this.setState({ visible: true });
    }

    onSelect = (item) => {
        if (this.state.brands.includes(item.label)) {
            this.setState({
                brands: this.state.brands,
                visible: false
            });
        } else {
            this.setState({
                brands: this.state.brands + item.label + ', ' ,
                visible: false
            });
        }
    }

    onCancel = () => {
        this.setState({
            visible: false
        });
    }
}

const styles = StyleSheet.create({
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
    title: {
        fontFamily:'Futura',
        fontSize: 30,
        height: 60,
        marginTop: 25,
        textAlign: 'center',
    },
    filterContainer: {
        height: "60%",
        width: '100%',
        backgroundColor:"#fff",
        justifyContent:"center",
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
    },
    priceText: {
        fontFamily:'Futura',
        fontSize: 18,
        height: 40,
        marginTop: 5,
        color: '#696969',
        textAlign: 'center',
    },
    priceFrom: {
        justifyContent: 'flex-start',
        textAlign:'center',
        borderColor: '#dcdcdc',
        borderWidth: 1,
        height: 40,
        marginTop: 5,
        marginBottom: 10,
        margin: 50,
    },
    priceTo: {
        justifyContent: 'flex-end',
        textAlign:'center',
        borderColor: '#dcdcdc',
        borderWidth: 1,
        height: 40,
        marginTop: 5,
        marginBottom: 10,
        margin: 50,
    },
    brandText: {
        fontFamily:'Futura',
        fontSize: 18,
        height: 40,
        marginTop: 10,
        color: '#696969',
        textAlign: 'center',
    },
    backButtonText: {
        color: '#fff8dc',
        fontFamily: 'Futura',
        textAlign: 'center',
    },
    backButton: {
        justifyContent: 'flex-start',
        backgroundColor: "#000000",
        borderRadius: 20,
        padding: 10,
        marginBottom: 60,
        width: 100,
        alignSelf: 'center',
    },
    doneButton: {
        justifyContent: 'flex-end',
        backgroundColor: "#000000",
        borderRadius: 20,
        padding: 10,
        marginBottom: 60,
        width: 100,
        alignSelf: 'center',
    },
});

const stylesModal = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    buttonContainer: {
        backgroundColor: "#dcdcdc",
        borderRadius: 20,
        padding: 10,
        marginTop: -60,
        margin: 10,
        width: 180,
    },
    label: {
        textAlign: 'center',
        color: '#808080',
        fontFamily:'Futura',
    },
    buttonText: {
        color: '#808080',
        fontFamily:'Futura',
        textAlign: 'center',
    },
    modalBackground: {
        backgroundColor: 'black',
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    modalContainer: {
        flex: 1,
        width: 300,
        margin: 100,
        backgroundColor: 'white',
        borderRadius: 15,
    },
    filterText: {
        fontFamily:'Futura',
        fontSize: 15,
        color: 'black',
        padding: 13,
        textAlign: 'left',
    },
    optionsText: {
        fontFamily: 'Futura',
        fontSize: 15,
    },
    backButtonText: {
        color: 'black',
        fontFamily: 'Futura',
        textAlign: 'center',
    },
    backButton: {
        justifyContent: 'flex-start',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        marginTop: -40,
        marginBottom: 60,
        width: 100,
        alignSelf: 'center',
    },
});

export default FilterPopUp;
