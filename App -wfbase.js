import React , { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/FontAwesome'
import {Dimensions} from 'react-native'
import ActiveTodos from './screensFirebase/ActiveTodos'
import CompleteTodos from './screensFirebase/CompleteTodos'
import Cameras from './screensFirebase/Cameras'


const deviceW = Dimensions.get('window').width
const basePx = 375

function px2dp(px) {
  return px *  deviceW / basePx
}


export default class App extends React.Component {
  state= {
    selectedTab: 'home'
  };

  render() {
    return (
      <TabNavigator style={styles.container}>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'home'}
          title="Active Todos"
          selectedTitleStyle={{color: "#3496f0"}}
          renderIcon={() => <Icon name="plus-circle" size={px2dp(22)} color="#666"/>}
          renderSelectedIcon={() => <Icon name="plus-circle" size={px2dp(22)} color="#3496f0"/>}
          
          onPress={() => this.setState({selectedTab: 'home'})}>
          <ActiveTodos/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'profile'}
          title="Complete Todos"
          selectedTitleStyle={{color: "#3496f0"}}
          renderIcon={() => <Icon name="book" size={px2dp(22)} color="#666"/>}
          renderSelectedIcon={() => <Icon name="book" size={px2dp(22)} color="#3496f0"/>}
          onPress={() => this.setState({selectedTab: 'profile'})}>
          <CompleteTodos/>
        </TabNavigator.Item>
		
		<TabNavigator.Item
          selected={this.state.selectedTab === 'camera'}
          title="Image Todos"
          selectedTitleStyle={{color: "#3496f0"}}
          renderIcon={() => <Icon name="camera" size={px2dp(22)} color="#666"/>}
          renderSelectedIcon={() => <Icon name="camera" size={px2dp(22)} color="#3496f0"/>}
          onPress={() => this.setState({selectedTab: 'camera'})}>
          <Cameras/>
        </TabNavigator.Item>
      </TabNavigator>
    );
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
