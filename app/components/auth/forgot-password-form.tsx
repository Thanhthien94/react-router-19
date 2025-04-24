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

export function ForgotPasswordForm() {
  const { requestPasswordReset, verifyResetCode, setNewPassword, error, clearError } = useAuth();
  
  // Step management
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  
  // Request step state
  const [identifier, setIdentifier] = useState("");
  const [identifierType, setIdentifierType] = useState<'email' | 'phone'>('email');
  
  // Verify step state
  const [verificationData, setVerificationData] = useState({
    userId: "",
    sessionId: "",
    code: "",
  });
  
  // Reset step state
  const [resetData, setResetData] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Xử lý khi người dùng thay đổi loại định danh (email/phone)
  const handleIdentifierTypeChange = (type: 'email' | 'phone') => {
    setIdentifierType(type);
    setIdentifier("");
    setFormError("");
    clearError();
  };

  // Xử lý khi người dùng submit form yêu cầu đặt lại mật khẩu
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!identifier) {
      setFormError(`Vui lòng nhập ${identifierType === 'email' ? 'email' : 'số điện thoại'}`);
      return;
    }

    if (identifierType === 'email' && !EMAIL_REGEX.test(identifier)) {
      setFormError("Email không hợp lệ");
      return;
    }

    if (identifierType === 'phone' && !PHONE_REGEX.test(identifier)) {
      setFormError("Số điện thoại không hợp lệ");
      return;
    }

    // Submit form
    setIsLoading(true);
    try {
      const response = await requestPasswordReset({
        [identifierType]: identifier,
      });
      
      // Chuyển sang bước xác thực
      if (response && response.sessionId) {
        setVerificationData({
          userId: response.userId,
          sessionId: response.sessionId,
          code: "",
        });
        setStep('verify');
      }
    } catch (error) {
      // Lỗi đã được xử lý trong hook useAuth
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi người dùng submit form xác thực mã
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationData.code) {
      setFormError("Vui lòng nhập mã xác thực");
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyResetCode({
        userId: verificationData.userId,
        sessionId: verificationData.sessionId,
        code: verificationData.code,
      });
      
      // Chuyển sang bước đặt lại mật khẩu
      if (response && response.token) {
        setResetData({
          ...resetData,
          token: response.token,
        });
        setStep('reset');
      }
    } catch (error) {
      // Lỗi đã được xử lý trong hook useAuth
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi người dùng submit form đặt lại mật khẩu
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!resetData.password) {
      setFormError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (!PASSWORD_REGEX.test(resetData.password)) {
      setFormError("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số");
      return;
    }

    if (resetData.password !== resetData.confirmPassword) {
      setFormError("Mật khẩu xác nhận không khớp");
      return;
    }

    // Submit form
    setIsLoading(true);
    try {
      await setNewPassword({
        userId: verificationData.userId,
        token: resetData.token,
        password: resetData.password,
      });
    } catch (error) {
      // Lỗi đã được xử lý trong hook useAuth
    } finally {
      setIsLoading(false);
    }
  };

  // Hiển thị form theo step hiện tại
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {step === 'request' && "Quên mật khẩu"}
          {step === 'verify' && "Xác thực mã"}
          {step === 'reset' && "Đặt lại mật khẩu"}
        </CardTitle>
        <CardDescription>
          {step === 'request' && "Nhập email hoặc số điện thoại để lấy lại mật khẩu"}
          {step === 'verify' && `Vui lòng nhập mã xác thực đã được gửi đến ${identifier}`}
          {step === 'reset' && "Tạo mật khẩu mới cho tài khoản của bạn"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'request' && (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div className="flex space-x-2 mb-4">
              <Button
                type="button"
                variant={identifierType === 'email' ? "default" : "outline"}
                onClick={() => handleIdentifierTypeChange('email')}
                className="flex-1"
              >
                Email
              </Button>
              <Button
                type="button"
                variant={identifierType === 'phone' ? "default" : "outline"}
                onClick={() => handleIdentifierTypeChange('phone')}
                className="flex-1"
              >
                Số điện thoại
              </Button>
            </div>

            <div className="space-y-2">
              <label htmlFor="identifier" className="text-sm font-medium">
                {identifierType === 'email' ? 'Email' : 'Số điện thoại'}
              </label>
              <Input
                id="identifier"
                type={identifierType === 'email' ? 'email' : 'tel'}
                placeholder={`Nhập ${identifierType === 'email' ? 'email' : 'số điện thoại'}`}
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setFormError("");
                  clearError();
                }}
                className={formError ? "border-destructive" : ""}
              />
              {formError && (
                <p className="text-destructive text-sm">{formError}</p>
              )}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Tiếp tục"}
            </Button>
          </form>
        )}

        {step === 'verify' && (
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
                onChange={(e) => {
                  setVerificationData(prev => ({ ...prev, code: e.target.value }));
                  setFormError("");
                  clearError();
                }}
                className={formError ? "border-destructive" : ""}
              />
              {formError && (
                <p className="text-destructive text-sm">{formError}</p>
              )}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xác thực..." : "Xác thực"}
            </Button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mật khẩu mới
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  value={resetData.password}
                  onChange={(e) => {
                    setResetData(prev => ({ ...prev, password: e.target.value }));
                    setFormError("");
                    clearError();
                  }}
                  className={formError ? "border-destructive pr-10" : "pr-10"}
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
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu mới"
                  value={resetData.confirmPassword}
                  onChange={(e) => {
                    setResetData(prev => ({ ...prev, confirmPassword: e.target.value }));
                    setFormError("");
                    clearError();
                  }}
                  className={formError ? "border-destructive pr-10" : "pr-10"}
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
              {formError && (
                <p className="text-destructive text-sm">{formError}</p>
              )}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Đã nhớ mật khẩu?{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
