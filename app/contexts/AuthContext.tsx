import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Định nghĩa kiểu dữ liệu cho User
interface User {
  id: string;
  email?: string;
  phone?: string;
  token: string;
  // Thêm các thuộc tính khác nếu cần
}

// Định nghĩa kiểu dữ liệu cho AuthState
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Định nghĩa các loại action
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Trạng thái ban đầu
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Ban đầu là true để kiểm tra token
  error: null,
};

// Tạo context
const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | undefined>(undefined);

// Reducer function
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Kiểm tra token khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          dispatch({ type: 'LOGIN_FAILURE', payload: 'No token found' });
          return;
        }

        // Kiểm tra token hợp lệ (có thể gọi API để validate token)
        // Nếu token hợp lệ, lấy thông tin user
        const userId = localStorage.getItem('userId');
        const email = localStorage.getItem('email');
        const phone = localStorage.getItem('phone');

        if (userId) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              id: userId,
              email: email || undefined,
              phone: phone || undefined,
              token,
            },
          });
        } else {
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid token' });
          localStorage.removeItem('token');
        }
      } catch (error) {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: 'Authentication failed',
        });
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook để sử dụng AuthContext
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
