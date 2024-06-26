import Colors from "@/Constants/Colors";
import { BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL } from "@/Constants/URLs";
import { client } from "@/appwrite";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Account } from "appwrite";
import React from "react";
import { ViewCustomPropertiesWrapperStackParamList } from "../ViewCustomPropertiesWrapper";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type Props = NativeStackScreenProps<
  ViewCustomPropertiesWrapperStackParamList,
  "ViewCustomProperties"
>;

const account = new Account(client);

function ViewCustomProperties({ navigation }: Props) {
  const [properties, setProperties] = React.useState<any[]>([]);
  const [propertiesChanged, setPropertiesChanged] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  async function deleteProperty(id: any) {
    try {
      const res = await fetch(
        `${BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL}/${id}`,
        {
          method: "delete",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + (await account.createJWT()).jwt,
          }),
        },
      );

      const res_json = await res.json();
      if (res.ok) {
        setPropertiesChanged((prev) => !prev);
        console.log("successfully deleted");
      } else {
        console.log("error deleting: " + JSON.stringify(res_json));
      }
    } catch (error) {
      console.error(error);
      // setErrorMessage("An error occurred fetching the books.");
      // setErrorModalVisible(true);
    }
  }

  function deletePropertyAlert(id: string) {
    console.log("id in delete alert: " + id);
    Alert.alert(
      "Delete property?",
      "This will delete all data associated with this property.",
      [
        { text: "Cancel", style: "cancel", onPress: () => {} },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteProperty(id),
        },
      ],
    );
  }

  React.useEffect(() => {
    async function getCustomProperty() {
      const user_id = (await account.get()).$id;
      try {
        const res = await fetch(
          `${BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL}?` +
            new URLSearchParams({
              self: "true",
            }),
          {
            method: "get",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + (await account.createJWT()).jwt,
            }),
          },
        );

        const res_json = await res.json();
        return res_json.results.documents.map((property: { $id: any; name: any; type: any; }) => {
          return {
            id: property.$id,
            name: property.name,
            type: property.type,
          };
        });
      } catch (error) {
        console.error(error);
        // setErrorMessage("An error occurred fetching the books.");
        // setErrorModalVisible(true);
      }
    }

    getCustomProperty()
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        // setErrorMessage("An error occurred fetching the recommended books.");
        // setErrorModalVisible(true);
      });
  }, [propertiesChanged]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <Text style={styles.title}>Your Custom Properties</Text>
      {loading && (
        <ActivityIndicator
          size="large"
          color={Colors.BUTTON_PURPLE}
          style={{ marginTop: 50 }}
        />
      )}
      {properties && (
        <View>
          <View style={{ marginBottom: 20 }}>
            {properties.map((item, index) => (
              <View
                style={{
                  flexDirection: "column",
                  margin: 20,
                  marginBottom: 0,
                  marginLeft: 15,
                  justifyContent: "center",
                  padding: 20,
                  backgroundColor: "white",
                  shadowColor: "gray",
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 5,
                  borderRadius: 10,
                }}
                key={index}
              >
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.type}>{item.type.toLowerCase()}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "center",
                  }}
                >
                  <Pressable
                    onPress={() =>
                      navigation.navigate("EditCustomProperty", {
                        propertyInfo: item,
                        setPropertiesChanged: setPropertiesChanged,
                      })
                    }
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.buttonTextStyle}>Edit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => deletePropertyAlert(item.id)}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.buttonTextStyle}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 40,
    textAlign: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    color: Colors.BUTTON_PURPLE,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    color: Colors.BUTTON_PURPLE,
  },
  type: {
    fontSize: 18,
    textAlign: "center",
    textTransform: "capitalize",
  },
  buttonStyle: {
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: Colors.BUTTON_PURPLE,
    padding: 10,
  },
  buttonTextStyle: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ViewCustomProperties;
