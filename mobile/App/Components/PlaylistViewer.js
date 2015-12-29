'use strict';
const React = require('react-native');
const SERVER_ENDPOINT = require('../Auth/endpoints.js').serverEndpoint;
const STYLES = require('../Assets/PicoStyles.js');
const Separator = require('./Separator.js');
const SideScroller = require('./SideScroller.js');
const UI_HELPERS = require('../Utils/UiHelpers.js');

const {
  AlertIOS,
  Image,
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} = React;

class Single extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isPlaying: false,
    };
  }
  togglePlaying() {
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  }
  renderPlayingStatus() {
    if (this.state.isPlaying) {
      return (
        <View style={styles.playing}></View>
      );
    }
    return <View />;
  }
  handleDelete() {
    fetch(`${SERVER_ENDPOINT}/Playlists/${this.props.playlistName}/${this.props.id}`, {
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    });
        this.props.updateParentState(this.props.playlistName);
        AlertIOS.alert('FINISHED DELETING from ', this.props.playlistName);
      // .then(res => res.json())
      // .then(json => {
      //   console.log('The res.json from deleteSongFromPlaylist is ', json);
      //   this.props.updatePlaylistState(json);
      // });
      // AlertIOS.alert("this is after deleted");
      // this.props.updatePlaylistState(playlistname);
  }
  render() {
    let artwork = this.props.artwork_url ? {uri:this.props.artwork_url} : require("../Assets/Pico-O-grey.png");
    return (
      <TouchableHighlight>
        <View style={styles.singleContainer}>
          {this.renderPlayingStatus()}
          <Image source={artwork} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.info}>{this.props.user.username}</Text>
            <Text style={styles.info}>{UI_HELPERS.makeHumanReadable(this.props.duration)}</Text>
          </View>
          <View style={styles.deleteContainer}>
            <Text onPress={this.handleDelete.bind(this)}>Delete</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

class Tracks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowPlaying: null
    };
  }
  updatenowPlaying(trackId) {
    this.setState({
      nowPlaying: trackId,
    });
  }
  updatePlaylistViewerState(playlistName){
    this.props.updatePlaylistViewerState(playlistName);
  }
  render() {
    let playlistName = Object.keys(this.props.data)[0];
    let list = this.props.data[playlistName].map((trackObj, index) => {
      return (
        <View>
          <Single
            key={index}
            {...trackObj.soundcloud}
            playlistName={playlistName}
            updateParentState={this.updatePlaylistViewerState.bind(this)}
            informParent={this.updatenowPlaying.bind(this)} />
          <Separator />
        </View>
      );
    });
    return (
      <View
        style={styles.tracksContainer}>
        <ScrollView
          onScroll={() => console.log('OnScroll activated!')}
          showVerticalScrollIndicator={true}
          informParent={this.updatePlaylistViewerState.bind(this)}>
          {list}
        </ScrollView>
      </View>
    );
  }
}

class PlaylistViewer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      nowViewing: this.props.initialPlaylist
    };
  }
  updateNowViewing(playlistName) {
    this.setState({
      nowViewing: playlistName
    });
  }
  updateResults(updatedPlaylist) {
    this.props.results = updatedPlaylist;
  }
  render() {
    // find nowViewing playlist data
    var nowViewingList = this.props.results.filter(playlistObj => {
      return Object.keys(playlistObj)[0] === this.state.nowViewing;
    })[0];
    var playlistNames = this.props.results.map(playlistObj => {
      return Object.keys(playlistObj)[0];
    });
    return (
      <View style={styles.playlistViewer}>
        <Text style={styles.currentPlaylist}>Current Playlist: {this.state.nowViewing}</Text>
        <SideScroller
          updateParentState={this.updateNowViewing.bind(this)} 
          playlistNames={playlistNames} 
          initialPlaylist={this.props.initialPlaylist}/>
        <Tracks 
          updateParentState={this.updateResults.bind(this)} 
          data={nowViewingList} 
          updatePlaylistViewerState={this.updateNowViewing.bind(this)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewable: {
    marginTop: 30,
    color: '#FFF',
    fontSize: 16
  },
  floatingWindow: {
    width: 200,
    height: 100,
    marginTop: 30,
    backgroundColor: '#FFF'
  },
  windowText: {
    fontSize: 14,
    color: '#000'
  },
  playlistViewer:{
    marginTop: 30,
    flex: 1,
    backgroundColor: '#161c20',
  },
  currentPlaylist:{
    marginTop: 30,
    color: 'black',
    backgroundColor: '#ffa700'
  },
  tracksContainer: {
    flex: 1,
    paddingTop: 10,
    padding: 5,
    backgroundColor: '#161c20',
  },
  singleContainer: {
    flexDirection: 'row',
    paddingTop: 3,
    paddingBottom: 3
  },
  title: {
    color: '#f1f3f5',
    fontWeight: 'bold'
  },
  info: {
    color: '#abbbc6'
  },
  infoContainer: {
    flexDirection: 'column'
  },
  deleteContainer: {
    flexDirection: 'column',
    backgroundColor: 'red',
    color: '#FFF',
    fontWeight: 'bold',
    borderRadius: 2,
    justifyContent: 'flex-end'
  },
  image: {
    height: 50,
    width: 50,
    marginRight: 5
  },
  separator: {
    height: 1,
    width: 500,
    backgroundColor: '#1e262c'
  },
  separatorContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  playing: {
    backgroundColor: '#99FF00',
    width: 5,
    height: 50,
    marginRight: 1
  }
});

module.exports = PlaylistViewer;
