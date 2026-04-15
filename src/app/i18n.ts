// i18n.ts
"use client";
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { reactFurryErrorI18n } from './react-furry-error/i18n';
import { SunnyZyUiI18n } from './sunny-zy-ui/i18n';

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
            theme_modes: {
              light: 'Light',
              dark: 'Dark',
            },
            theme_names: {
              red: 'Red',
              orange: 'Orange',
              yellow: 'Yellow',
              green: 'Green',
              cyan: 'Cyan',
              blue: 'Blue',
              purple: 'Purple',
              black: 'Black',
              white: 'White',
              gray: 'Gray',
              custom: 'Custom',
            },
            custom_theme: {
              open: 'Custom Theme',
              updated: 'saved',
              title: 'Custom Theme',
              description: 'Create one custom palette. Saving again will overwrite the previous custom theme.',
              save: 'Save',
              remove: 'Delete',
              cancel: 'Cancel',
              fields: {
                backgroundColor: 'Background',
                color: 'Text',
                borderColor: 'Border',
                extraColor: 'Primary Accent',
                backgroundColor2: 'Panel Background',
                color2: 'Secondary Text',
                extraColor2: 'Secondary Accent',
              },
            },
            react_furry: {
              title: 'React & Furry',
              description: 'Furry-react persona and react-furry-error for react developpers',
              persona: 'Furry-react persona',
              error: 'react-furry-error',
              hover: {
                persona: 'The React furry persona details and copyright declaration',
                error: 'Open documentation for react-furry-error package.',
              },
            },
            cookie: {
              title: 'Would You Accpet My Cookies ?',
              content: 'If you reject, I will ask you again next session. If you accept, nothing happens because this is a static website and I`ve no cookie for you. I just want to show you how cute I am.',
              accept: 'Accept',
              reject: 'Reject',
            },
            minigame: {
              title: 'Minigame',
              description: 'H5 games written in JS .',
              bwite: 'Black-White Iteration',
              color: 'My Sense Of Color Is Amazing',
              light: 'Light On The Lights(Two-player Battle)',
              hover: {
                bwite: 'the Black-White Iteration web game.',
                color: 'the color perception mini game.',
                light: 'the LightMaze two-player battle game.',
              },
            },
            tools: {
              title: 'Tools',
              description: 'Useful tools',
              tobe: 'Stay Tuned',
              furry: 'Contact Me',
              hover: {
                sunny_zy_ui: 'Browse Sunny-ZY-UI components and interactive previews.',
                furry: 'Open furry contact and related tools page.',
                tobe: 'Placeholder entry for upcoming tools.',
              },
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
              hover: {
                mirror: 'Open the Vercel mirror of this site in a new tab.',
                personal: 'Visit Kino Tsuki personal website on Vercel(Under Construction)',
                make_your_oc_alive: 'Open Make Your OC Alive project site(deprecated)',
              },
            },
          },
          cookie: {
            title: 'Would You Accpet My Cookies ?',
            content: 'If you reject, I will ask you again next session. If you accept, nothing happens because this is a static website and I`ve no cookie for you. I just want to show you how cute I am.',
            accept: 'Accept',
            reject: 'Reject',
          },
          react_furry: {
            download: 'Download',
            get: 'get persona'
          },
          reactFurryError: {
            ...reactFurryErrorI18n.en,
          },
          sunnyZyUi: {
            ...SunnyZyUiI18n.en,
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
            theme_modes: {
              light: '浅色',
              dark: '深色',
            },
            theme_names: {
              red: '红',
              orange: '橙',
              yellow: '黄',
              green: '绿',
              cyan: '青',
              blue: '蓝',
              purple: '紫',
              black: '黑',
              white: '白',
              gray: '灰',
              custom: '自定义',
            },
            custom_theme: {
              open: '自定义主题',
              updated: '已保存',
              title: '自定义主题',
              description: '仅支持保存 1 套自定义配色。再次保存会覆盖上一次的配置。',
              save: '保存',
              remove: '删除',
              cancel: '取消',
              fields: {
                backgroundColor: '背景色',
                color: '文字色',
                borderColor: '边框色',
                extraColor: '主强调色',
                backgroundColor2: '面板背景色',
                color2: '次级文字色',
                extraColor2: '次级强调色',
              },
            },
            react_furry: {
              title: 'React 拟兽兽设',
              description: 'React拟兽兽设说明,与react-furry-error包的使用说明',
              persona: 'React拟兽兽设',
              error: 'react-furry-error',
              hover: {
                persona: '查看 React 拟兽兽设展示页面。',
                error: '打开 react-furry-error 包的使用文档。',
              },
            },
            minigame: {
              title: '小游戏',
              description: '这里是我写的一些H5小游戏。',
              bwite: '黑白迭代',
              color: '我色感贼6',
              light: '点灯新世界(双人游戏)',
              hover: {
                bwite: '启动黑白迭代网页游戏。',
                color: '开始色彩感知小游戏。',
                light: '打开 LightMaze 双人对战游戏。',
              },
            },
            tools: {
              title: '工具',
              description: '这里是我写的一些工具。',
              tobe: '敬请期待',
              furry: 'LXFS',
              hover: {
                sunny_zy_ui: '浏览 Sunny-ZY-UI 组件及交互预览。',
                furry: '打开 furry 联系与相关工具页面。',
                tobe: '预留入口，后续将添加更多工具。',
              },
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
              hover: {
                mirror: '在新标签页打开本站的 Vercel 镜像。',
                personal: '访问 Kino Tsuki 的个人网站。',
                make_your_oc_alive: '打开 Make Your OC Alive 项目站点。',
              },
            },

          },
          react_furry: {
            download: '下载',
            get: '获取兽设',
          },
          reactFurryError: {
            ...reactFurryErrorI18n.zh
          },
          sunnyZyUi: {
            ...SunnyZyUiI18n.zh
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
            theme_modes: {
              light: 'ライト',
              dark: 'ダーク',
            },
            theme_names: {
              red: '赤',
              orange: 'オレンジ',
              yellow: '黄',
              green: '緑',
              cyan: 'シアン',
              blue: '青',
              purple: '紫',
              black: '黒',
              white: '白',
              gray: 'グレー',
              custom: 'カスタム',
            },
            custom_theme: {
              open: 'カスタムテーマ',
              updated: '保存済み',
              title: 'カスタムテーマ',
              description: '保存できるカスタム配色は 1 つです。再保存すると前回の設定を上書きします。',
              save: '保存',
              remove: '削除',
              cancel: 'キャンセル',
              fields: {
                backgroundColor: '背景色',
                color: '文字色',
                borderColor: 'ボーダー色',
                extraColor: 'メインアクセント',
                backgroundColor2: 'パネル背景色',
                color2: 'サブ文字色',
                extraColor2: 'サブアクセント',
              },
            },
            react_furry: {
              title: 'リアクト ファーソナ',
              description: 'Reactのファー(擬獣)設定説明とreact-furry-error パッケージの使用説明',
              persona: 'Reactのファー(擬獣)設定',
              error: 'react-furry-error',
              hover: {
                persona: 'React のファーソナ紹介ページを表示します。',
                error: 'react-furry-error パッケージのドキュメントを開きます。',
              },
            },
            minigame: {
              title: 'ゲーム',
              description: 'ここは私が書いたゲームです。',
              bwite: '黒白の交替',
              color: '私の色感覚が最高だ',
              light: '電気をつける挑戦(二人のゲーム)',
              hover: {
                bwite: '黒白イテレーションのWebゲームを起動します。',
                color: '色覚ミニゲームを開始します。',
                light: 'LightMaze の2人対戦ゲームを開きます。',
              },
            },
            tools: {
              title: '工具',
              description: '役に立つ工具',
              tobe: '乞うご期待',
              furry: '連絡先',
              hover: {
                sunny_zy_ui: 'Sunny-ZY-UI コンポーネントとプレビューを表示します。',
                furry: 'furry 関連の連絡・ツールページを開きます。',
                tobe: '今後追加予定のツール用プレースホルダーです。',
              },
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
              hover: {
                mirror: 'このサイトの Vercel ミラーを新しいタブで開きます。',
                personal: 'Kino Tsuki の個人サイトを表示します。',
                make_your_oc_alive: 'Make Your OC Alive プロジェクトサイトを開きます。',
              },
            },
          },
          react_furry: {
            download: 'ダウンロード',
            get: '擬獣設定を取得する',
          },
          reactFurryError: {
            ...reactFurryErrorI18n.jp
          },
          sunnyZyUi: {
            ...SunnyZyUiI18n.jp
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
