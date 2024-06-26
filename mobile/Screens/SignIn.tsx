import { Icon } from "@rneui/themed";
import { Account, AppwriteException } from "appwrite";
import { StatusBar } from "expo-status-bar";
import { registerIndieID } from "native-notify";
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
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Colors from "../Constants/Colors";
import Dimensions from "../Constants/Dimensions";

import { client } from "@/appwrite";
import { LoginStateContext } from "@/Providers/LoginStateProvider";
import { AppNavigationStackParamList } from "@/navigation/AppNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const account = new Account(client);

type Props = NativeStackScreenProps<AppNavigationStackParamList, "sign_in">;

export const SignIn = ({ navigation }: Props) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { refreshLoginState } = React.useContext(LoginStateContext)!;

  const handleCreateAccount = () => {
    navigation.navigate("create_account");
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSignIn = async () => {
    try {
      await account.createEmailPasswordSession(email, password);
      const account_res = await account.get();
      refreshLoginState();
      const yep = await registerIndieID(account_res.$id, 20878, 'sMBFDEdTPOzXb6A2bqP169');
      console.log(yep);
    } catch (error) {
      if (error instanceof AppwriteException && error.code === 429) {
        setErrorMessage(
          "Too many incorrect sign-in attempts. Try again later.",
        );
        setErrorModalVisible(true);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
        setErrorModalVisible(true);
      } else {
        throw error;
      }
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
          <Text style={styles.title}>Sign in</Text>
          <View style={styles.inputContainer}>
            <TextInput
              testID="sign-in-email-field"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="email"
              placeholderTextColor={Colors.TYPE_PLACEHOLDER_TEXT_COLOR}
              keyboardType="email-address"
              returnKeyType="done"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              testID="sign-in-password-field"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="password"
              placeholderTextColor={Colors.TYPE_PLACEHOLDER_TEXT_COLOR}
              secureTextEntry={true}
              returnKeyType="done"
              autoCapitalize="none"
            />
          </View>
          <Pressable onPress={handleCreateAccount}>
            <Text style={styles.createAccountText}>no account? create one</Text>
          </Pressable>
          <Pressable
            testID="sign-in-signin-arrow"
            onPress={() => {
              setLoading(true);
              void handleSignIn();
            }}
          >
            {loading ? (
              <ActivityIndicator
                color="#ffffff"
                style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
              />
            ) : (
              <Icon
                style={styles.icon}
                name={"arrow-forward"}
                size={Dimensions.INITIAL_LAUNCH_SCREEN_NEXT_ARROW_SIZE}
                color={Colors.INITIAL_LAUNCH_SCREEN_ARROW_WHITE}
              />
            )}
          </Pressable>
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
      <Modal
        // animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.modalContainer} testID="sign-in-error-modal">
          <View style={styles.modalContent}>
            <Text style={styles.modalText} testID="sign-in-error-modal-message">
              {errorMessage}
            </Text>
            <Pressable onPress={() => setErrorModalVisible(false)}>
              <Text style={styles.modalButton}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.INITIAL_LAUNCH_SCREEN_BG_PINK,
    justifyContent: "center",
  },
  title: {
    marginTop: 350,
    marginBottom: 30,
    textAlign: "left",
    marginLeft: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
    fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TITLE,
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
  createAccountText: {
    margin: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_MARGIN,
    fontSize: 17,
    color: "#0544ff",
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
    color: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
    borderBottomWidth: 2,
    borderBottomColor: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
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
