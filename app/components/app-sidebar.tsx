import { Home, LogIn, UserPlus, User, Settings } from "lucide-react"
import { Link } from "react-router"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "@/components/theme-toggle"

// Menu items.
const getItems = (isAuthenticated: boolean) => {
  const commonItems = [
    {
      title: "Trang chủ",
      url: "/",
      icon: Home,
    },
  ]

  const authItems = isAuthenticated
    ? [
        {
          title: "Hồ sơ",
          url: "/profile",
          icon: User,
        },
        {
          title: "Cài đặt",
          url: "/settings",
          icon: Settings,
        },
      ]
    : [
        {
          title: "Đăng nhập",
          url: "/auth/login",
          icon: LogIn,
        },
        {
          title: "Đăng ký",
          url: "/auth/register",
          icon: UserPlus,
        },
      ]

  return [...commonItems, ...authItems]
}

export function AppSidebar() {
  const { isAuthenticated } = useAuth();
  const items = getItems(isAuthenticated);

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
