import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Platform, StyleSheet, Text, View, ListView, Animated, Dimensions, TouchableHighlight } from 'react-native'
import { MapView, Constants, Location, Permissions } from 'expo'

import {getDistance} from '../helpers'

import TrackMarker from './TrackMarker'
import CheckpointMarker from './CheckpointMarker'
import ScrollList from './ScrollList'
import CompletedButton from './CompletedButton'
import StartButton from './StartButton'
import ActivityController from './ActivityController'

class Map extends Component {

  render = () => {
    const tracks = this.props.trackData
    return (
    <View>
      <CompletedButton visible={this.state.showCompleted} resetView={this.resetView}/>
      {this.state.showActivityUI
        ? <ActivityController
            resetView={this.resetView}
            displayRunPath={this.displayRunPath}
            trackId={this.state.trackId}
            setShowCompleted = {this.setShowCompleted}
          />
        : null}
      <View>
        <MapView
          provider='google'
          style={{height: SCREEN_HEIGHT-50}}
          showsUserLocation
          initialRegion={this.state.region}
          ref={ref => { this.mapView = ref }}
          onRegionChange	= {region => this.setState({region})}
          onPress = {()=>this.handleMapPress()}
        >
          {/*  RENDER TRACK MARKERS */}
            { this.state.showTrackMarkers ? tracks.map((track, idx) =>
              <TrackMarker
                key={idx}
                animateSlide={this.animateSlide}
                showCheckpoints = {this.showCheckpoints}
                {...{track, setShowScrollList: this.setShowScrollList}}
              />
            ) : null }

          {/*  RENDER CHECKPOINTS */}
            { this.state.showTrackDetail ? tracks.find(track => track.id === this.state.trackId).checkPoints.map((checkPoint, idx, checkPoints) =>
              <CheckpointMarker
                key={idx}
                {...{checkPoint, idx, checkPoints}}
                location={this.state.location}
              />
            ) : null }

          {/* RENDER POLYLINE */}

          {
            this.state.runPath.length
            ? <MapView.Polyline
          		coordinates={this.state.runPath}
          		strokeColor="#000"
          		strokeWidth={20}
        	  />
            : null
          }


        </MapView>
        <ScrollList
          changeMapView={this.changeMapView}
          registerCallback={this.registerCallback}
          beginActivity={this.beginActivity}
        />
      </View>
    </View>
    )
  }

  constructor(props){
    super(props)
    const tracks = this.props.trackData
    this.DISTANCE_THRESHOLD = 10
    this.animateSlide = _ => _
    this.state = {
      location: null,
      region: {...tracks[0], latitude: tracks[0].latitude - 0.009},
      errorMessage: null,
      showScrollList: false,
      showTrackMarkers: true,
      showTrackDetail: false,
      showActivityUI: false,
      showCompleted: false,
      trackId: null,
      runPath: []
    }
  }

  componentDidMount(){
    setTimeout(() => this.fitToMarkers(this.props.trackData), 100)
    console.log('mounter');
    this.locationTracker = setInterval(this.getLocationAsync,1000)
  }


  componentWillUnmount() {
    clearInterval(this.locationTracker)
  }


  fitToMarkers = (locations) => {
    this.mapView.fitToCoordinates(locations, {
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 150,
        left: 50
      }
    })
  }



  setShowScrollList = bool => {
    this.setState({showScrollList: bool})
  }


  changeMapView = (trackIndex) => {
    const tracks = this.props.trackData
    const checkPoints = tracks[trackIndex].checkPoints
    this.showCheckpoints(trackIndex)
    this.fitToMarkers(checkPoints)
  }

  handleMapPress = () => {
    if (this.state.showScrollList) {
      this.resetView()
      this.animateSlide(HALF,NONE)
    }
  }

  registerCallback = (animateSlide) => {
    this.animateSlide = animateSlide
  }

  beginActivity = trackId => {
    const tracks = this.props.trackData
    const checkPoints = tracks.find(track => track.id === trackId).checkPoints
    this.fitToMarkers(checkPoints)
    this.animateSlide(FULL,NONE)
    this.setState({
      showScrollList: false,
      showActivityUI: true
    })
  }

  showCheckpoints = trackId => {
    const tracks = this.props.trackData
    const checkPoints = tracks.find(track => track.id === trackId).checkPoints
    this.fitToMarkers(checkPoints)
    this.setState({
      showTrackMarkers: false,
      showTrackDetail: true,
      trackId
    })
  }

  resetView = () => {
    this.setState({
      showTrackMarkers: true,
      showTrackDetail: false,
      showScrollList: false,
      showActivityUI: false,
    })
    this.fitToMarkers(this.props.trackData)
  }


  displayRunPath = coordinates => {
    this.setState({runPath: coordinates})
    console.log('displayRunPath executed.');
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      })
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true})
    this.setState({ location })
  }

  setShowCompleted = (bool) => {
    this.setState({showCompleted: bool})
  }

}

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const HALF = 'HALF'
const NONE = 'NONE'
const FULL = 'FULL'



const mapStateToProps = ({activePage, activeScrollItem, trackData}) => ({activePage, activeScrollItem, trackData})
export default connect(mapStateToProps)(Map)
