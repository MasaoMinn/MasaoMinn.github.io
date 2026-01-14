// i18n.ts
"use client";
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { reactFurryErrorI18n } from './react-furry-error/i18n';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh', 'jp'],
    debug: false,
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'language',
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
            vercel: {
              title: 'My websites on Vercel',
              description: 'My sites on Vercel enable back-end actions.I use it to host my full-stack sites.',
              mirror: 'Mirror Site of this',
              personal: 'My Personal Website',
              make_your_oc_alive: 'Make Your OC Alive',
            },
          },
          react_furry: {
            download: 'Download',
            get: 'get persona'
          },
          reactFurryError: {
            ...reactFurryErrorI18n.en,
          },
          cookie: {
            title: 'Would You Accpet My Cookies ?',
            content: 'If you reject, I will ask you again next session. If you accept, nothing happens because this is a static website and I`ve no cookie for you. I just want to show you how cute I am.',
            accept: 'Accept',
            reject: 'Reject',
          }

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
            vercel: {
              title: '我的 Vercel 网站',
              description: '我的 Vercel 网站启用后端操作。我用它来托管我的全栈网站。',
              mirror: '这个网站的镜像',
              personal: '我的个人网站',
              make_your_oc_alive: 'Make Your OC Alive',
            },

          },
          react_furry: {
            download: '下载',
            get: '获取兽设',
          },
          reactFurryError: {
            ...reactFurryErrorI18n.zh
          },
          cookie: {
            title: '是否接受我的Cookie ?',
            content: '如果你拒绝,我会在下次会话中再次询问。如果您接受,我也没有cookie给你,因为这是个静态网站。我只是想让你看看我有多可爱。',
            accept: '接受',
            reject: '拒绝',
          }

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
            },
            furry: {
              intro: "こんにちは！私はキノツキ、広州に住む青いケモノの狐です。ここであなたとつながることができてうれしいです！友達追加のためにいつでも連絡してください。お話ししたり、ケモノの興味を共有したりするのを楽しみにしています！"
            },
            vercel: {
              title: '私の Vercel サイト',
              description: 'Vercel サイトはバックエンド操作を有効にしていて、それを使って私のフルスタックサイトをホストしております。',
              mirror: 'このサイトのミラー',
              personal: '私の個人サイト',
              make_your_oc_alive: 'Make Your OC Alive',
            },
          },
          react_furry: {
            download: 'ダウンロード',
            get: '擬獣設定を取得する',
          },
          reactFurryError: {
            ...reactFurryErrorI18n.jp
          },
          cookie: {
            title: 'Cookieを受け入れますか？',
            content: 'もし拒否した場合は、次のセッションで再度質問します。受け入れた場合は、これは静的サイトであるため、Cookieを与えられないということだ. 私は、あなたが私をどのくらい好きであるかを示すために、このサイトを訪れたことを願っています。',
            accept: '受け入れる',
            reject: '拒否する',
          }
        }
      }
    }
  });
export default i18n