import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 21.046119;
const LONGITUDE = 105.785051;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyCi6g1bs2mz1B2cgdBYXM_9gmR1evDL3nw';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

class Example extends Component {

  constructor(props) {
    super(props);

    // AirBnB's Office, and Apple Park
    this.state = {
      initialPosition: {
        latitude: 21.046119,
        longitude: 105.785051,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04,
      },
      coordinates: [
        {
          latitude: 21.046119,
          longitude: 105.785051,
        },
        {
          latitude:21.148119,
          longitude: 105.785051,
        },
      ],
    };

    this.mapView = null;
  }
  componentDidMount() {
    Geolocation.getCurrentPosition(
      async (position) => {
        //  console.log("wokeeey");
         console.log(position);

        let initialRegion = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
        await this.setState({
          initialPosition: initialRegion
        });
      },

    );
  }

  onMapPress = (e) => {
    let co= this.state.coordinates;
    if(co.length>1){
      this.co = co.shift()
      this.setState({co})
    }
    this.setState({
      coordinates: [
        ...this.state.coordinates,
        e.nativeEvent.coordinate,
      ],
    });
  }

  render() {
    return (
      <MapView
        showsUserLocation
        initialRegion={this.state.initialPosition}
        // initialRegion={{
        //   latitude: LATITUDE,
        //   longitude: LONGITUDE,
        //   latitudeDelta: LATITUDE_DELTA,
        //   longitudeDelta: LONGITUDE_DELTA,
        // }}
        style={[StyleSheet.absoluteFill, { flex: 1, width: screenWidth, height: screenHeight }]}
        ref={c => this.mapView = c}
        onPress={this.onMapPress}
      >
        {this.state.coordinates.map((coordinate, index) =>
          <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
        )}
        {(this.state.coordinates.length >= 2) && (
          <MapViewDirections
            origin={this.state.coordinates[0]}
            waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : null}
            destination={this.state.coordinates[this.state.coordinates.length - 1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={7}
            strokeColor="hotpink"
            optimizeWaypoints={true}
            onStart={(params) => {
              //   console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            }}
            onReady={result => {
              //   console.log('Distance: ${result.distance} km')
              //   console.log('Duration: ${result.duration} min.')

              this.mapView.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: (width / 20),
                  bottom: (height / 20),
                  left: (width / 20),
                  top: (height / 20),
                }
              });
            }}
            onError={(errorMessage) => {
              // console.log('GOT AN ERROR');
            }}
          />
        )}
      </MapView>

    );
  }
}

export default Example;