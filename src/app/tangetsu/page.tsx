/* eslint-disable @next/next/no-img-element */
"use client";
import DashedLine from "@/components/boxed/DashedLine";
import { useTheme, darkTheme, lightTheme } from "@/components/boxed/ThemeProvider";
// import { ShowcaseDiv } from "@/components/boxed/MotionComponents"
import Image from "next/image"
import { Col, Container, Row } from "react-bootstrap"

export default function TangetsuPage() {
  const { theme, currentTheme } = useTheme();

  // 图片URL生成函数
  const getImageUrl = (number: number): string => {
    const baseUrl = `https://cdn.jsdelivr.net/gh/MasaoMinn/react-furry-error-docs@main/tangetsu/tangetsu (`;
    const suffix = `).webp`;
    return `${baseUrl}${number}${suffix}`;
  };

  type descItem = {
    type: 'desc',
    title: string,
    content: string,
    image: string
  }
  type showcaseItem = {
    type: 'showcase',
    images: string[]
  }

  const items: (descItem | showcaseItem)[] = [
    {
      type: 'desc',
      title: "Sample Item 1",
      content: "This is a sample content for the first item. The layout is responsive and will adapt to different screen sizes.",
      image: getImageUrl(1) // 使用函数生成图片URL
    },
    {
      type: 'desc',
      title: "Sample Item 2",
      content: "This is a sample content for the second item. The layout is responsive and will adapt to different screen sizes.",
      image: getImageUrl(2) // 使用函数生成图片URL
    },
    {
      type: 'showcase',
      images: [getImageUrl(3), getImageUrl(4)] // 使用函数生成多张图片URL
    }
  ]

  return (
    <Container fluid className="py-5" style={theme === 'light' ? { ...lightTheme[currentTheme] } : { ...darkTheme[currentTheme] }}>
      <Row>
        <Col className="text-center mb-5">
          <h1 className="display-4">Tangetsu Showcase</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <DashedLine
            strokeWidth={2}
            strokeColor="#6366f1"
            curveIntensity={0.3}
            dashArray="6 6"
          >
            {items.map((item, index) => (
              <div key={index} className="">
                <div className="h-100 d-flex flex-column flex-md-row" style={{ backgroundColor: 'transparent', gap: '1rem' }}>
                  {item.type === 'desc' && <><div className="p-3 p-md-4 d-md-none" style={{ backgroundColor: 'transparent' }}>
                    <h3
                      className="h5 font-weight-bold mb-0"
                      style={theme === 'light' ? { color: '#111827' } : { color: '#f9fafb' }}
                    >
                      {item.title}
                    </h3>
                  </div>
                    <div className="position-relative w-100 flex-shrink-0 [max-width:40vw]">
                      <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                    </div>
                    <div className="p-3 p-md-4 flex-grow-1 d-flex flex-column justify-content-center" style={{ backgroundColor: 'transparent' }}>
                      <h3
                        className="h5 font-weight-bold mb-2 mb-md-3 d-none d-md-block"
                        style={theme === 'light' ? { color: '#111827' } : { color: '#f9fafb' }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="mb-0"
                        style={theme === 'light' ? { color: '#374151' } : { color: '#d1d5db' }}
                      >
                        {item.content}
                      </p>
                    </div></>}
                  {item.type === 'showcase' && <>
                    {item.images.map((imgSrc, imgIndex) => (
                      <div key={imgIndex} className="relative w-full max-w-40 overflow-hidden">
                        <img src={imgSrc} alt={`Showcase ${index + 1} Image ${imgIndex + 1}`} className="object-cover w-full h-full" />
                      </div>
                    ))}</>}
                </div>
              </div>
            ))}
          </DashedLine>
        </Col>
      </Row>
    </Container>
  )
}