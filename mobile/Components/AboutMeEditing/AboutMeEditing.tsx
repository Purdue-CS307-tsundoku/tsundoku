import Backend from "@/Backend";
import Colors from "@/Constants/Colors";
import Dimensions from "@/Constants/Dimensions";
import { BACKEND_API_USER_ABOUT_ME } from "@/Constants/URLs";
import { client } from "@/appwrite";
import { Account } from "appwrite";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const account = new Account(client);
const backend = new Backend();

export const AboutMeEditing = (props) => {
  const [bio, setBio] = React.useState("");
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { navigation } = props;
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BACKEND_API_USER_ABOUT_ME}`, {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + (await account.createJWT()).jwt,
          }),
        });
        const res_json = await res.json();
        setBio(res_json.about_me_bio);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    })();
  }, []);

  const handleSaveBio = async () => {
    try {
      if (bio.length > 50) {
        setErrorMessage("Error: Bio exceeds the 50 character limit");
        setErrorModalVisible(true);
        return;
      }
      setLoading(true);
      const res = await fetch(`${BACKEND_API_USER_ABOUT_ME}`, {
        method: "PATCH",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
        body: JSON.stringify({
          about_me_bio: bio,
        }),
      });

      if (!res.ok) {
        const res_json = await res.json();
        console.log(res_json);
        setErrorMessage("Error: " + res_json.reason);
        setErrorModalVisible(true);
        return;
      } else {
        const res_json = await res.json();
        // console.log(res_json.message);
      }

      //   const promise = account.updateName(bio);
      setBio(bio);
      navigation.navigate("Profile");
    } catch (error) {
      console.error("Error saving bio:", error);
      setErrorMessage("An error occurred while saving bio");
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      testID="sign-in-view"
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Change bio</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={bio}
              onChangeText={setBio}
              placeholder="bio"
              placeholderTextColor={"grey"}
              returnKeyType="done"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.saveButtonContainer}>
            <Pressable
              onPress={() => {
                setLoading(true);
                handleSaveBio();
              }}
              style={styles.saveButton}
            >
              {loading ? (
                <ActivityIndicator
                  color="#ffffff"
                  style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
                />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </Pressable>
          </View>
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
      <Modal
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <Pressable onPress={() => setErrorModalVisible(false)}>
              <Text style={styles.modalButton}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default AboutMeEditing;

const styles = StyleSheet.create({
  cancelButton: {
    position: "absolute",
    top: 100,
    left: 30,
    zIndex: 1,
  },
  cancelText: {
    color: Colors.BUTTON_PURPLE,
    fontSize: 20,
  },
  saveButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    borderRadius: 19,
    height: 40,
    backgroundColor: Colors.BUTTON_PURPLE,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  saveButtonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  container: {
    flex: 1,
    // marginTop: "30%"
    justifyContent: "center",
  },
  title: {
    // marginTop: 10,
    marginBottom: 30,
    textAlign: "left",
    marginLeft: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
    fontSize: 30,
    color: Colors.SIGN_IN_TEXT_BLACK,
    fontWeight: "bold",
  },
  text: {
    margin: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_MARGIN,
    fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT,
    color: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
    textAlign: "left",
    marginLeft: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
    marginRight: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
  },
  icon: {
    marginTop: 40,
  },
  inputContainer: {
    flexDirection: "row",
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 50,
    marginRight: 50,
  },
  input: {
    flex: 1,
    fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT,
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    fontSize: 16,
    color: "blue",
    textAlign: "center",
  },
});
