const React = require('react-native');
const SERVER_ENDPOINT = require('../Auth/endpoints.js').serverEndpoint;
const Separator = require('./Separator.js');
const Tracks = require('./Tracks.js');

const {
  AlertIOS,
  Image,
  Text,
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableHighlight
} = React;


// set up single playlist component
class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    };
  }
  toggleSelected() {
    this.setState({
      isSelected: !this.state.isSelected
    });
  }
  handlePress() {
    let playlistname = `${Object.keys(this.props.data)[0]}`;
    let trackId = `${this.props.trackId}`;
    this.toggleSelected();
    fetch(`${SERVER_ENDPOINT}/playlists/${playlistname}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({trackID: `${trackId}`})
    });
  }
  render() {
    return(
      <TouchableHighlight
        onPress={this.handlePress.bind(this)}>
        <View style={styles.playlistContainer}>
          <Text style={styles.playlistText}>{Object.keys(this.props.data)[0]}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

class Instant extends React.Component {
  render() {
    return (
      <View style={styles.instantContainer}>
        <TouchableHighlight >
          <Text style={styles.instantText}>Play Now</Text>
        </TouchableHighlight>
        <TouchableHighlight>
          <Text style={styles.instantText}>Add to Queue</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

class WhichPlaylist extends React.Component {
  render() {
    let list = this.props.playlists.map((playlist, index) => {
      return (
        <View
          key={index}
          style={styles.playlistContainer} >
          <Playlist
          data={playlist}
          trackId={this.props.trackId}/>
          <Separator />
        </View>
      );
    });
    return (
      <View style={styles.mainContainer}>
        <ScrollView
          onScroll={() => console.log('Playlist OnScroll activated!')}
          showVerticalScrollIndicator={true}>
          <Instant/>
          <View>
            <Text style={styles.header}>Add to Playlist</Text>
          </View>
          <View>
            {list}
          </View>
          <TextInput
            style={styles.loginInput}
            placeholder="Create New Playlist"
            placeholderTextColor="#FFF"/>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 3,
    backgroundColor: '#161c20',
  },
  loginInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    marginBottom: 10,
    fontSize: 23,
    borderWidth: 1,
    borderColor: '#99FF00',
    borderRadius: 8,
    color: 'white'
  },
  playlistContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: 3,
    paddingBottom: 3
  },
  playlistText: {
    fontSize: 23,
    color: '#f1f3f5',
    fontWeight: 'bold'
  },
  infoContainer: {
    flexDirection: 'column'
  },
  header: {
    textAlign: 'center',
    color: '#f1f3f5',
    fontSize: 23

  },
  instantContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 3,
    paddingBottom: 3,
    backgroundColor: 'white'
  },
  instantText: {
    color: '#161c20',
    fontWeight: 'bold',
    fontSize: 15
  }
});

module.exports = WhichPlaylist;
