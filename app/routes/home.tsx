import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "~/hooks/use-auth";

export function meta() {
  return [
    { title: "Trang chủ" },
    { name: "description", content: "Trang chủ ứng dụng" },
  ];
}

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4">
      <h1 className="text-3xl font-bold mb-6">Chào mừng đến với ứng dụng</h1>

      {isAuthenticated ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">Xin chào, {user?.email || user?.phone || "Người dùng"}</p>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/profile">Hồ sơ cá nhân</Link>
            </Button>
            <Button variant="destructive" onClick={logout}>
              Đăng xuất
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">Vui lòng đăng nhập hoặc đăng ký để tiếp tục</p>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/auth/login">Đăng nhập</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/auth/register">Đăng ký</Link>
            </Button>
          </div>
        </div>
      )}

      <Button
        variant="outline"
        onClick={() =>
          toast("Thông báo", {
            description: "Đây là một thông báo mẫu",
            action: {
              label: "Đóng",
              onClick: () => console.log("Đóng thông báo"),
            },
          })
        }
        className="mt-8"
      >
        Hiển thị thông báo
      </Button>
    </div>
  );
}