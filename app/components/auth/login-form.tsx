import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "~/hooks/use-auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function LoginForm() {
  const { login, error, clearError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
  });

  // Xử lý khi người dùng thay đổi input
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setFormErrors((prev) => ({ ...prev, username: "" }));
    clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setFormErrors((prev) => ({ ...prev, password: "" }));
    clearError();
  };

  // Xử lý khi người dùng submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let hasError = false;
    const errors = {
      username: "",
      password: "",
    };

    if (!username.trim()) {
      errors.username = "Vui lòng nhập email hoặc số điện thoại";
      hasError = true;
    }

    if (!password) {
      errors.password = "Vui lòng nhập mật khẩu";
      hasError = true;
    }

    if (hasError) {
      setFormErrors(errors);
      return;
    }

    // Submit form
    setIsLoading(true);
    try {
      await login({ username, password });
    } catch (error) {
      // Lỗi đã được xử lý trong hook useAuth
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Đăng nhập vào tài khoản của bạn để tiếp tục
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Email hoặc Số điện thoại
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Nhập email hoặc số điện thoại"
              value={username}
              onChange={handleUsernameChange}
              className={formErrors.username ? "border-destructive" : ""}
            />
            {formErrors.username && (
              <p className="text-destructive text-sm">{formErrors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={handlePasswordChange}
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

          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="text-right">
            <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link to="/auth/register" className="text-primary hover:underline">
            Đăng ký
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
