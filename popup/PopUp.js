import React, { Component } from "react";
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight, TouchableOpacity,
    View,
} from "react-native";
import AddReview from "./AddReview";
import Icon from "react-native-vector-icons/MaterialIcons";

class PopUp extends Component {
    state = {
        modalVisible: false
    };

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    render() {
        const { modalVisible } = this.state;
        return (

            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <AddReview />
                            <TouchableHighlight
                                style={styles.backButton}
                                onPress={() => {
                                    this.setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.backTextStyle}>Back</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>

                <TouchableOpacity
                    onPress={() => {
                        this.setModalVisible(true);
                    }}
                >
                    <View style={styles.openButton}>
                        <Icon name="rate-review" size={29}/>
                        <Text style={styles.feedbackTextStyle}>Feedback</Text>
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 200
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
    backTextStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Futura"
    },
    backButton: {
        backgroundColor: "#000000",
        borderRadius: 20,
        padding: 10,
        marginTop: 3,
    },
    feedbackTextStyle: {
        fontFamily: 'Futura',
        color: "black",
        fontSize: 15,
    },
    openButton: {
        marginTop: "30%",
        height: "60%",
        left: "-3%",
        alignSelf: 'flex-start',
        alignItems: 'center'
    },
});

export default PopUp;
