import { useAuth } from "~/hooks/use-auth";
import { ProtectedRoute } from "~/components/auth/protected-route";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export function meta() {
  return [
    { title: "Hồ sơ cá nhân" },
    { name: "description", content: "Quản lý thông tin cá nhân của bạn" },
  ];
}

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-svh p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Hồ sơ cá nhân</CardTitle>
            <CardDescription>
              Thông tin tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p>{user?.id}</p>
            </div>
            {user?.email && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{user.email}</p>
              </div>
            )}
            {user?.phone && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                <p>{user.phone}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={logout} className="w-full">
              Đăng xuất
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
