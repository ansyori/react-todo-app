import React from 'react';

import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Vibration,
  FlatList,
  ListView
} from 'react-native';


import {
  Camera,
  Video,
  FileSystem,
  Permissions,
} from 'expo'; 

import { H3, SwipeRow,Container, Header, Left, Body, Right, Text, Button, Icon, Title, Content, Item, Input, List, ListItem, CheckBox  } from 'native-base';

import LoadingScreen from './LoadingScreen';

export default class CameraExample extends React.Component {
	
	constructor() {
    super();
		  state = {
			hasCameraPermission: null,
			type: Camera.Constants.Type.back,
			isCameraShow : false,
			photos: ['empty'],
			photoId: 1,
			dataSource:['test'],
			isLoading:true
		  };
		  
	const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    };
  }
  
  
  readDirectory()
  {
	   this.setState({
			isLoading:true
	});  
	  FileSystem.readDirectoryAsync(
		  FileSystem.documentDirectory + 'photos'
		).then(dataphoto => {
			 this.setState({
			photos:dataphoto
		  });   
		  
		   this.setState({
			isLoading:false
		  });  
		  
		});
  }

  
   componentDidMount() {
	   
	   this.setState({
        isLoading:true
      });  
	
	console.log('FileSystem.documentDirectory : '+FileSystem.documentDirectory);
	FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + 'photos'
    ).catch(e => {
      console.log(e, 'Directory exists');
    });
	   
	this.readDirectory();
  }

  
  toggleCamera(){
	  this.readDirectory(); 
	  this.setState({isCameraShow : !this.state.isCameraShow});
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  
  snap =  async function(){
	  if (this.camera) {
		  
		  try{
			  
			  var newFileLoc = FileSystem.documentDirectory+'/photos/Photo_'+Math.random()+'.jpg';
			 let photo = await this.camera.takePictureAsync().then(data => {
				  FileSystem.moveAsync({
				  from: data.uri,
				  to: newFileLoc
				}).then(() => {
				/* console.log('this.state.photoId : '+this.state.photoId);
				console.log('FROM : '+data.uri);
				console.log('TO : '+newFileLoc); */
				  /* this.setState({
					photoId: this.state.photoId + 1,
				  }); */
				  //Vibration.vibrate();
				});  
				
				
				
				
				 
				 
			  });
			  
			  console.log('photo : '+photo);
			  
			  this.toggleCamera();
		  }catch(error)
		  {
			  console.log('Error Take pic : '+error);
		  }
      
    }
	};
	
	
	deleteCompleteTodo = async (teks) =>
	{
		
		
		this.setState({isLoading:true});
		var deleteFileName = FileSystem.documentDirectory+'/photos/'+teks;
		console.log('deleted file : '+deleteFileName);
		await FileSystem.deleteAsync(deleteFileName).catch(e => {
		  console.log('error delete : '+e);
		});
		
		this.readDirectory();
		
	}

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
		
	  if(this.state.isCameraShow)
	  {
		  return (
			<View style={{ flex: 1 }}>
			  <Camera style={{ flex: 1 }} type={this.state.type}  ref={ref => { this.camera = ref; }}>
				<View
				  style={{
					flex: 1,
					backgroundColor: 'transparent',
					flexDirection: 'row',
				  }}>
				  <TouchableOpacity
					style={{
					 
					   alignSelf: 'flex-end',
					  alignItems: 'center',
					}}
					onPress={() => {
					  this.setState({
						type: this.state.type === Camera.Constants.Type.back
						  ? Camera.Constants.Type.front
						  : Camera.Constants.Type.back,
					  });
					}}>
					<Text
					  style={styles.tombol}>
					  {' '}Flip{' '}
					</Text>
				  </TouchableOpacity>
				  
				  <TouchableOpacity style={{
					 
					 alignSelf: 'flex-end',
					  alignItems: 'center',
					}} onPress={this.toggleCamera.bind(this)}><Text style={styles.tombol}>Close</Text></TouchableOpacity>
					
					<TouchableOpacity style={{
					 
					 alignSelf: 'flex-end',
					  alignItems: 'center',
					}} onPress={this.snap.bind(this)}><Text style={styles.tombol}>Snap!</Text></TouchableOpacity>
				</View>
			  </Camera>
			</View>
		  );
	  }else{
		  
		 if(this.state.isLoading)
		{
			return <LoadingScreen />
		}else{
			
			  return(
			  
			
			  <Container>
				<Header>
				
				  <Body>
					<Title>Complete Image Todo List</Title>
				  </Body>
				 
				</Header>
				
				<Content style={{padding : 5}}>	  
				 
				  
				 <H3 style={{textAlign:'center', padding:5}}>Swipe left to delete image</H3>
				  <List dataArray={this.state.photos}
					renderRow={(item) =>
					
					
					 
					  
					  <SwipeRow
						
						rightOpenValue={-70}
						
						body={
						  <View>
						  <Image
							style={styles.picture}
							source={{
							  uri: `${FileSystem.documentDirectory}photos/${item}`,
							}}
							
						  />
						  {/*<Text>{FileSystem.documentDirectory + 'photos'}{item}</Text>*/}
						  </View>
						}
						right={
						  <Button danger>
							<Icon active name="trash" onPress={() => this.deleteCompleteTodo(`${item}`)} />
						  </Button>
						}
					  />
					}>
				  </List>
				  
				   <TouchableOpacity onPress={this.toggleCamera.bind(this)} style={{padding:5, backgroundColor:'red'}}><Text style={styles.tombol} >Open Camera</Text></TouchableOpacity>
				</Content>
				
			  </Container>

			  );
		}
	  }
      
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
  
   pictures: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  picture: {
    width: 300,
    height: 200,
    margin: 5,
    resizeMode: 'contain',
  },
  backButton: {
    padding: 20,
    marginBottom: 4,
    backgroundColor: 'indianred',
  }, 
  tombol : {
	  fontSize: 20, 
	  marginBottom: 10, 
	  color: 'white', 
	  backgroundColor:'red', 
	  padding:5, 
	  margin:5
  }
});