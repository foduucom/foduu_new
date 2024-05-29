import { configureStore } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
  userData: '',
  userRole:'',
  filter: false,
  data : []
}


const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'setUserData':
      return { ...state, ...rest }
      case 'setUserRole':
        return { ...state, ...rest }
    default:
      return state
  }
}


const store = configureStore({
  reducer: changeState,
})
export default store
