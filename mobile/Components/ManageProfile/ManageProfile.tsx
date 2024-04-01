import Colors from "@/Constants/Colors";
import { BACKEND_API_URL } from "@/Constants/URLs";
import { LoginStateContext } from "@/Providers/LoginStateProvider";
import { client } from "@/appwrite";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { Button, Icon } from "@rneui/themed";
import { Account } from "appwrite";
import { unregisterIndieDevice } from "native-notify";
import React, { useContext, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ProfileContext } from "../../Contexts";

function ManageProfile(props) {
  const { setLoggedIn } = React.useContext(LoginStateContext);
  const { navigation } = useContext(ProfileContext);
  const account = new Account(client);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const navigateDeleteAccount = () => {
    navigation.navigate("DeleteAccount");
  };
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const account = new Account(client);
          const response = await account.get();
          setEmail(response.email);
          const fetchedUserId = response.$id;
          const fetchedUsername = await getUsername(fetchedUserId);
          setUsername(fetchedUsername);
        } catch (error) {
          console.error("Error fetching user ID or username:", error);
        }
      };

      fetchData();
    }, []),
  );

  async function getUsername(user_id) {
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/v0/users/${user_id}/name`,
        {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + (await account.createJWT()).jwt,
          }),
        },
      );
      const usernameData = await response.json();
      return usernameData.name;
    } catch (error) {
      console.error("Error fetching username:", error);
      throw error;
    }
  }

  function signOut() {
    (async () => {
      try {
        console.log("here sign out");
        await account.deleteSessions();
      } catch (error) {
        console.log(error);
      }
    })();
    try {
      account.get().then((response) => {
        unregisterIndieDevice(response.$id, 20437, "yoXi9lQ377rDWZeu0R8IdW");
      });
    } catch (error) {
      console.log(error);
    }
    setLoggedIn(false);
  }

  return (
    <ProfileContext.Provider value={navigation}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          testID="profile-tab-scroll-view"
          style={{ flex: 1 }}
          bounces={false}
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoText}>Username: {username}</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("UsernameEditing");
              }}
            >
              <MaterialIcons
                name="edit"
                size={22}
                color={Colors.BUTTON_PURPLE}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfoRow}>
            <Text
              style={styles.userInfoText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Email: {email}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EmailEditing");
              }}
            >
              <MaterialIcons
                name="edit"
                size={22}
                color={Colors.BUTTON_PURPLE}
              />
            </TouchableOpacity>
          </View>
          <Divider />

          <Button
            onPress={() => navigation.navigate("createCustomProperty")}
            color={Colors.BUTTON_PURPLE}
            containerStyle={{ borderRadius: 30 }}
          >
            <Text
              style={{
                color: "white",
                paddingRight: 5,
                fontSize: 17,
                paddingTop: 5,
                paddingBottom: 5,
                alignSelf: "center",
              }}
            >
              Create Custom Property
            </Text>
          </Button>
          <Button
            onPress={() => navigation.navigate("viewCustomProperties")}
            color={Colors.BUTTON_PURPLE}
            containerStyle={{ borderRadius: 30, marginTop: 10 }}
          >
            <Text
              style={{
                color: "white",
                paddingRight: 5,
                fontSize: 17,
                paddingTop: 5,
                paddingBottom: 5,
                alignSelf: "center",
              }}
            >
              View My Custom Properties
            </Text>
          </Button>

          <TouchableOpacity
            onPress={() => navigation.navigate("manageFriends")}
          >
            <View
              style={{
                flexDirection: "row",
                paddingTop: 12,
                paddingBottom: 12,
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 20, paddingLeft: 20, flex: 9 }}>
                Manage Friends
              </Text>
              <View style={{ flex: 2 }}>
                <Icon name="people" color={Colors.BUTTON_PURPLE} size={30} />
              </View>
            </View>
          </TouchableOpacity>

          <Divider />
          <TouchableOpacity onPress={() => navigation.navigate("notifModal")}>
            <View
              style={{
                flexDirection: "row",
                paddingTop: 12,
                paddingBottom: 12,
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 20, paddingLeft: 20, flex: 9 }}>
                Notifications
              </Text>
              <View style={{ flex: 2 }}>
                <Icon
                  name="notifications"
                  color={Colors.BUTTON_PURPLE}
                  size={30}
                />
              </View>
            </View>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity onPress={() => signOut()}>
            <View
              style={{
                flexDirection: "row",
                paddingTop: 12,
                paddingBottom: 12,
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 20, paddingLeft: 20, flex: 9 }}>
                Sign Out
              </Text>
              <View style={{ flex: 2 }}>
                <Icon name="logout" color={Colors.BUTTON_PURPLE} size={30} />
              </View>
            </View>
          </TouchableOpacity>

          <Divider />

          <View
            style={{ paddingTop: 20, paddingBottom: 50, alignItems: "center" }}
          >
            <Button
              testID="profile-tab-delete-account-button"
              onPress={navigateDeleteAccount}
              color={"red"}
              containerStyle={{ borderRadius: 30 }}
            >
              <Text
                style={{
                  color: "white",
                  paddingRight: 5,
                  fontSize: 17,
                  paddingTop: 5,
                  paddingBottom: 5,
                  alignSelf: "center",
                }}
              >
                Delete Account
              </Text>
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ProfileContext.Provider>
  );
}

export default ManageProfile;

const styles = StyleSheet.create({
  scrollViewStyle: {
    // paddingBottom: 30,
    paddingHorizontal: 5,
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    margin: 20,
  },
  userInfoRow: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
  },
  userInfoText: {
    fontSize: 20,
    margin: 20,
  },
});