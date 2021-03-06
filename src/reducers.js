import { AsyncStorage } from 'react-native'
import { combineReducers } from 'redux'
import { request } from './helpers'
import { INITIAL_PAGE } from './settings'
import {
  CHANGE_ACTIVE_PAGE,
  CHANGE_ACTIVE_SCROLL_ITEM,
  UPDATE_ACTIVE_CHECKPOINTS,
  LOGIN, LOGOUT,
  GET_INITIAL_CHECKPOINTS,
  GET_TRACK_DATA,
  SET_CLOSEST_DISTANCE,
  UPDATE_RUNS,
  UPDATE_BADGES,
} from './actions'


const LATITUDE_DELTA =  0.04
const LONGITUDE_DELTA =  0.04
const INITIAL_SCROLL_ITEM = 0



const INITIAL_TRACK_DATA = []

INITIAL_ACTIVE_CHECKPOINTS = []


const activePage = (state = INITIAL_PAGE, action) => {
  switch(action.type){
    case CHANGE_ACTIVE_PAGE: return action.payload
    default: return state
  }
}

const activeScrollItem = (state = INITIAL_SCROLL_ITEM, action) => {
  switch(action.type){
    case CHANGE_ACTIVE_SCROLL_ITEM: return action.payload
    default: return state
  }
}

const trackData = (state = INITIAL_TRACK_DATA, action) => {
  switch(action.type){
    case GET_TRACK_DATA: return action.payload
    default: return state
  }
}

const activeCheckpoints = (state = INITIAL_ACTIVE_CHECKPOINTS, action) => {
  switch(action.type){
    case GET_INITIAL_CHECKPOINTS: return state
    case UPDATE_ACTIVE_CHECKPOINTS: return action.payload
    default: return state
  }
}

const token = (state = '', action) => {
  switch(action.type){
    case LOGIN: return action.payload.token
    case LOGOUT: return null
    default: return state
  }
}

const closestCheckpointDistance = (state = Infinity, action) => {
  switch(action.type){
    case SET_CLOSEST_DISTANCE: return action.payload.distance
    default: return state
  }
}

const allRuns = (state = [], action) => {
  switch(action.type){
    case UPDATE_RUNS: return action.payload
    default: return state
  }
}

const allBadges = (state = [], action) => {
  switch(action.type){
    case UPDATE_BADGES: return action.payload
    default: return state
  }
}



export default combineReducers({ activePage, activeScrollItem, trackData, activeCheckpoints, token, closestCheckpointDistance, allRuns, allBadges})
