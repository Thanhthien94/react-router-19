import { RegisterForm } from "~/components/auth/register-form";
import { PublicRoute } from "~/components/auth/protected-route";

export function meta() {
  return [
    { title: "Đăng ký" },
    { name: "description", content: "Đăng ký tài khoản mới" },
  ];
}

export default function Register() {
  return (
    <PublicRoute>
      <div className="flex flex-col items-center justify-center min-h-svh p-4">
        <RegisterForm />
      </div>
    </PublicRoute>
  );
}
