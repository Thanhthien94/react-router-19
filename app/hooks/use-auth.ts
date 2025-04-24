import { useCallback } from 'react';
import { useAuthContext } from '~/contexts/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

interface LoginCredentials {
  username: string; // Email hoặc số điện thoại
  password: string;
}

interface RegisterCredentials {
  email?: string;
  phone?: string;
  password: string;
}

interface ResetPasswordRequest {
  email?: string;
  phone?: string;
}

interface VerifyCodeRequest {
  userId: string;
  sessionId: string;
  code: string;
}

interface SetNewPasswordRequest {
  userId: string;
  token: string;
  password: string;
}

export function useAuth() {
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();

  // Hàm đăng nhập
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      dispatch({ type: 'LOGIN_START' });
      try {
        // Gọi API đăng nhập
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();

        // Lưu token và thông tin user vào localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data._id);
        if (data.email) localStorage.setItem('email', data.email);
        if (data.phone) localStorage.setItem('phone', data.phone);

        // Cập nhật state
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            id: data._id,
            email: data.email,
            phone: data.phone,
            token: data.token,
          },
        });

        toast.success('Đăng nhập thành công');
        navigate('/');
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Đăng nhập thất bại';
        dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
        toast.error(errorMessage);
        throw error;
      }
    },
    [dispatch, navigate]
  );

  // Hàm đăng ký
  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      dispatch({ type: 'REGISTER_START' });
      try {
        // Gọi API đăng ký
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }

        const data = await response.json();
        toast.success('Đăng ký thành công, vui lòng xác thực tài khoản');
        
        // Trả về dữ liệu để xử lý xác thực
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Đăng ký thất bại';
        dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
        toast.error(errorMessage);
        throw error;
      }
    },
    [dispatch]
  );

  // Hàm xác thực tài khoản sau khi đăng ký
  const verifyAccount = useCallback(
    async (verifyData: VerifyCodeRequest) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/onboard`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(verifyData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Verification failed');
        }

        const data = await response.json();
        toast.success('Xác thực tài khoản thành công, vui lòng đăng nhập');
        navigate('/auth/login');
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Xác thực thất bại';
        toast.error(errorMessage);
        throw error;
      }
    },
    [navigate]
  );

  // Hàm yêu cầu đặt lại mật khẩu
  const requestPasswordReset = useCallback(
    async (resetData: ResetPasswordRequest) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/forgot-password`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(resetData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Password reset request failed');
        }

        const data = await response.json();
        toast.success('Vui lòng kiểm tra email/điện thoại để lấy mã xác thực');
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Yêu cầu đặt lại mật khẩu thất bại';
        toast.error(errorMessage);
        throw error;
      }
    },
    []
  );

  // Hàm xác thực mã code để đặt lại mật khẩu
  const verifyResetCode = useCallback(
    async (verifyData: VerifyCodeRequest) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/${verifyData.userId}/reset-password`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId: verifyData.sessionId,
              code: verifyData.code,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Code verification failed');
        }

        const data = await response.json();
        toast.success('Mã xác thực hợp lệ');
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Xác thực mã thất bại';
        toast.error(errorMessage);
        throw error;
      }
    },
    []
  );

  // Hàm đặt lại mật khẩu mới
  const setNewPassword = useCallback(
    async (passwordData: SetNewPasswordRequest) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/${passwordData.userId}/reset-password`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${passwordData.token}`,
            },
            body: JSON.stringify({
              password: passwordData.password,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Password reset failed');
        }

        toast.success('Đặt lại mật khẩu thành công');
        navigate('/auth/login');
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Đặt lại mật khẩu thất bại';
        toast.error(errorMessage);
        throw error;
      }
    },
    [navigate]
  );

  // Hàm đăng xuất
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    dispatch({ type: 'LOGOUT' });
    toast.success('Đăng xuất thành công');
    navigate('/');
  }, [dispatch, navigate]);

  // Hàm xóa thông báo lỗi
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    verifyAccount,
    requestPasswordReset,
    verifyResetCode,
    setNewPassword,
    logout,
    clearError,
  };
}
