import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "~/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = "/auth/login" 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Nếu đang kiểm tra trạng thái xác thực, hiển thị loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Nếu chưa xác thực, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Nếu đã xác thực, hiển thị nội dung
  return <>{children}</>;
}

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function PublicRoute({ 
  children, 
  redirectTo = "/" 
}: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Lấy đường dẫn chuyển hướng từ state (nếu có)
  const from = location.state?.from || redirectTo;

  // Nếu đang kiểm tra trạng thái xác thực, hiển thị loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Nếu đã xác thực, chuyển hướng đến trang chủ hoặc trang trước đó
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  // Nếu chưa xác thực, hiển thị nội dung
  return <>{children}</>;
}
