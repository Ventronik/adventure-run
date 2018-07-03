import React, { Component } from 'react'
import { Animated,Dimensions,ScrollView,StyleSheet,Text, View, Easing } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from 'react-native-elements';


import { changeActiveScrollItem} from '../actions'

class ScrollList extends Component {

  constructor (props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
  }

  componentDidMount () {
    this.props.registerCallback(this.animateMount,this.animateUnmount)
  }

  componentWillUnmount () {
    console.log('unmounting')
    this.animateUnmount()
  }


  animateMount = index => {
    this.animatedValue.setValue(0)
    this.scrollToIndex(index)
    this.props.changeMapView(index)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 300,
        easing: Easing.linear
      }
    )
    .start()
  }

  animateUnmount = () => {
    this.animatedValue.setValue(1)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 0,
        duration: 300,
        easing: Easing.linear
      }
    )
    .start()
  }

  scrollToIndex = index => {
    this.scrollView.getNode().scrollTo({
      x: SCREEN_WIDTH * index,
      animated: false
    });
  }

  render() {
    const marginTop = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [250, 0]
    })
    return (
      <Animated.View style={{marginTop}}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={
          Animated.event(
            [{ nativeEvent: { contentOffset: { x: xOffset } } }],
            { useNativeDriver: true }
          )
        }
        onMomentumScrollEnd={event => {
          const newItem = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH)
          this.props.changeActiveScrollItem(newItem)
          this.props.changeMapView(newItem)
        }}
        horizontal
        pagingEnabled
        style={styles.scrollView}
        ref={ref=>(this.scrollView=ref)}
      >
        {this.props.trackData.map((track, index) => <Screen text={track.name} index={index} key = {index} exploreTrack={this.props.exploreTrack}/>)}
      </Animated.ScrollView>
    </Animated.View>

    );
  }
}


const SCREEN_WIDTH = Dimensions.get("window").width;

const xOffset = new Animated.Value(0);

const Screen = props => (
    <View style={styles.scrollPage}>
      <Animated.View style={[styles.screen, transitionAnimation(props.index)]}>
        <View style={{
          justifyContent: 'space-around',
          height: 170,
          alignItems: 'center'
        }}>
          <Text style={styles.text}>{props.text}</Text>
          <Button
            title="EXPLORE TRACK"
            loadingProps={{ size: "large", color: "rgba(111, 202, 186, 1)" }}
            // titleStyle={{ fontWeight: "700", fontSize: 70 }}
            fontSize={16}
            color='#378287'
            buttonStyle={{
              backgroundColor: "rgba(92, 99,216, 0)",
              padding: 10,
              borderColor: '#378287',
              borderWidth: 2,
              borderRadius: 5
            }}
            onPress={()=>props.exploreTrack(props.index)}
          />
        </View>
      </Animated.View>
    </View>
)


const transitionAnimation = index => {
  return {
    transform: [
      { perspective: 800 },
      {
        scale: xOffset.interpolate({
          inputRange: [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH
          ],
          outputRange: [0.25, 1, 0.25]
        })
      },
      {
        rotateX: xOffset.interpolate({
          inputRange: [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH
          ],
          outputRange: ["45deg", "0deg", "45deg"]
        })
      },
      {
        rotateY: xOffset.interpolate({
          inputRange: [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH
          ],
          outputRange: ["-45deg", "0deg", "45deg"]
        })
      }
    ]
  };
};


const styles = StyleSheet.create({
  scrollView: {
    flexDirection: "row",
    marginTop: -250
  },
  scrollPage: {
    width: SCREEN_WIDTH,
    padding: 20
  },
  screen: {
    height: 400,
    padding: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "white"
  },
  text: {
    fontSize: 30,
    fontWeight: "bold"
  }
});


const mapStateToProps = ({activeScrollItem, trackData}) => ({activeScrollItem, trackData})
const mapDispatchToProps = dispatch => bindActionCreators({changeActiveScrollItem}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ScrollList)
