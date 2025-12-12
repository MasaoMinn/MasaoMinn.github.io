// i18n.ts
"use client";
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh', 'jp'],
    debug: false,
    detection: {
      order: ['cookie', 'navigator'],
      caches: ['cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          lang: 'Language',
          mainpage: {
            title: 'Sunny_Tangetsu - Static Resource Site',
            dropdown: 'More',
            about: 'About Me',
            seeme: 'See me on Github',
            theme: 'Theme',
            theme_variant: 'Theme Variant',
            back: 'Back',
            react_furry: {
              title: 'React & Furry',
              description: 'Furry-react persona and react-furry-error for react developpers',
              persona: 'Furry-react persona',
              error: 'react-furry-error'
            },
            minigame: {
              title: 'Minigame',
              description: 'H5 games written in JS .',
              bwite: 'Black-White Iteration',
              color: 'My Sense Of Color Is Amazing',
              light: 'Light On The Lights(Two-player Battle)',
            },
            tools: {
              title: 'Tools',
              description: 'Useful tools',
              tobe: 'Stay Tuned',
              furry: 'Contact Me'
            },
            furry: {
              intro: "Hello! This is Kino Tsuki, a blue furry fox, living in Guangzhou China.I'm excited to connect with you here! Feel free to reach out to add me as a friend. Looking forward to chatting and sharing our furry interests!"
            },
          },

        }
      },
      zh: {
        translation: {
          lang: '语言',
          mainpage: {
            title: 'Sunny_湛月 - 静态资源网站',
            dropdown: '更多',
            about: '关于我',
            seeme: '我的 Github',
            theme: '主题',
            theme_variant: '主题变体',
            back: '返回',
            react_furry: {
              title: 'React 拟兽兽设',
              description: 'React拟兽兽设说明,与react-furry-error包的使用说明',
              persona: 'React拟兽兽设',
              error: 'react-furry-error'
            },
            minigame: {
              title: '小游戏',
              description: '这里是我写的一些H5小游戏。',
              bwite: '黑白迭代',
              color: '我色感贼6',
              light: '点灯新世界(双人游戏)'
            },
            tools: {
              title: '工具',
              description: '这里是我写的一些工具。',
              tobe: '敬请期待',
              furry: 'LXFS'
            },
            furry: {
              intro: "你好！我是湛月，一只生活在中国广州的蓝色兽设狐狸。很高兴能在这里与你联系！欢迎随时联系我加为好友。期待与你聊天并分享furry的乐趣！"
            },

          },

        }
      },
      jp: {
        translation: {
          lang: '言語',
          mainpage: {
            title: 'Sunny_湛月 - 静的リソースサイト',
            dropdown: 'そのうえ',
            about: '私について',
            seeme: 'Github',
            theme: '色気',
            theme_variant: 'テーマバリエーション',
            back: '戻る',
            react_furry: {
              title: 'リアクト ファーソナ',
              description: 'Reactのファー(擬獣)設定説明とreact-furry-error パッケージの使用説明',
              persona: 'Reactのファー(擬獣)設定',
              error: 'react-furry-error'
            },
            minigame: {
              title: 'ゲーム',
              description: 'ここは私が書いたゲームです。',
              bwite: '黒白の交替',
              color: '私の色感覚が最高だ',
              light: '電気をつける挑戦(二人のゲーム)',
            },
            tools: {
              title: '工具',
              description: '役に立つ工具',
              tobe: '乞うご期待',
              furry: '連絡先'
            }
          },
          furry: {
            intro: "こんにちは！私はキノツキ、広州に住む青いケモノの狐です。ここであなたとつながることができてうれしいです！友達追加のためにいつでも連絡してください。お話ししたり、ケモノの興味を共有したりするのを楽しみにしています！"
          },
        }
      }
    }
  });
export default i18n