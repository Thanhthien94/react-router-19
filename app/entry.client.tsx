import { startTransition, StrictMode, Suspense } from "react";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { routes } from "./routes";

// Import MSW mocks
console.log('Loading MSW mocks...');
import './mocks';

// Tạo router từ routes đã định nghĩa
const router = createBrowserRouter(routes);

// Component loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Thêm hàm xử lý sau khi hydrate
function handleHydrationComplete() {
  // Xóa class js-loading nếu có
  if (document.documentElement.classList.contains('js-loading')) {
    document.documentElement.classList.remove('js-loading');
  }
  
  console.log('Hydration completed successfully');
}

startTransition(() => {
  const hydrate = hydrateRoot(
    document,
    <StrictMode>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </StrictMode>,
    {
      onRecoverableError: (error, errorInfo) => {
        // Bỏ qua lỗi hydration mismatch
        if (error.message && error.message.includes('Hydration failed because')) {
          console.log('Ignoring hydration mismatch:', error.message);
          return;
        }
        console.error('React hydration error:', error, errorInfo);
      }
    }
  );
  
  // Đăng ký callback sau khi hydrate hoàn tất
  Promise.resolve(hydrate).then(handleHydrationComplete);
});
