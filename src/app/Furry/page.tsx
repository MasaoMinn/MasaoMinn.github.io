"use client";
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import ImgCarousel from './Carousel';
import { useTranslation } from 'react-i18next'
import SocialLinkSection from './SocialLinkSection';
import ThemedButton from '@/components/boxed/ThemedButton';

const QQProfileLink: React.FC = () => {
  const { t } = useTranslation();

  const socialLinks = [
    {
      id: 'qq',
      url: 'https://qm.qq.com/q/QTfus78dqe',
      ariaLabel: '访问QQ：2134361910',
      iconSrc: '/LXFS/QQicon.png',
      iconAlt: 'QQ图标',
      buttonText: '点击跳转我的QQ',
      qrCodeSrc: '/LXFS/QQ.jpg',
      qrCodeAlt: 'QQ二维码',
      accordionHeader: '查看QQ二维码',
    },
    {
      id: 'xiaohongshu',
      url: 'https://www.xiaohongshu.com/user/profile/649132e3000000000f004dc5?xhsshare=userQrCode',
      ariaLabel: '访问小红书：5514710200',
      iconSrc: '/LXFS/xiaohongshuicon.png',
      iconAlt: '小红书图标',
      buttonText: '点击跳转我的小红书',
      qrCodeSrc: '/LXFS/xiaohongshu.jpg',
      qrCodeAlt: '小红书二维码',
      accordionHeader: '查看小红书二维码',
    },
    {
      id: 'douyin',
      url: 'https://www.douyin.com/user/MS4wLjABAAAA3ZnB6dr1lknUupJiF0XZrWZ1mUtsvpRJfuSgmT94WRJpfkvO5S4Jja5h4yFo9vyM?from_tab_name=main',
      ariaLabel: '访问抖音',
      iconSrc: '/LXFS/douyinicon.png',
      iconAlt: '抖音图标',
      buttonText: '点击跳转我的抖音',
      qrCodeSrc: '/LXFS/douyin.png',
      qrCodeAlt: '抖音二维码',
      accordionHeader: '查看抖音二维码',
    },
  ];

  return (
    <Container
      fluid
      className="theme-page px-3 min-vh-100 py-3"
    >
      <ThemedButton onClick={() => window.history.back()} className="mb-3">
        {t('mainpage.back')}
      </ThemedButton>

      <Row className="justify-content-center g-1 mb-4">
        <Col
          xs={12}
          lg={8}
          xl={6}
          className="theme-surface justify-content-center mt-3 rounded-lg border-2 p-2"
        >
          <ImgCarousel />
        </Col>
      </Row>

      <Row className="justify-content-center g-1 mb-4">
        <Col xs={10} md={9} lg={8} className="d-flex justify-content-center">
          <p
            className="theme-surface w-full rounded-lg border-2 p-3 text-center text-sm md:text-base lg:text-lg"
            style={{ color: "var(--foreground)" }}
          >
            {t('mainpage.furry.intro')}
          </p>
        </Col>
      </Row>

      {socialLinks.map((link) => (
        <SocialLinkSection key={link.id} {...link} />
      ))}
    </Container>
  );
};

export default QQProfileLink;
