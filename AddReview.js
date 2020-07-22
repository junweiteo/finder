import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    TextInput,
    Alert,
    Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { AirbnbRating } from 'react-native-elements';

import fire from './config';

let addReview = text => {
    fire.database().ref('/reviews').push({
        review: text
    });
};

let addRating = rating => {
    fire.database().ref('/ratings').push({
        starRating: rating
    });
};

export default class AddReview extends Component {
    state = {
        review: '',
    };

    handleChange = e => {
        this.setState({
            review: e.nativeEvent.text
        });
    };

    handleSubmit = () => {
        addReview(this.state.review);
        Alert.alert('Thank you for your feedback!');
    };

    handleRating(rating) {
        addRating(rating);
    };

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.main}>
                    <Text style={styles.title}> Rate our app! </Text>
                    <AirbnbRating
                        reviews={[]}
                        defaultRating={0}
                        onFinishRating={this.handleRating}
                    />
                    <Text style={styles.feedback}> Feedback </Text>
                    <TextInput style={styles.itemInput}
                               onChange={this.handleChange}
                               placeholder = "Let us know how your experience was."
                               multiline = {true}/>
                    <TouchableHighlight
                        style={styles.button}
                        onPress={this.handleSubmit}
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableHighlight>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 10,
        flexDirection: 'column',
    },
    title: {
        fontFamily:'Futura',
        marginBottom: -20,
        fontSize: 45,
        textAlign: 'center'
    },
    feedback: {
        fontFamily:'Futura',
        marginTop: 30,
        marginBottom: 15,
        fontSize: 25,
        textAlign: 'center'
    },
    itemInput: {
        fontFamily:'Futura',
        height: 100,
        padding: 5,
        marginRight: 5,
        fontSize: 15,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        color: 'black',
    },
    buttonText: {
        fontFamily:'Futura',
        fontSize: 15,
        color: '#fff',
        alignSelf: 'center'
    },
    button: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: 'black',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
});
