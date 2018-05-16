import React , { Component } from 'react';
import { StyleSheet, Alert, TouchableOpacity , View, AsyncStorage } from 'react-native';

import { Container, Header, Left, Body, Right, Text, Button, Icon, Title, Content, Item, Input, List, ListItem, CheckBox  } from 'native-base';

import LoadingScreen from './LoadingScreen';

export default class App extends React.Component {
	
	constructor(props) {
        super(props)
        this.state = {
            todoList: [],
			completeList: [],			
			textContainer:'',
			isLoading:false
            
        }
    }
	
	componentDidMount(){
	   
	   
	   AsyncStorage.getItem('todoListz', (err, result) => {
		  if (!err) {
				if (result !== null) {
					this.setState({ todoList: JSON.parse(result) });
					console.log(' AsyncStorage todoListz : '+result);
				}
			}
	  });
	  
	   AsyncStorage.getItem('todoListComplete', (err, result) => {
		  if (!err) {
				if (result !== null) {
					this.setState({ completeList: JSON.parse(result) });
					
					console.log(' AsyncStorage todoListComplete : '+result);
				}
			}else{
				console.log('Error AsyncStorage todoListComplete : '+err);
			}
	  });
	   
    }
	
	
	
	setTextInput = (teks) =>{
		this.setState({textContainer:teks});
	}
	
	addTodo()
	{
		
		 this.setState({isLoading:true});
		 /*
		this.setState({
			
			todoList:this.todoList.push(item)
		}) */
		
		this.state.todoList.push(this.state.textContainer);
		this.clearText();
		console.log(this.state.todoList);
		console.log('added '+JSON.stringify(this.state.todoList));
		
		
		//Alert.alert('Todo Added');
		
		AsyncStorage.setItem('todoListz', JSON.stringify(this.state.todoList),()=>{
			this.setState({isLoading:false});
		});
		
		
		
		
	}
	
	showAlert()
	{
		Alert.alert('this clicked');
	}
	
	setCompleteTodo = (teks) =>
	{
		this.setState({isLoading:true});
		Alert.alert('complete : '+teks);
		
		var index = this.state.todoList.indexOf(teks);
		this.state.todoList.splice(index, 1);
		
		console.log(this.state.todoList);
		
		this.state.completeList.push(teks);
		
		console.log(this.state.completeList);
		console.log('added completeList '+JSON.stringify(this.state.completeList));
		
		AsyncStorage.setItem('todoListComplete', JSON.stringify(this.state.completeList),()=>{
			this.setState({isLoading:false});
			console.log('update todoListComplete : '+JSON.stringify(this.state.completeList));
		});
		
		AsyncStorage.setItem('todoListz', JSON.stringify(this.state.todoList),()=>{
			this.setState({isLoading:false});
			
			console.log('update todoListz : '+JSON.stringify(this.state.todoList));
		});
		
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

