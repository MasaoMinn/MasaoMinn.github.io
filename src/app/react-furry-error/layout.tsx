"use client";
import { Container, Row, Col, Stack, Button, Alert } from 'react-bootstrap';
import { useTheme, lightTheme, darkTheme } from '@/components/boxed/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import "highlight.js/styles/github.css";

export default function ReactFurryErrorLayout({ children }: { children: React.ReactNode }) {
  const { theme, currentTheme } = useTheme();
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [initialNotice, setInitialNotice] = useState<boolean>(true);

  const isActive = (path: string) => pathname === `/react-furry-error/${path}`;

  // 检测屏幕尺寸变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // 在桌面端自动展开侧边栏
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        // 在移动端默认关闭侧边栏
        setIsSidebarOpen(false);
      }
    };

    // 初始检测
    handleResize();
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    // 清理事件监听
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 切换侧边栏显示状态
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Container
      className="min-vh-100"
      style={theme === 'light' ? lightTheme[currentTheme] : darkTheme[currentTheme]}
      fluid
    >
      <Row>
        <Col xs={12} lg={8} className="mx-auto">
          <Alert show={initialNotice} variant="warning" style={{ background: 'transparent' }}>
            <Alert.Heading>{t('reactFurryError.notice.title')}</Alert.Heading>
            <p>
              {t('reactFurryError.notice.content')}
            </p>
            <a target="_blank" rel="noopener noreferrer" href='https://kcnhl2uub4k0.feishu.cn/wiki/WkOUwdykxiXjx8kLNH3chhpQn0c'>Link</a>
            <hr />
            <div className="d-flex justify-content-end">
              <Button onClick={() => setInitialNotice(false)} variant="outline-success">
                {t('reactFurryError.notice.close')}
              </Button>
            </div>
          </Alert>
        </Col>
      </Row>
      <Row className='min-vh-100 d-flex flex-nowrap'>
        {/* 移动端汉堡菜单按钮 */}
        <div className="d-block d-md-none fixed top-2 right-2 z-50">
          <Button
            variant="primary"
            onClick={toggleSidebar}
            style={{
              backgroundColor: theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor,
              borderColor: theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor,
              color: theme === 'light' ? lightTheme[currentTheme].color : darkTheme[currentTheme].color
            }}
          >
            {isSidebarOpen ? '×' : '☰'}
          </Button>
        </div>

        {/* 侧边栏 */}
        <Col xs={isMobile ? (isSidebarOpen ? 12 : 0) : 'auto'} className="p-0" style={{
          minWidth: isMobile ? '0' : '180px',
          maxWidth: isMobile ? '300px' : '200px',
          flexShrink: 0, // 防止侧边栏被压缩
        }}>
          <div
            className={`transition-all duration-300 ease-in-out ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : ''}`}
            style={{
              position: isMobile ? 'fixed' : 'relative',
              zIndex: 100,
              height: '100vh',
              overflow: 'visible'
            }}
          >
            <Stack
              className={`p-3 mt-2 border border-2 rounded h-100 w-100`}
              gap={3}
              style={{
                width: '100%',
                borderColor: theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor,
                backgroundColor: theme === 'light' ? lightTheme[currentTheme].backgroundColor : darkTheme[currentTheme].backgroundColor
              }}
            >
              {/* 移动端关闭按钮 */}
              {isMobile && isSidebarOpen && (
                <Button
                  variant="primary"
                  onClick={toggleSidebar}
                  className="ml-auto"
                  style={{
                    backgroundColor: theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor,
                    borderColor: theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor,
                    color: theme === 'light' ? lightTheme[currentTheme].color : darkTheme[currentTheme].color
                  }}
                >
                  ×
                </Button>
              )}

              <Link
                href="/react-furry-error/introduction"
                className={`p-2 cursor-pointer rounded`}
                style={{
                  color: theme === 'light' ? lightTheme[currentTheme].color : darkTheme[currentTheme].color,
                  backgroundColor: isActive('introduction')
                    ? (theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor)
                    : 'transparent',
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                  textOverflow: 'visible'
                }}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                {t('reactFurryError.introduction')}
              </Link>
              <Link
                href="/react-furry-error/install"
                className={`p-2 cursor-pointer rounded`}
                style={{
                  color: theme === 'light' ? lightTheme[currentTheme].color : darkTheme[currentTheme].color,
                  backgroundColor: isActive('install')
                    ? (theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor)
                    : 'transparent',
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                  textOverflow: 'visible'
                }}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                {t('reactFurryError.install')}
              </Link>
              <Link
                href="/react-furry-error/mechanism"
                className={`p-2 cursor-pointer rounded`}
                style={{
                  color: theme === 'light' ? lightTheme[currentTheme].color : darkTheme[currentTheme].color,
                  backgroundColor: isActive('mechanism')
                    ? (theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor)
                    : 'transparent',
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                  textOverflow: 'visible'
                }}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                {t('reactFurryError.mechanism')}
              </Link>
              <Link
                href="/react-furry-error/gallery"
                className={`p-2 cursor-pointer rounded`}
                style={{
                  color: theme === 'light' ? lightTheme[currentTheme].color : darkTheme[currentTheme].color,
                  backgroundColor: isActive('gallery')
                    ? (theme === 'light' ? lightTheme[currentTheme].borderColor : darkTheme[currentTheme].borderColor)
                    : 'transparent',
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                  textOverflow: 'visible'
                }}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                {t('reactFurryError.gallery')}
              </Link>
            </Stack>
          </div>
        </Col>

        {/* 主要内容区域 */}
        <Col
          className='p-5 flex-grow-1'
          style={{
            flex: '1 1 100%', // 确保内容区域占据剩余的所有空间
            overflow: 'auto' // 确保内容溢出时可以滚动
          }}
        >
          {children}
        </Col>
      </Row>
    </Container>
  );
}