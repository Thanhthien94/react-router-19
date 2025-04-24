import { ForgotPasswordForm } from "~/components/auth/forgot-password-form";
import { PublicRoute } from "~/components/auth/protected-route";

export function meta() {
  return [
    { title: "Quên mật khẩu" },
    { name: "description", content: "Khôi phục mật khẩu tài khoản của bạn" },
  ];
}

export default function ForgotPassword() {
  return (
    <PublicRoute>
      <div className="flex flex-col items-center justify-center min-h-svh p-4">
        <ForgotPasswordForm />
      </div>
    </PublicRoute>
  );
}
