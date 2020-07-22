import React, {Component} from 'react';
import {Container, Header, Left, Body, Text, Thumbnail, Item, Input, ListItem, Footer}
    from 'native-base';
import {
    Alert,
    FlatList, Image,
    Linking,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import Loader from "./Loader";
import PopUp from "./PopUp";
import Icon1 from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import firebase from "./config";

let helperArray = require('./clothes.json');

export default class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemsFiltered: this.props.route.params.itemsFilteredFromMain,
            loading: false,
            favourites: [],
        };
    }

    componentDidMount() {
    }

    searchItem = text => {
        this.setState({
            itemsFiltered: this.state.allItems.filter(i =>
                i.name.toLowerCase().includes(text.toLowerCase()),
            ),
        });
    };

    filterPriceandBrand = (min, max, brands) => {
        if (brands.length == 0) {
            this.setState({
                itemsFiltered: this.state.itemsFiltered.filter(i =>
                    i.price >= min && i.price <= max),
            });
        } else if (min == '' && max == '') {
            this.setState({
                itemsFiltered: this.state.itemsFiltered.filter(i =>
                    brands.indexOf(i.brand) > -1,
                ),
            });
        } else {
            this.setState({
                itemsFiltered: this.state.itemsFiltered.filter(i =>
                    i.price >= min && i.price <= max && brands.indexOf(i.brand) > -1),
            });
        }
    };

    unsorted = () => {
        this.setState({
            itemsFiltered: this.state.itemsFiltered.sort(function (a, b) {
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }
                return 0;
            })
        })
    }

    sortPriceDown = () => {
        this.setState({
            itemsFiltered: this.state.itemsFiltered.sort(function (a, b) {
                if (a.price > b.price) {
                    return -1;
                }
                if (a.price < b.price) {
                    return 1;
                }
                return 0;
            })
        })
    }

    sortPriceUp = () => {
        this.setState({
            itemsFiltered: this.state.itemsFiltered.sort(function (a, b) {
                if (a.price < b.price) {
                    return -1;
                }
                if (a.price > b.price) {
                    return 1;
                }
                return 0;
            })
        })
    }

    sortAtoZ = () => {
        this.setState({
            itemsFiltered: this.state.itemsFiltered.sort(function (a, b) {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            })
        })
    }

    sortZtoA = () => {
        this.setState({
            itemsFiltered: this.state.itemsFiltered.sort(function (a, b) {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA > nameB) {
                    return -1;
                }
                if (nameA < nameB) {
                    return 1;
                }
                return 0;
            })
        })
    }

    ListEmpty = () => {
        return (
            <View style={styles.viewStyle}>
                <Text style={styles.noResultsText}>No Results</Text>
            </View>
        );
    };

    onRefresh() {
        this.unsorted();
        this.setState({refresh: true, itemsFiltered: helperArray});
        setTimeout(() => {
            this.setState({refresh: false});
        }, 300);
    }

    loading() {
        this.setState({
            loading: true
        });
        setTimeout(() => {
            this.setState({
                loading: false,
            });
        }, 1000);
    }

    goBack() {
        const {navigation, route} = this.props;
        navigation.navigate('Main');
        route.params.passingArray(this.state.itemsFiltered);
        this.loading();
    }

    addToFavourites = (item) => {
        const currentUser = firebase.auth().currentUser;
        const id = currentUser.uid;
        const userDoc = firebase.firestore().collection('users').doc(id);
        userDoc.get().then((doc) => {
                const userData = doc.data();
                if (userData.favourites) {
                    this.setState({
                        favourites: userData.favourites
                    });
                    let num = 0;
                    for (i of userData.favourites) {
                        if (i.name == item.name) {
                            num += 1;
                        }
                    }
                    if (num == 1) {
                        Alert.alert('', item.name + ' already in favourites. Proceed to Favourites to remove it.' );
                    } else {
                        userDoc.update({
                            favourites: firebase.firestore.FieldValue.arrayUnion(item)
                        })
                        Alert.alert('', item.name + ' added to favourites');
                    }
                }
            }
        )
    }

    logOut = () => {
        firebase.auth().signOut()
            .then(() => this.props.navigation.navigate('Home'));
    }

    goToTop = () => {
        this.scroll.scrollTo({x: 0, y: 0, animated: true});
    }

    render() {

        return (
            <Container>
                <Header searchBar rounded
                        style={{marginTop: -16}}>
                    <StatusBar barStyle="light-content" backgroundColor="#000000"/>
                    <Item>
                        <Icon name="search" size={16} style={styles.iconStyleSearch}/>
                        <Input
                            placeholder="Search item"
                            style={styles.textStyleSearch}
                            onChangeText={text => this.searchItem(text)}
                        />
                    </Item>
                </Header>
                <ScrollView
                    ref={(c) => {this.scroll = c}}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refresh}
                            onRefresh={() => this.onRefresh()}
                            tintColor="black"
                        />
                    }>
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            onPress={
                                () => this.props.navigation.navigate('SortPopUp', {
                                    mode: 'modal',
                                    sortPriceDown: this.sortPriceDown,
                                    sortPriceUp: this.sortPriceUp,
                                    sortAtoZ: this.sortAtoZ,
                                    sortZtoA: this.sortZtoA
                                })}
                        >
                            <View style={styles.sortButton}>
                                <Icon name="sort" size={20}/>
                                <Text style={styles.viewButtonText}> Sort </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={
                                () => this.props.navigation.navigate('FilterPopUp', {
                                    mode: 'modal', filterPriceandBrand: this.filterPriceandBrand,
                                })}
                        >
                            <View style={styles.filterButton}>
                                <Icon name="filter" size={20}/>
                                <Text style={styles.viewButtonText}> Filter </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={
                                () => {
                                    this.goBack();
                                    this.loading()
                                }}
                        >
                            <View style={styles.viewButton}>
                                <Loader
                                    loading={this.state.loading}/>
                                <Icon name="list" size={20}/>
                                <Text style={styles.viewButtonText}> View </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={this.state.itemsFiltered}
                        removeClippedSubviews={true}
                        initialNumToRender={3}
                        renderItem={({item, index}) =>
                            <ListItem thumbnail>
                                <Left>
                                    <TouchableOpacity
                                        onPress={()=> Linking.openURL(item.link)}>
                                        <Thumbnail square large source={{uri: item.image}}/>
                                    </TouchableOpacity>
                                </Left>
                                <Body>
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL(item.link)}>
                                        <Text style={styles.textStyle}>
                                            {index + 1 + '. ' + item.name}</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.textStyle}
                                          note>{item.brand}</Text>
                                    <Text style={styles.textStyle}
                                          note>{'$' + item.price.toFixed(2)}</Text>
                                    <TouchableOpacity
                                        onPress={() => this.addToFavourites(item)}
                                    >
                                        <View style={styles.favButton}>
                                            <Icon name="heart" size={10} color={'white'}
                                                  style={styles.heartIcon}/>
                                            <Text style={styles.favButtonText}> Add To
                                                Favourites </Text>
                                        </View>
                                    </TouchableOpacity>
                                </Body>
                            </ListItem>
                        }
                        ListEmptyComponent={this.ListEmpty}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </ScrollView>
                <Footer style={{backgroundColor: '#f5f5f5', height: 55}}>
                    <TouchableOpacity
                        onPress={this.goToTop}
                        style={styles.topButton}>
                        <Icon2 name="chevron-up-circle" size={50} color={'#fa8072'}/>
                    </TouchableOpacity>
                    <View style={stylesFooter.buttons}>
                        <View style={stylesFooter.feedbackButton}>
                            <PopUp/>
                        </View>
                        <TouchableOpacity
                            onPress={
                                () => this.props.navigation.navigate('Profile')}
                        >
                            <View style={stylesFooter.profileButton}>
                                <Icon2 name="face" size={30}/>
                                <Text style={stylesFooter.profileButtonText}> Profile </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={
                                () => this.logOut()}
                        >
                            <View style={stylesFooter.logOutButton}>
                                <Icon1 name="ios-log-out" size={30}/>
                                <Text style={stylesFooter.logOutButtonText}> Log Out </Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
        fontFamily: 'Futura'
    },
    iconStyleSearch: {
        marginLeft: 10,
    },
    textStyleSearch: {
        fontFamily: 'Futura',
        marginLeft: 3,
    },
    favButton: {
        backgroundColor: "#000000",
        borderRadius: 10,
        padding: 5,
        marginTop: -30,
        marginBottom: -3,
        marginRight: -80,
        width: 160,
        alignSelf: 'center',
    },
    heartIcon: {
        padding: 5,
        marginBottom: -20,
        marginLeft: 2,
    },
    favButtonText: {
        fontFamily: 'Futura',
        color: 'white',
        textAlign: 'center',
        marginRight: -11,
        justifyContent: 'center',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: -14,
    },
    sortButton: {
        backgroundColor: 'white',
        margin: 25,
        marginTop: 15,
        height: 25,
        left: 25,
        alignSelf: 'flex-start',
        alignItems: 'center'
    },
    filterButton: {
        backgroundColor: 'white',
        margin: 25,
        marginTop: 15,
        height: 25,
        alignSelf: 'center',
        alignItems: 'center'
    },
    viewButton: {
        backgroundColor: 'white',
        margin: 25,
        marginTop: 15,
        right: 25,
        height: 25,
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
    viewButtonText: {
        color: 'black',
        fontFamily: 'Futura',
    },
    noResultsText: {
        textAlign: 'center',
        fontFamily: 'Futura',
        color: 'black',
        marginTop: 50,
    },
    topButton: {
    position: 'absolute',
        left: '85%',
        bottom: '110%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
})

const stylesFooter = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: -14,
    },
    feedbackButton: {
        margin: "7%",
        left: "-30%",
        marginTop: -216,
        alignSelf: 'flex-start',
    },
    profileButton: {
        margin: "6%",
        marginTop: "10%",
        height: "180%",
        alignSelf: 'center',
        alignItems: 'center'
    },
    profileButtonText: {
        color: 'black',
        fontFamily: 'Futura',
        fontSize: 15,
    },
    logOutButton: {
        margin: "7%",
        marginTop: "7.5%",
        height: "35%",
        right: "-6%",
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    logOutButtonText: {
        color: 'black',
        fontFamily: 'Futura',
        fontSize: 15,
    },
})
