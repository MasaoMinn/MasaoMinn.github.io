import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

// 全局图片缓存对象
const imageCache = new Map<string, HTMLImageElement>();

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
  }, [queries]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

interface ImageWithDimensions extends Item {
  width: number;
  height: number;
}

const preloadImages = async (items: Item[]): Promise<ImageWithDimensions[]> => {
  return await Promise.all(
    items.map(
      item =>
        new Promise<ImageWithDimensions>(resolve => {
          if (imageCache.has(item.img)) {
            const img = imageCache.get(item.img)!;
            resolve({
              ...item,
              width: img.width,
              height: img.height
            });
            return;
          }

          // 如果缓存中不存在，创建新图片对象
          const img = new Image();
          img.src = item.img;
          img.onload = () => {
            // 将图片添加到缓存
            imageCache.set(item.img, img);
            resolve({
              ...item,
              width: img.width,
              height: img.height
            });
          };
          img.onerror = () => {
            // 如果图片加载失败，使用默认尺寸
            resolve({
              ...item,
              width: 300,
              height: 300
            });
          };
        })
    )
  );
};

interface Item {
  id: string;
  img: string;
  url: string;
  description?: string;
}

interface GridItem extends ImageWithDimensions {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryProps {
  items: Item[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  targetArea?: number; // 控制图片目标面积的参数
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  targetArea // 使用传入的目标面积参数
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesWithDimensions, setImagesWithDimensions] = useState<ImageWithDimensions[]>([]);
  const [imagesReady, setImagesReady] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [activeTouchItemId, setActiveTouchItemId] = useState<string | null>(null);

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right'];
      direction = dirs[Math.floor(Math.random() * dirs.length)] as typeof animateFrom;
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items).then((loadedImages) => {
      setImagesWithDimensions(loadedImages);
      setImagesReady(true);
    });
  }, [items]);

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)');
    const update = () => setIsCoarsePointer(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const grid = useMemo<GridItem[]>(() => {
    if (!width || imagesWithDimensions.length === 0) return [];
    const colHeights = new Array(columns).fill(0);
    const gap = 16;
    const totalGaps = (columns - 1) * gap;

    // 如果没有传入targetArea，则根据所有图片的平均面积计算
    const allImagesArea = imagesWithDimensions.reduce((sum, img) => sum + img.width * img.height, 0);
    const defaultTargetArea = (allImagesArea / imagesWithDimensions.length) * 0.8;
    const finalTargetArea = targetArea || defaultTargetArea;

    return imagesWithDimensions.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * ((width - totalGaps) / columns + gap);

      // 计算保持宽高比的尺寸，使面积接近目标面积
      const aspectRatio = child.width / child.height;
      // 根据面积和宽高比计算宽度和高度
      // area = width * height = width * (width / aspectRatio)
      // width = sqrt(area * aspectRatio)
      let calculatedWidth = Math.sqrt(finalTargetArea * aspectRatio);
      let calculatedHeight = calculatedWidth / aspectRatio;

      // 限制图片最大宽度不超过列宽
      const maxColumnWidth = (width - totalGaps) / columns;
      if (calculatedWidth > maxColumnWidth) {
        calculatedWidth = maxColumnWidth;
        calculatedHeight = calculatedWidth / aspectRatio;
      }

      const y = colHeights[col];

      colHeights[col] += calculatedHeight + gap;
      return { ...child, x, y, w: calculatedWidth, h: calculatedHeight };
    });
  }, [columns, imagesWithDimensions, width, targetArea]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' })
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger
          }
        );
      } else {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: 'auto'
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  // 在组件卸载时清理缓存
  useEffect(() => {
    // 创建页面关闭时清理缓存的处理函数
    const handlePageUnload = () => {
      imageCache.clear();
    };

    // 监听页面卸载事件
    window.addEventListener('beforeunload', handlePageUnload);

    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('beforeunload', handlePageUnload);
    };
  }, []);

  const handleMouseEnter = (id: string, element: HTMLElement) => {
    if (!isCoarsePointer) {
      setHoveredItemId(id);
    }
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (id: string, element: HTMLElement) => {
    setHoveredItemId(current => (current === id ? null : current));
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  const handleItemClick = (item: GridItem) => {
    if (isCoarsePointer && item.description) {
      setActiveTouchItemId(current => (current === item.id ? null : item.id));
      return;
    }

    window.open(item.url, '_blank', 'noopener');
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {grid.map(item => (
        <div
          key={item.id}
          data-key={item.id}
          className="absolute box-content"
          style={{ willChange: 'transform, width, height, opacity' }}
          onClick={() => handleItemClick(item)}
          onMouseEnter={e => handleMouseEnter(item.id, e.currentTarget)}
          onMouseLeave={e => handleMouseLeave(item.id, e.currentTarget)}
        >
          <div
            className="relative h-full w-full overflow-hidden rounded-[10px] bg-cover bg-center uppercase text-[10px] leading-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)]"
            style={{ backgroundImage: `url(${item.img})` }}
          >
            {colorShiftOnHover && (
              <div className="color-overlay absolute inset-0 rounded-[10px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 pointer-events-none" />
            )}
            {item.description && (
              <div
                className="pointer-events-none"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  borderRadius: '10px',
                  opacity: hoveredItemId === item.id || activeTouchItemId === item.id ? 1 : 0,
                  background:
                    'color-mix(in srgb, var(--theme-accent) 28%, transparent)',
                  backdropFilter: 'brightness(0.82) saturate(1.08)',
                  transition: 'opacity 200ms ease',
                }}
              >
                <p
                  className="normal-case text-white"
                  style={{
                    width: '100%',
                    margin: 0,
                    textAlign: 'center',
                    fontSize: 'clamp(16px, 1.45vw, 20px)',
                    fontWeight: 700,
                    lineHeight: 1.45,
                    textShadow: '0 2px 5px rgba(0,0,0,0.45)',
                  }}
                >
                  {item.description}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Masonry;
