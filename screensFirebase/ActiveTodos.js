import React , { Component } from 'react';
import { StyleSheet, Alert, TouchableOpacity , View, AsyncStorage } from 'react-native';

import { Container, Header, Left, Body, Right, Text, Button, Icon, Title, Content, Item, Input, List, ListItem, CheckBox  } from 'native-base';
import LoadingScreen from './LoadingScreen';
import * as firebase from 'firebase';

import firebaseApp from './FBContainer';


var rootRef = firebaseApp.database().ref();



function generateId() {
	  var text = "";
	  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	  for (var i = 0; i < 15; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	  return text;
}


export default class App extends React.Component {
	
	constructor(props) {
        super(props)
        this.state = {
            todoList: [],
			completeList: [],			
			textContainer:'',
			isLoading:false,
			userid:''
            
        }
		
		this.getFirebaseData = this.getFirebaseData.bind(this)
		
		  
    }
	
	addCompleteFirebaseData(todoitem)
	{
		rootRef.child('todoappComplete/'+this.state.userid).push().set({
			"todoname": todoitem
		  });
	}
	
	
	addFirebaseData()
	{
		var todoitem = this.state.textContainer;
		console.log('add to '+'todoapp/'+this.state.userid);
		  rootRef.child('todoapp/'+this.state.userid).push().set({
			"todoname": todoitem
		  });
	}
	
	setLoadingFlag = (flag) =>
	{
		this.setState({isLoading:flag});
	}
	
	getFirebaseData = (that) =>
	{
		var kontenerData = [];
		that.state.todoList = [];
		rootRef.child('todoapp/'+this.state.userid).once('value').then(function(snapshot){
	 
			that.setLoadingFlag(true);

			 snapshot.forEach(function(childSnapshot) {
			  var childData = childSnapshot.val();

			  that.state.todoList.push(childData.todoname);
			  
			});
			 
		 }).then(function(){
			that.setLoadingFlag(false);
		 }); 
	}
	
	

	
	
	componentDidMount(){

	   
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
	
	
	
	setTextInput = (teks) =>{
		this.setState({textContainer:teks});
	}
	
	addTodo()
	{
		
		 this.setState({isLoading:true});
		 this.addFirebaseData();
		 this.getFirebaseData(this)
		 this.clearText();	
		
	}
	
	
	deleteFirebaseData(todotitle,that)
	{
		rootRef.child('todoapp/'+this.state.userid).once('value').then(function(snapshot){
	 
			
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
				  firebaseApp.database().ref('todoapp/'+that.state.userid+'/'+keyData).remove();
				  that.getFirebaseData(that);
			  }
			  
			});
			 
		 });
		 
		 
	}
	
	setCompleteTodo = (teks) =>
	{
		this.setState({isLoading:true});
		Alert.alert('complete : '+teks);
		
		this.deleteFirebaseData(teks,this);
		
		this.addCompleteFirebaseData(teks);
		
	}
	
	
	
	clearText = () => {
		this._textInput.setNativeProps({text: ''});
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
				<Title>Simple Todo App</Title>
			  </Body>
			 
			</Header>
			
			<Content style={{padding : 5}}>	  
			  <Item>
				<Input  placeholder='Add new todo here...' onChangeText={(text) => this.setTextInput(text)} ref={component => this._textInput = component}/>
				<Button onPress={this.addTodo.bind(this)} info><Text>Add</Text></Button>
			  </Item>
			  
			 
			  <List dataArray={this.state.todoList}
				renderRow={(item) =>
				
				
				  <ListItem>
					
				  <Body>
				  <TouchableOpacity  onPress={()=>this.setCompleteTodo(`${item}`)} >
					<Text>{item}</Text>
				  </TouchableOpacity >
				  </Body>
				 
					
				  </ListItem>
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

