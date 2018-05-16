import React , { Component } from 'react';
import { StyleSheet, Alert, TouchableOpacity , View, AsyncStorage } from 'react-native';

import { H3, SwipeRow,Container, Header, Left, Body, Right, Text, Button, Icon, Title, Content, Item, Input, List, ListItem, CheckBox  } from 'native-base';

import LoadingScreen from './LoadingScreen';

export default class App extends React.Component {
	
	constructor(props) {
        super(props)
        this.state = {
            todoList: [],
			completeList: [],			
			textContainer:'',
			isLoading:true
            
        }
    }
	componentWillReceiveProps(){
	this.setState({ isLoading: true });
		 AsyncStorage.getItem('todoListComplete', (err, result) => {
		  if (!err) {
				if (result !== null) {
					this.setState({ completeList: JSON.parse(result) });
					this.setState({ isLoading: false });
				}
			}
	  }); 
	  
	  console.log('componentWillReceiveProps');
	}
	componentDidMount(){
	   AsyncStorage.getItem('todoListComplete', (err, result) => {
		  if (!err) {
				if (result !== null) {
					this.setState({ completeList: JSON.parse(result) });
					this.setState({ isLoading: false });
				}
			}
	  });
	   
    }
	
	

	deleteCompleteTodo = (teks) =>
	{
		this.setState({isLoading:true});
		
		
		var index = this.state.completeList.indexOf(teks);
		this.state.completeList.splice(index, 1);
		
		AsyncStorage.setItem('todoListComplete', JSON.stringify(this.state.completeList),()=>{
			this.setState({isLoading:false});
			console.log('update todoListComplete : '+JSON.stringify(this.state.completeList));
		});
		
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
			  <List dataArray={this.state.completeList}
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

