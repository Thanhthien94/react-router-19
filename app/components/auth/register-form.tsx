import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "~/hooks/use-auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";

// Regex patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[0-9]{10,11}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export function RegisterForm() {
  const { register, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  
  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState({
    sessionId: "",
    userId: "",
    code: "",
  });

  // Xử lý khi người dùng thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    clearError();
  };

  // Xử lý khi người dùng submit form đăng ký
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let hasError = false;
    const errors = {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };

    // Kiểm tra email hoặc số điện thoại
    if (!formData.email && !formData.phone) {
      errors.email = "Vui lòng nhập email hoặc số điện thoại";
      errors.phone = "Vui lòng nhập email hoặc số điện thoại";
      hasError = true;
    } else {
      if (formData.email && !EMAIL_REGEX.test(formData.email)) {
        errors.email = "Email không hợp lệ";
        hasError = true;
      }
      if (formData.phone && !PHONE_REGEX.test(formData.phone)) {
        errors.phone = "Số điện thoại không hợp lệ";
        hasError = true;
      }
    }

    // Kiểm tra mật khẩu
    if (!formData.password) {
      errors.password = "Vui lòng nhập mật khẩu";
      hasError = true;
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      errors.password = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số";
      hasError = true;
    }

    // Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
      hasError = true;
    }

    if (hasError) {
      setFormErrors(errors);
      return;
    }

    // Submit form
    setIsLoading(true);
    try {
      const response = await register({
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        password: formData.password,
      });
      
      // Chuyển sang bước xác thực
      if (response && response.sessionId) {
        setIsVerifying(true);
        setVerificationData({
          sessionId: response.sessionId,
          userId: response.userId,
          code: "",
        });
      }
    } catch (error) {
      // Lỗi đã được xử lý trong hook useAuth
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi người dùng submit form xác thực
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationData.code) {
      return;
    }

    setIsLoading(true);
    try {
      await useAuth().verifyAccount({
        userId: verificationData.userId,
        sessionId: verificationData.sessionId,
        code: verificationData.code,
      });
    } catch (error) {
      // Lỗi đã được xử lý trong hook useAuth
    } finally {
      setIsLoading(false);
    }
  };

  // Hiển thị form xác thực nếu đang ở bước xác thực
  if (isVerifying) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Xác thực tài khoản</CardTitle>
          <CardDescription>
            Vui lòng nhập mã xác thực đã được gửi đến {formData.email || formData.phone}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                Mã xác thực
              </label>
              <Input
                id="code"
                type="text"
                placeholder="Nhập mã xác thực"
                value={verificationData.code}
                onChange={(e) => setVerificationData(prev => ({ ...prev, code: e.target.value }))}
              />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xác thực..." : "Xác thực"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  // Hiển thị form đăng ký
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng ký</CardTitle>
        <CardDescription>
          Tạo tài khoản mới để sử dụng dịch vụ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? "border-destructive" : ""}
            />
            {formErrors.email && (
              <p className="text-destructive text-sm">{formErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Số điện thoại
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              className={formErrors.phone ? "border-destructive" : ""}
            />
            {formErrors.phone && (
              <p className="text-destructive text-sm">{formErrors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className={formErrors.password ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-destructive text-sm">{formErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={formErrors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-destructive text-sm">{formErrors.confirmPassword}</p>
            )}
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
