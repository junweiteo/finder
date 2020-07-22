import React, {Component} from "react";
import {Container, Text} from 'native-base';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    Image,
    Linking,
    Alert
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "./config";

export default class Favourites extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            favourites: [],
        }
    }

    componentDidMount() {
    }

    removeFromFavourites = (item) => {
        Alert.alert(
            '',
            'Are you sure you want to remove ' + item.name + ' from favourites?',
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        const currentUser = firebase.auth().currentUser;
                        const id = currentUser.uid;
                        const userDoc = firebase.firestore().collection('users').doc(id)
                        userDoc.update({
                            favourites: firebase.firestore.FieldValue.arrayRemove(item)
                        })
                    }
                },
                {
                    text: 'No'
                }
            ],
            {cancelable: false}
        )
    }


    NoFavourites = () => {
        return (
            <View style={styles.viewStyle}>
                <Text style={styles.noFavouritesText}>You have no favourites!</Text>
            </View>
        );
    };

    render() {
        const currentUser = firebase.auth().currentUser;
        const id = currentUser.uid;
        const userDoc = firebase.firestore().collection('users').doc(id)
        userDoc.get().then((doc) => {
            const userData = doc.data();
            if (userData.favourites) {
                this.setState({
                    favourites: userData.favourites
                });
            }
        });
        return (
            <Container>
                <FlatList
                    data={this.state.favourites}
                    removeClippedSubviews={true}
                    initialNumToRender={3}
                    renderItem={({item}) =>
                        <View style={styles.viewStyle}>
                            <TouchableOpacity
                                onPress={() => Linking.openURL(item.link)}>
                                <Image style={styles.imageStyle}
                                       source={{uri: item.image}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.removeFromFavourites(item)}
                            >
                                <View style={styles.favButton}>
                                    <Icon name="heart-o" size={10} color={'white'}
                                          style={styles.heartIcon}/>
                                    <Text style={styles.favButtonText}> Remove From Favourites </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => Linking.openURL(item.link)}>
                                <Text style={styles.textStyleName}>
                                    {item.name}</Text>
                            </TouchableOpacity>
                            <Text style={styles.textStyleBrand}
                                  note>{item.brand}</Text>
                            <Text style={styles.textStylePrice}
                                  note>{'$' + item.price.toFixed(2)}</Text>
                        </View>
                    }
                    ListEmptyComponent={this.NoFavourites}
                    extraData={this.state.refresh}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        marginBottom: 20,
    },
    imageStyle: {
        alignSelf: 'center',
        flex: 1,
        width: 180,
        height: 250,
        marginTop: 20,
    },
    favButton: {
        backgroundColor: "#000000",
        borderRadius: 10,
        padding: 5,
        marginTop: 10,
        marginBottom: -3,
        width: 180,
        alignSelf: 'center',
    },
    heartIcon: {
        padding: 5,
        marginBottom: -19,
        marginLeft: 1,
    },
    favButtonText: {
        fontFamily: 'Futura',
        color: 'white',
        textAlign: 'center',
        marginRight: -9,
        justifyContent: 'center',
        fontSize: 14,
    },
    textStyleName: {
        fontFamily: 'Futura',
        textAlign: 'center',
        margin: 10,
    },
    textStyleBrand: {
        fontFamily: 'Futura',
        textAlign: 'center',
        color: 'gray',
        marginTop: -10,
    },
    textStylePrice: {
        fontFamily: 'Futura',
        textAlign: 'center',
        color: 'gray',
    },
    noFavouritesText: {
        textAlign: 'center',
        fontFamily: 'Futura',
        color: 'black',
        marginTop: 50,
    },
})
