'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

// UI State Interface
interface UIState {
  isSidebarOpen: boolean;
  isLoading: boolean;
  toast: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null;
}

// UI Action Types
type UIAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'OPEN_SIDEBAR' }
  | { type: 'CLOSE_SIDEBAR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SHOW_TOAST'; payload: { type: 'success' | 'error' | 'warning' | 'info'; message: string } }
  | { type: 'HIDE_TOAST' };

// Initial State
const initialState: UIState = {
  isSidebarOpen: false,
  isLoading: false,
  toast: null,
};

// UI Context Interface
interface UIContextType {
  state: UIState;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  setLoading: (loading: boolean) => void;
  showToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  hideToast: () => void;
}

// UI Context
const UIContext = createContext<UIContextType | undefined>(undefined);

// UI Reducer
function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case 'OPEN_SIDEBAR':
      return { ...state, isSidebarOpen: true };
    case 'CLOSE_SIDEBAR':
      return { ...state, isSidebarOpen: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SHOW_TOAST':
      return {
        ...state,
        toast: {
          id: Date.now().toString(),
          type: action.payload.type,
          message: action.payload.message,
        },
      };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

// Custom Hook
export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

// Provider Props
interface UIProviderProps {
  children: ReactNode;
}

// UI Provider Component
export function UIProvider({ children }: UIProviderProps) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const openSidebar = () => {
    dispatch({ type: 'OPEN_SIDEBAR' });
  };

  const closeSidebar = () => {
    dispatch({ type: 'CLOSE_SIDEBAR' });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    dispatch({ type: 'SHOW_TOAST', payload: { type, message } });
  };

  const hideToast = () => {
    dispatch({ type: 'HIDE_TOAST' });
  };

  const contextValue: UIContextType = {
    state,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    setLoading,
    showToast,
    hideToast,
  };

  return (
    <UIContext.Provider value={contextValue}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </UIContext.Provider>
  );
}