import { BookInfoWrapperContext } from "@/Contexts";
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BookInfoModal } from "../BookInfoModal";

const Stack = createStackNavigator();

function BookInfoWrapper({ route }) {
  const { bookInfo } = route.params;
  return (
    <BookInfoWrapperContext.Provider value={bookInfo}>
      <Stack.Navigator>
        <Stack.Group
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="bookInfoMain" component={BookInfoModal} />
        </Stack.Group>
      </Stack.Navigator>
    </BookInfoWrapperContext.Provider>
  );
}

export default BookInfoWrapper;
