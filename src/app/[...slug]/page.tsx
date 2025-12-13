import Link from 'next/link';

// 为catch-all路由生成静态参数，支持静态导出
export function generateStaticParams() {
  // 返回一个包含可能的slug组合的数组
  // 由于这是一个404页面的catch-all路由，我们只需要提供一个基本的路径
  return [
    { slug: ['404'] },
    { slug: [] } // 空slug情况
  ];
}

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-600 mb-8">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Sorry, the page you are looking for doesn`t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
      >
        Return to Home
      </Link>
    </div>
  );
}