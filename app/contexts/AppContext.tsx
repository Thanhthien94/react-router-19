import React from 'react';
import { createContext, useContext, useReducer } from 'react';

interface User {
  id: string
  avatar?: string
  name: string
  // Add other user properties
}

interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  // Add other state properties
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_SIDEBAR' }
  // Add other action types

const initialState: AppState = {
  user: null,
  theme: 'light',
  sidebarOpen: false,
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | undefined>(undefined)

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    default:
      return state
  }
}

export function AppProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
