import { SafeAreaView, Text, TextInput, Button, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import { Provider } from 'react-redux';
import { store } from './store';
import 'react-native-reanimated'; 
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAddNoteMutation, useFetchNotesQuery, useClearNotesMutation } from './db';
import React, { useState, useEffect, useRef } from 'react';


function HomeScreen({ navigation }) {
  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text style={tw`text-lg mb-4`}>Home Screen</Text>
      <Button
        title="New note"
        onPress={() => navigation.navigate('New Note')}
      />
    </View>
  );
}


function NewNoteScreen() {
  const noteEditor = useRef();
  return ( 
  <TouchableWithoutFeedback onPress={() => noteEditor.current.focus()}>
  <View style={tw`max-w-full flex-1 items-start justify-start bg-yellow-100 `}>
  <TextInput
          ref={noteEditor}
          style={tw` text-left text-xl p-2`} 
          multiline
          placeholder="Type your notes here..."
        />
  </View>
  </TouchableWithoutFeedback>
        );
}

const Stack = createNativeStackNavigator();

function App() {

  /* 
  ** Created a starting point that is simply a text input the size of the device, 
  ** that lets the user type on the app. Nothing is being saved/stored yet, 
  ** but the user can type in the app, just to get a feel for how to setup 
  ** the sizing and layout of the app.
  */

  useDeviceContext(tw);
  const [data, setData] = useState([]);
  const generateData = (count) => Array.from({ length: count }, (_, i) => ({ id: (i + 1).toString() }));

  useEffect(() => {
    setData(generateData(500));
  }, []);


  return (
      <SafeAreaView style={def_style.container}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="New Note" component={NewNoteScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>

  )
}
// Basic default styling
const def_style = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
});

export default App;
