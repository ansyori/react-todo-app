import React , { Component } from 'react';
import { StyleSheet, Alert, TouchableOpacity , View, AsyncStorage } from 'react-native';

import { H3, SwipeRow,Container, Header, Left, Body, Right, Text, Button, Icon, Title, Content, Item, Input, List, ListItem, CheckBox  } from 'native-base';

import LoadingScreen from './LoadingScreen';
import * as firebase from 'firebase';

import firebaseApp from './FBContainer';

/* var dataContainer = [];

const firebaseConfig = {  
  apiKey: "AIzaSyDj0Q1Jxcg-tYMb6QZ7XR81TE5-BVmqr4s",
    authDomain: "ansyori.firebaseapp.com",
    databaseURL: "https://ansyori.firebaseio.com",
    projectId: "ansyori",
    storageBucket: "ansyori.appspot.com",
    messagingSenderId: "26782727826"
};
const firebaseAppComplete = firebase.initializeApp(firebaseConfig); */

var rootRef = firebaseApp.database().ref();

//var completeTodo = rootRef.child('todoappComplete');

function generateId() {
	  var text = "";
	  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	  for (var i = 0; i < 15; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	  return text;
}

export default class CompleteTodo extends React.Component {
	
	constructor(props) {
        super(props)
        this.state = {
            todoList: [],
			completeList: [],			
			textContainer:'',
			isLoading:true,
			userid:''
            
        }
    }
	componentWillReceiveProps(){
	this.setState({ isLoading: true });
		 /* AsyncStorage.getItem('todoListComplete', (err, result) => {
		  if (!err) {
				if (result !== null) {
					this.setState({ completeList: JSON.parse(result) });
					this.setState({ isLoading: false });
				}
			}
	  });  */
	  
	  this.getFirebaseData(this);
	  
	  console.log('componentWillReceiveProps');
	}
	/* componentDidMount(){
	   AsyncStorage.getItem('todoListComplete', (err, result) => {
		  if (!err) {
				if (result !== null) {
					this.setState({ completeList: JSON.parse(result) });
					this.setState({ isLoading: false });
				}
			}
	  });
	  
	  
	  
	   
    } */
	
	getFirebaseData = (that) =>
	{
		var kontenerData = [];
		that.state.todoList = [];
		rootRef.child('todoappComplete/'+this.state.userid).once('value').then(function(snapshot){
	 
			that.setLoadingFlag(true);
			 console.log(snapshot);
			 snapshot.forEach(function(childSnapshot) {
			  var childData = childSnapshot.val();
			  console.log('CompleteTodos todoname : '+childData.todoname);
			  that.state.todoList.push(childData.todoname);
			  
			});
			 
		 }).then(function(){
			that.setLoadingFlag(false);
		 }); 
	}
	
	componentDidMount(){
	   console.log('componentDidMount CompleteTodos.js executed');
	   
	   this.setState({isLoading:true});
	    AsyncStorage.getItem('userid', (err, result) => {
		  if (!err) {
				if (result !== null) {
					this.setState({ userid: result });
					console.log(' Get Local User Id : '+result);
					this.getFirebaseData(this);
					this.setState({isLoading:false});
				}else{
					/* if null generate new one*/
					
					var randomUserId = generateId();
					this.setState({isLoading:true});
					AsyncStorage.setItem('userid', randomUserId,()=>{
						
						
						console.log('Set AsyncStorage userid : '+randomUserId);
						this.setState({ userid: randomUserId });
						
						this.getFirebaseData(this);
						this.setState({isLoading:false});
					});
				}
			}
	  });
    }
	
	

	deleteCompleteTodo = (teks) =>
	{
		this.setState({isLoading:true});
		
		
		/* var index = this.state.completeList.indexOf(teks);
		this.state.completeList.splice(index, 1);
		
		AsyncStorage.setItem('todoListComplete', JSON.stringify(this.state.completeList),()=>{
			this.setState({isLoading:false});
			console.log('update todoListComplete : '+JSON.stringify(this.state.completeList));
		}); */
		
		this.deleteFirebaseData(teks,this);
		
	}
	
	deleteFirebaseData(todotitle,that)
	{
		rootRef.child('todoappComplete/'+this.state.userid).once('value').then(function(snapshot){
	 
			
			 console.log(snapshot);
			 snapshot.forEach(function(childSnapshot) {
			  var childData = childSnapshot.val();
			  var keyData = childSnapshot.key;
			  /* console.log('todoname : '+childData.todoname);
			  that.state.todoList.push(childData.todoname); */
			  
			  console.log('delete key : '+childSnapshot.key)
			  
			  if(childData.todoname == todotitle)
			  {
				  //childSnapshot.remove();
				  firebaseApp.database().ref('todoappComplete/'+that.state.userid+'/'+keyData).remove();
				  that.getFirebaseData(that);
			  }
			  
			});
			 
		 });
		 
		 
	}
	
	setLoadingFlag = (flag) =>
	{
		this.setState({isLoading:flag});
	}
	
	
	
  render() {
	  
	
	if(this.state.isLoading)
	{
		return <LoadingScreen />
	}else{
		
	
		return (
		   <Container>
			<Header>
			
			  <Body>
				<Title>Complete Todo List</Title>
			  </Body>
			 
			</Header>
			
			<Content style={{padding : 5}}>	  
			 
			  
			 <H3 style={{textAlign:'center', padding:5}}>Swipe left to delete</H3>
			  <List dataArray={this.state.todoList}
				renderRow={(item) =>
				
				
				 
				  
				  <SwipeRow
					
					rightOpenValue={-70}
					
					body={
					  <View>
						<Text>{item}</Text>
					  </View>
					}
					right={
					  <Button danger onPress={() => this.deleteCompleteTodo(`${item}`)}>
						<Icon active name="trash" />
					  </Button>
					}
				  />
				}>
			  </List>
			</Content>
			
		  </Container>
		);
	
	}
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

