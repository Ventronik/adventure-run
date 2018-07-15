import React, {Component} from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { getAllRuns } from '../actions'
import { STATIC_MAPS_API_KEY } from '../keys'
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native'
import { Icon } from 'react-native-elements'

import StatsCard from './StatsCard'
import RunCard from './RunCard'
import RunCardTop from './RunCardTop'
import RunCardBottom from './RunCardBottom'
import StatsMap from './StatsMap'

import moment from 'moment'



class Stats extends Component {


  render(){
    const renderList = [
      <RunCardTop/>,
      ...this.props.allRuns
      .map(run => <RunCard data={run} toggleInfo={this.toggleInfo} info={this.state.activeId}/>),
      <RunCardBottom/>
    ]


    const {
      run_shortid,
      created_at,
      latlong,
      name,
      time,
      distance,
      checkpoints,
      path
    } = this.props.allRuns.length ? this.props.allRuns[0] : {}

    return (
      <View style={styles.stats}>
        <View style={styles.header}>
          <View style={styles.mapContainer}>
            {/* <Text>{time}</Text>
            <Text>{distance}</Text>
            <Text>{completed ? 'Completed Full Track' : 'Completed Partial Track'}</Text> */}
            {/* {checkpoints.sort((a,b)=>a.checkpoint_id - b.checkpoint_id).map((checkpoint,idx) => <Text key={checkpoint.id}>{idx+1} : {checkpoint.checkpoint_time}</Text>)} */}
            {latlong ? <StatsMap path={path} checkpoints={checkpoints} latlong={latlong}/> : null}
          </View>
          <View style={styles.displayBox}></View>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.content}
          data={renderList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => item}
        />
      </View>
    )
  }


  constructor(){
    super()
    this.state = {
      activeId: 1
    }
  }

  toggleInfo = (shortid) => {
    if (this.state.activeId) this.setState({ activeId: null})
    else this.setState({activeId: shortid})
    console.log(shortid)
  }




  componentDidMount(){
    this.props.getAllRuns()
  }

}

const SCREEN_WIDTH = Dimensions.get("window").width;


const styles = StyleSheet.create({
  stats: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 300,
    backgroundColor: '#378287',
    justifyContent: 'flex-end',
    marginBottom: 0,
    marginTop: -15,
    marginLeft: -15,
    marginRight: -15,
    shadowColor: 'black',
    shadowRadius: 20,
    shadowOpacity: .3,
    shadowOffset: {width: 0, height: 15},
  },
  headerText: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 3,
  },
  content: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: -190,
    marginBottom: -150,
    zIndex: -1
  },
  displayBox: {
     height: 80 ,
     backgroundColor: 'white',
     shadowColor: 'black',
     shadowRadius: 20,
     shadowOpacity: .2,
     shadowOffset: {width: 0, height: -5},
   },
   mapContainer: {
     flex: 1,
     backgroundColor: 'rgb(225,225,225)'
   }
})



const mapDispatchToProps = dispatch => bindActionCreators({getAllRuns}, dispatch)
const mapStateToProps = ({allRuns}) => ({allRuns})
export default connect(mapStateToProps, mapDispatchToProps)(Stats)
