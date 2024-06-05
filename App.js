import { useEffect, useLayoutEffect, useState } from 'react';
import { TouchableOpacity, View, Text, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw, { useDeviceContext } from 'twrnc';
import { Provider } from 'react-redux';
import { store } from './store';
import MasonryList from '@react-native-seoul/masonry-list'
import { useSearchNotesQuery, useAddNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation } from './db';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

function HomeScreen({ navigation }) {
  const { data: searchData, error, isLoading } = useSearchNotesQuery("");
  const [ addNote, { data: addNoteData, error: addNoteError }] = useAddNoteMutation();
  const [ editNote, {data: editNoteData, error: editNoteError}] = useUpdateNoteMutation();
  const [ deleteNote ] = useDeleteNoteMutation();
  
  useEffect(() => {
    if (addNoteData != undefined) {
      console.log(addNoteData.title);
      navigation.navigate("Edit", {data: addNoteData});
    }
  }, [addNoteData]);

  // May be able to combine this with the useEffect above, keeping seperate while testing
  useEffect(() => {
    if (editNoteData != undefined) {
      console.log(editNoteData.title);
      navigation.navigate("Edit", {data: editNoteData});
    }
  }, [editNoteData]);

  // This is the preview of the note, right now it's a placeholder instead of a preview of the text
  const renderItem = ({ item }) => 
    (
    <TouchableOpacity onPress={() => editNote(item) } style={tw`w-[98%] mb-0.5 mx-auto bg-purple-300 rounded-sm px-1`}> 
      <Text>{item.id} {item.content}</Text> 
    </TouchableOpacity>
  )

  return (
    <View style={tw`flex-1 items-center justify-center bg-purple-400`}>
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
      <TouchableOpacity onPress={() => { addNote({title: "test", content: "content"}); }} style={tw`bg-blue-500 rounded-full absolute bottom-[5%] right-8 mx-auto items-center flex-1 justify-center w-12 h-12`}>
        <Text style={tw`text-white text-center text-3xl mt--1`}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function EditScreen({ route, navigation }) {
  const [text, setText] = useState(route.params.data.content);
  const [ updateNote, {data: updateNoteData}] = useUpdateNoteMutation();
  
  
  useLayoutEffect(() => {
    navigation.setOptions({ title: route.params.data.title });
  }, []);

  const onChangeText = (newText) => {
    setText(newText);

  };

  useEffect(() => {
    return () => {
      updateNote({ id: route.params.data.id, content: text });
    };
  }, [text]);

  return ( // Place title and id of the note in the center of the new note
    <View style={tw`flex-1 items-center justify-center bg-purple-400`}>
      {<TextInput
        style={tw`w-[98%] h-12 bg-white rounded-sm px-1`} 
        onChangeText={onChangeText}
        placeholder='Enter note here...'
        value={text}
      />}
      <FontAwesomeIcon icon="fa-solid fa-trash-can" />
      <Text style={tw`text-lg text-white`}>Edit Screen {route.params.data.title} {route.params.data.id}</Text>
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
              headerTitleStyle: tw`font-bold`,
              headerShadowVisible: false, // gets rid of border on device
            }}
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            options={{
              headerStyle: tw`bg-purple-300 border-0`,
              headerTintColor: '#fff',
              headerTitleStyle: tw`font-bold`,
              headerShadowVisible: false, // gets rid of border on device
            }}
            name="Edit"
            component={EditScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}