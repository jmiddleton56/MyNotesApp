import { useEffect, useLayoutEffect, useState } from 'react';
import { TouchableOpacity, View, Text, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw, { useDeviceContext } from 'twrnc';
import { Provider } from 'react-redux';
import { store } from './store';
import MasonryList from '@react-native-seoul/masonry-list'
import { useSearchNotesQuery, useAddNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation } from './db';

/**
 * HomeScreen component represents the main screen of the app.
 * It displays a list of notes and allows adding new notes.
 */
function HomeScreen({ navigation }) {
  const { data: searchData, error, isLoading } = useSearchNotesQuery("");
  // Hooks for adding and editing notes
  const [ addNote, { data: addNoteData, error: addNoteError }] = useAddNoteMutation();
  const [ editNote, {data: editNoteData, error: editNoteError}] = useUpdateNoteMutation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "My Notes" });
  }, [navigation]);

  // Navigate to the edit screen when a note is added or edited
  useEffect(() => {
    if (addNoteData != undefined) {
      console.log(addNoteData.title);
      navigation.navigate("Notes", {data: addNoteData});
    } else if (editNoteData != undefined) {
      console.log(editNoteData.title); 
      navigation.navigate("Notes", {data: editNoteData});
    }
  }, [addNoteData, editNoteData]);

  // Go to edit screen when note is pressed
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => editNote(item) } style={tw`w-[98%] mb-0.5 mx-auto bg-purple-400 rounded-sm px-1`}> 
      <Text> {item.title} {item.content}</Text> 
    </TouchableOpacity>
  )
  // Display notes in masonry list
  return (
    <View style={tw`flex-1 items-center justify-center bg-purple-300`}>
      {searchData ? 
        <MasonryList
          style={tw`px-0.5 pt-0.5 pb-20`}
          data={searchData}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />  
        : <></>
      }
      <TouchableOpacity onPress={() => { addNote({title: "test", content: ""}); }} style={tw`bg-blue-500 rounded-full absolute bottom-[5%] right-8 mx-auto items-center flex-1 justify-center w-12 h-12`}>
        <Text style={tw`text-white text-center text-3xl mt--1`}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * EditScreen component for editing a note.
 * It allows updating the content of the note and deleting the note.
 */
function EditScreen({ route, navigation }) {
  // State for the text content of the note
  const [text, setText] = useState(route.params.data.content);

  // Hooks for updating and deleting notes
  const [ updateNote, {data: updateNoteData}] = useUpdateNoteMutation();
  const [ deleteNote ] = useDeleteNoteMutation();
  
  // Set the screen title and add a delete button to the navigation header
  useLayoutEffect(() => {
    navigation.setOptions({title: "Notes" });
    navigation.setOptions({
      headerRight: () => (
        <View style={{...tw`p-2`,flexDirection:"row"}}>
          <Button onPress={() => {
            console.log(route.params.data);
            deleteNote(route.params.data);
            navigation.navigate("Home");
          }} title="Delete" />
        </View>
      ),
    });
  }, [navigation]);

  // Commented out for testing
  // Update the note content when the text state changes
  // useEffect(() => {
  //   return () => {
  //     updateNote({ id: route.params.data.id, content: text });
  //   };
  // }, [text]);

  return (
    <View style={tw`flex-1 items-center justify-center bg-purple-400`}>
      {<TextInput
        style={tw`w-full h-full bg-white rounded-sm px-1 text-left`} 
        onChangeText={content => {
          setText(content)
          updateNote({ id: route.params.data.id, content: text });
          }}
        placeholder='Enter note here...'
        value={text}
        multiline
      />}
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  useDeviceContext(tw);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            options={{
              headerStyle: tw`bg-purple-300 border-0`,
              headerTintColor: '#fff',
              headerTitleStyle: {...tw`font-bold`, fontSize: 24},
              headerShadowVisible: false, // gets rid of border on device
              headerTitleAlign: 'center',
            }}
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            options={{
              headerStyle: tw`bg-purple-300 border-0`,
              headerTintColor: '#fff',
              headerTitleStyle: {...tw`font-bold`, fontSize: 24},
              headerShadowVisible: false, // gets rid of border on device
            }}
            name="Notes"
            component={EditScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}