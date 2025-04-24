import { LoginForm } from "~/components/auth/login-form";
import { PublicRoute } from "~/components/auth/protected-route";

export function meta() {
  return [
    { title: "Đăng nhập" },
    { name: "description", content: "Đăng nhập vào tài khoản của bạn" },
  ];
}

export default function Login() {
  return (
    <PublicRoute>
      <div className="flex flex-col items-center justify-center min-h-svh p-4">
        <LoginForm />
      </div>
    </PublicRoute>
  );
}
