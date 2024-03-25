import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Button, Icon, Input, Header, ListItem } from "@rneui/themed";
import { initializeApp } from "firebase/app";
import {
	getDatabase,
	ref,
	set,
	push,
	onValue,
	remove,
} from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyB12bMU105iAtcKy_rEVoYERhy3bgMPQP0",
	authDomain: "shoppinglist-eb03e.firebaseapp.com",
	databaseURL:
		"https://shoppinglist-eb03e-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "shoppinglist-eb03e",
	storageBucket: "shoppinglist-eb03e.appspot.com",
	messagingSenderId: "954575851542",
	appId: "1:954575851542:web:36d07c1e768c5f39b5e537",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize & Connect to Realtime DB and get a reference to the service
const database = getDatabase(app);

export default function App() {
	//States//
	const [thing, setThing] = useState({
		product: "",
		amount: "",
	});
	const [things, setThings] = useState([]);

	//Functions//

	//Read data:
	useEffect(() => {
		onValue(ref(database, "/things"), (snapshot) => {
			try {
				if (snapshot.exists()) {
					const data = snapshot.val();
					console.log(Object.keys(data));
					console.log(Object.values(data));

					//Fetch keys from the database & iterate (map) over each of them:
					const thingsWithKeys = Object.keys(data).map((key) => ({
						...data[key], //get the properties associated with each key
						key: key, //key property for the key
					}));
					setThings(thingsWithKeys);
				} else {
					console.log("No data available");
					setThings([]);
				}
			} catch (error) {
				console.error("Error in fecthing data", error);
			}

			//const data = snapshot.val();
			//console.log(data);
			//console.log(Object.values(data)); //array returns-> data for flatlist
			//setThings(Object.values(data));
		});
	}, []);

	//Save data:
	const handleSave = () => {
		push(ref(database, "/things"), thing);
	};

	//Delete data:
	const deleteItem = (id) => {
		if (id) {
			remove(ref(database, `/things/${id}`))
				.then(() => console.log("Item deleted succesfully"))
				.catch((error) => console.error("Error in deleting item: ", error));
		}
	};

	const listSeparator = () => {
		return (
			<View
				style={{
					height: 2,
					width: "80%",
					backgroundColor: "#fff",
					marginLeft: "10%",
				}}
			/>
		);
	};

	//Rendering//
	return (
		<View style={styles.container}>
			<Header
				centerComponent={{
					text: "Shopping list",
					style: { fontSize: 18, color: "white", height: 30 },
				}}
			/>
			<Input
				value={thing.product}
				onChangeText={(value) => setThing({ ...thing, product: value })}
				placeholder="Product"
				style={{ marginTop: 20 }}
			/>
			<Input
				value={thing.amount}
				onChangeText={(value) => setThing({ ...thing, amount: value })}
				placeholder="Amount"
			/>
			<Button
				onPress={handleSave}
				title="Save"
				icon={{ name: "save", color: "white", iconPosition: "left" }}
			/>

			<Text
				style={{
					marginTop: 20,
					marginBottom: 10,
					fontSize: 19,
					fontWeight: "bold",
				}}
			>
				Shopping list
			</Text>

			<FlatList
				style={{ marginLeft: "5%", width: "90%" }}
				data={things}
				//keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<ListItem bottomDivider>
						<ListItem.Content>
							<ListItem.Title>{item.product}</ListItem.Title>
							<ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
						</ListItem.Content>
						<Icon
							name="delete"
							type="material-community"
							color="red"
							onPress={() => deleteItem(item.key)}
						/>
					</ListItem>

					/*WITH SWIPABLE:*/
					/*
					<ListItem.Swipeable
						rightContent={(reset) => (
							<Button
								title="Delete"
								onPress={() => deleteItem(item.key)}
								icon={{ name: "delete", color: "white" }}
								buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
							/>
						)}
						bottomDivider
					>
						<ListItem.Content>
							<ListItem.Title>{item.product}</ListItem.Title>
							<ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem.Swipeable>
          */
				)}
				ItemSeparatorComponent={listSeparator}
			/>

			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		//marginTop: 100,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	listcontainer: {
		flexDirection: "row",
		backgroundColor: "#fff",
		alignItems: "center",
	},
});
