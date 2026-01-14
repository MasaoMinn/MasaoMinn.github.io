"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type Direction = "horizontal" | "vertical";

// easeInOutQuart 缓动函数的 cubic-bezier 近似值
const EASE_IN_OUT_QUART = "cubic-bezier(0.76, 0, 0.24, 1)";

interface DashedLineProps {
  children: React.ReactNode;
  strokeWidth?: number;
  strokeColor?: string;
  curveIntensity?: number;
  dashArray?: string;
  duration?: number;
  easing?: string;
  direction?: Direction;
}

const DashedLine: React.FC<DashedLineProps> = ({
  children,
  strokeWidth = 2,
  strokeColor = "#6366f1",
  curveIntensity = 0.35,
  dashArray = "6 6",
  duration = 600,
  easing = EASE_IN_OUT_QUART,
  direction = "vertical",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const calculatePaths = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const elements = itemRefs.current.filter((el): el is HTMLDivElement => el !== null);

    if (elements.length < 2) {
      setPaths([]);
      setSvgSize({
        width: containerRect.width || 100,
        height: containerRect.height || 100
      });
      return;
    }

    const newPaths: string[] = [];
    let maxX = containerRect.width;
    let maxY = containerRect.height;

    for (let i = 0; i < elements.length - 1; i++) {
      const from = elements[i].getBoundingClientRect();
      const to = elements[i + 1].getBoundingClientRect();

      // 交替连接：偶数索引从左边连接，奇数索引从右边连接
      // 第一个组件(索引0)从左边 -> 第二个组件(索引1)从右边
      // 第二个组件(索引1)从右边 -> 第三个组件(索引2)从左边
      const isEvenIndex = i % 2 === 0;

      if (direction === "vertical") {
        // 垂直方向：从上到下
        // 交替连接：偶数索引从左边连接，奇数索引从右边连接
        const startX = isEvenIndex
          ? from.left - containerRect.left // 从左边
          : from.right - containerRect.left; // 从右边
        const startY = from.top - containerRect.top + from.height / 2; // 垂直中心

        const endX = isEvenIndex
          ? to.right - containerRect.left // 到右边
          : to.left - containerRect.left; // 到左边
        const endY = to.top - containerRect.top + to.height / 2; // 垂直中心

        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // 在移动端使用更小的曲线强度，确保虚线不会超出屏幕
        const adjustedCurveIntensity = isMobile ? curveIntensity * 0.6 : curveIntensity;
        const offset = distance * adjustedCurveIntensity;

        // 计算控制点，使曲线更平滑
        // 控制点1在起点附近，控制点2在终点附近
        const controlX1 = startX + (isEvenIndex ? -offset * 0.5 : offset * 0.5);
        const controlY1 = startY + dy * 0.3;
        const controlX2 = endX + (isEvenIndex ? offset * 0.5 : -offset * 0.5);
        const controlY2 = endY - dy * 0.3;

        const path = `M ${startX},${startY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
        newPaths.push(path);

        maxX = Math.max(maxX, startX, endX, controlX1, controlX2);
        maxY = Math.max(maxY, startY, endY, controlY1, controlY2);
      } else {
        // 水平方向：从左到右
        // 交替连接：偶数索引从左边连接，奇数索引从右边连接
        const startX = isEvenIndex
          ? from.left - containerRect.left // 从左边
          : from.right - containerRect.left; // 从右边
        const startY = from.top - containerRect.top + from.height / 2; // 垂直中心

        const endX = isEvenIndex
          ? to.right - containerRect.left // 到右边
          : to.left - containerRect.left; // 到左边
        const endY = to.top - containerRect.top + to.height / 2; // 垂直中心

        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // 在移动端使用更小的曲线强度，确保虚线不会超出屏幕
        const adjustedCurveIntensity = isMobile ? curveIntensity * 0.6 : curveIntensity;
        const offset = distance * adjustedCurveIntensity;

        // 计算控制点，使曲线更平滑
        // 控制点1在起点附近，控制点2在终点附近
        const controlX1 = startX + dx * 0.3;
        const controlY1 = startY + (isEvenIndex ? -offset * 0.5 : offset * 0.5);
        const controlX2 = endX - dx * 0.3;
        const controlY2 = endY + (isEvenIndex ? offset * 0.5 : -offset * 0.5);

        const path = `M ${startX},${startY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
        newPaths.push(path);

        maxX = Math.max(maxX, startX, endX, controlX1, controlX2);
        maxY = Math.max(maxY, startY, endY, controlY1, controlY2);
      }
    }

    setPaths(newPaths);
    // 为虚线留出足够的边距，确保完整显示
    // 移动端使用较小的边距，桌面端使用较大的边距
    const padding = isMobile ? 60 : 100;
    setSvgSize({
      width: Math.max(containerRect.width, maxX + padding),
      height: Math.max(containerRect.height, maxY + padding)
    });
  }, [curveIntensity, direction, isMobile]);

  useLayoutEffect(() => {
    // 检测是否为移动端
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    calculatePaths();
    window.addEventListener("resize", () => {
      checkMobile();
      calculatePaths();
    });

    // 使用 ResizeObserver 监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      calculatePaths();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", calculatePaths);
      resizeObserver.disconnect();
    };
  }, [calculatePaths, children]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* SVG */}
      <svg
        className="absolute top-0 left-0 pointer-events-none w-full h-full"
        width={svgSize.width > 0 ? svgSize.width : undefined}
        height={svgSize.height > 0 ? svgSize.height : undefined}
        style={{
          zIndex: 0,
          overflow: "visible",
        }}
        preserveAspectRatio="none"
      >
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            className="dashed-line"
            style={{
              transition: `stroke-dashoffset ${duration}ms ${easing}, d ${duration}ms ${easing}`,
            }}
          />
        ))}
      </svg>

      {/* children layout */}
      <div
        className={`relative flex ${direction === "vertical" ? "flex-col gap-4 md:gap-6" : "flex-row gap-4 md:gap-6"}`}
        style={{ zIndex: 1 }}
      >
        {Children.map(children, (child, i) =>
          isValidElement(child) ? (
            <div
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
            >
              {cloneElement(child)}
            </div>
          ) : (
            child
          )
        )}
      </div>
    </div>
  );
};

export default DashedLine;