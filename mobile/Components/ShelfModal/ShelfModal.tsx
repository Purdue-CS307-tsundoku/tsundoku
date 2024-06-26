import { Divider } from "@rneui/base";
import React from "react";
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BookSearchBar from "../BookSearchBar";

import { DATA } from "../BookSearchBar/Genres";

function checkTitle(value, search) {
  return value.title.toUpperCase().includes(search.toUpperCase());
}

function checkAuthor(value, search) {
  return value.author.toUpperCase().includes(search.toUpperCase());
}

function checkISBN(value, search) {
  return value.isbn.toUpperCase().includes(search.toUpperCase());
}

const ShelfModal = ({ route, navigation }) => {
  const { bookData, shelf } = route.params;
  const [search, setSearch] = React.useState("");

  const updateSearch = (search) => {
    setSearch(search);
  };

  const GENRES = DATA();

  function checkGenres(value) {
    let noFilter = true;

    for (const genre of GENRES) {
      if (genre.state[0] == true) {
        noFilter = false;
      }
      if (genre.state[1] == true) {
        noFilter = false;
      }
    }
    if (noFilter) {
      return true;
    } else {
      for (const genre of GENRES) {
        if (value == genre.title[0]) {
          return genre.state[0];
        } else if (value == genre.title[1]) {
          return genre.state[1];
        }
      }
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("gestureCancel", (e) => {
      Keyboard.dismiss;
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.modalContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.grayBarContainer}>
          <View style={styles.grayBar} />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.titleContainer}>
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>{shelf}</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.bookSearchBarContainer}>
        <BookSearchBar
          search={search}
          updateSearch={updateSearch}
          newPlaceholder={"Search list"}
          loading={false}
          showFilter={true}
          GENRES={GENRES}
        />
      </View>

      <Divider style={styles.sectionDivider} />

      <View style={styles.resultsContainer}>
        <FlatList
          data={bookData.filter(
            (e) =>
              (checkTitle(e, search) ||
                checkAuthor(e, search) ||
                checkISBN(e, search)) &&
              checkGenres(e.genre),
          )}
          scrollEventThrottle={1}
          style={{
            flex: 1,
            marginBottom: 0,
          }}
          renderItem={({ item }) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("bookInfoModal", { bookInfo: item })
                  }
                  style={{ flexDirection: "row", paddingTop: 8 }}
                >
                  <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={{ uri: item.image_url }}
                  />
                  <View style={styles.textContainer}>
                    <Text style={{ fontSize: 20 }}>{item.title}</Text>
                    <Text>{item.author}</Text>
                    <Text>ISBN: {item.isbn}</Text>
                  </View>
                </TouchableOpacity>
                <Divider style={styles.resultDivider} />
              </View>
            );
          }}
        />
      </View>
    </View>
    //</Modal>
  );
};
export default ShelfModal;

// <Modal
//   isVisible={isShelfModalVisible}
//   onSwipeComplete={() => { setShelfModalVisible(false); setSearch(""); Keyboard.dismiss }}
//   swipeDirection={["down"]}
//   style={{
//     marginBottom: 0,
//     marginRight: 0,
//     marginLeft: 0,
//   }}
//   propagateSwipe={true}
//   onBackdropPress={() => { setShelfModalVisible(false); setSearch("")}}
//   onSwipeCancel={Keyboard.dismiss}
// >
const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  grayBarContainer: {
    width: "100%",
    position: "absolute",
    borderRadius: 5,
    alignSelf: "center",
    top: 10,
  },
  grayBar: {
    backgroundColor: "#D3D3D3",
    height: 7,
    width: 70,
    borderRadius: 5,
    alignSelf: "center",
  },
  titleContainer: {
    position: "absolute",
    top: 30,
    left: 20,
    width: "100%",
  },
  bookSearchBarContainer: {
    width: "93%",
    position: "absolute",
    borderRadius: 10,
    top: 75,
    left: 20,
    paddingBottom: 0,
  },
  resultsContainer: {
    flex: 1,
    width: "100%",
    position: "absolute",
    height: "82.3%",
    borderRadius: 10,
    top: 148,
    left: 20,
    paddingTop: 0,
    marginTop: -14,
  },
  image: {
    width: 53,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "black",
  },
  textContainer: {
    paddingLeft: 10,
    width: "80%",
  },
  resultDivider: {
    paddingTop: 8,
    paddingBottom: 8,
    width: "90%",
  },
  sectionDivider: {
    paddingTop: 0,
    paddingBottom: 0,
    width: "94%",
    position: "absolute",
    top: 133,
    left: "3%",
  },
});
