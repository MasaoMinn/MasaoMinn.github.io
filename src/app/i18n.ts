// i18n.ts
"use client";
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { SunnyZyUiI18n } from './tools/sunny-zy-ui/i18n';
import { ExperienceI18n } from './experience-i18n';

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
          experience: ExperienceI18n.en,
          lang: 'Language',
          mainpage: {
            title: 'Sunny_Tangetsu',
            description: 'Curated entrances for my projects. Choose a lane and jump in.',
            introduction: `I am **Sunny_Tangetsu**, currently a **senior** student majoring in **Software Engineering** at **South China University of Technology**.

In high school, I fell in love with *C++* programming competitions, which is also the reason I chose this major.

I am learning full-stack development using the **PERN (PostgreSQL, Express.js, React.js, Node.js) stack** with Next.js as the framework, and this page is my first frontend project.

I am currently learning **English** *(TOEFL 100, C1)* and **Japanese** *(JLPT N1)*. In the future, I plan to study other languages, such as Spanish and French.

In my free time, I enjoy painting or making practical tools. I find great satisfaction in the sense of achievement after completing a small project.

The character on the left is my **furry** design. It was my first furry, obtained when I was in my second year of high school

My motto: **Motivated but not stressed, tense but not anxious, swift but not frantic.**.

You can find my contact information below in the "Contact Me" section
`,
            dropdown: 'More',
            about: 'About Me',
            seeme: 'See me on Github',
            theme: 'Theme',
            theme_variant: 'Theme Variant',
            back: 'Back',
            contact: 'Contact Me',
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
            cursor: {
              title: 'CursorLab',
              reset: 'Reset',
              enable: 'Enable cursor effects',
              click_effect: 'Click burst effect',
              trail_shape: 'Trail shape',
              size: 'Trail size',
              thickness: 'Trail thickness',
              delay: 'Trail delay',
              trail_types: {
                circle: 'Circle',
                'circle-filled': 'Circle Filled',
                square: 'Square',
                'square-filled': 'Square Filled',
                triangle: 'Triangle',
                star: 'Star',
                dot: 'Dot',
              },
            },
            react_furry: {
              title: 'Fursona Showcase',
              description: 'React Fursona declaration',
              persona: 'React Fursona',
              all_fursonas: 'All My Fursonas',
              error: 'react-furry-error',
              hover: {
                persona: 'The React Fursona details and copyright declaration',
                all_fursonas: 'Browse the complete collection of my fursonas.',
              },
            },
            minigame: {
              title: 'Minigame',
              description: 'H5 games written in JS. They are written when I just started to study JS.',
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
              hover: {
                sunny_zy_ui: 'Browse Sunny-ZY-UI components and interactive previews.',
                react_furry_error: 'An npm package that captures React development errors and displays them in a furry-themed overlay to help with debugging.',
                furry_ai_state: 'A VS Code extension that connects to an AI coding agent through MCP and uses companion illustrations to show its current phase, status, and active file.',
              },
            },
            furry: {
              intro: "Senior Software Engineering student 🏫 and AI full-stack engineer based in Guangzhou. I post fursuit photos and niche furry fan creations 🐾. DMs and new friends are always welcome 👀 English👌 / 日本語N1️⃣"
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
            album: 'Go to React Fursona Album',
          },
          furry_contact: {
            title: 'Contact Me',
            profile_title: 'Kino Tsuki',
            hint: 'Hover over an icon to see the platform name, then click to visit.',
            visit: 'Visit {{platform}}',
            icon_alt: '{{platform}} icon',
            carousel_alt: 'Furry profile photo {{index}}',
            qr_tabs_label: 'Contact QR codes',
            qr_alt: '{{platform}} QR code',
            platforms: {
              x: 'X',
              personal_website: 'Personal Website',
              pixiv: 'pixiv',
              deviantart: 'DeviantArt',
              strayfawnstudio: 'Stray Fawn Studio',
              qq: 'QQ',
              xiaohongshu: 'Xiaohongshu',
              douyin: 'Douyin',
            },
          },
          sunnyZyUi: {
            ...SunnyZyUiI18n.en,
          },
        }
      },
      zh: {
        translation: {
          experience: ExperienceI18n.zh,
          lang: '语言',
          mainpage: {
            title: 'Sunny_湛月',
            description: '这是一个静态资源网站，用于展示我的各种各样的项目',
            introduction: `我是 **Sunny_Tangetsu**, 目前是**华南理工大学**软件工程专业的**大四**学生。

高中时我爱上了 *C++* 编程竞赛，这也是我选择这个专业的原因。

我正在学习 **PERN ( PostgreSQL, Express.js, React.js, Node.js), Next.js** 为框架的全栈开发，这个页面是我的第一个前端作品。

我正在学习**英语** *(TOEFL 100, C1)* 和**日语** *(JLPT N1)*. 我将来打算学习其他语种，如西班牙语和法语。

空闲时，我会画画或制作实用工具。我很享受完成一个小项目后的成就感。

左边的角色是我的的**furry**兽设. 它是我的第一只兽设, 在我高二时得到。

我的座右铭：**有动力而无压力，紧张而不焦虑, 迅速而不慌乱**。

你可以在下面的"联系我"找到我的联系方式.

`,
            dropdown: '更多',
            about: '关于我',
            seeme: '我的 Github',
            theme: '主题',
            theme_variant: '主题变体',
            back: '返回',
            contact: '联系我',
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
            cursor: {
              title: 'CursorLab',
              reset: '重置',
              enable: '启用鼠标效果',
              click_effect: '点击扩散特效',
              trail_shape: '尾迹形状',
              size: '尾迹大小',
              thickness: '尾迹粗细',
              delay: '尾迹延迟',
              trail_types: {
                circle: '圆环',
                'circle-filled': '实心圆',
                square: '方框',
                'square-filled': '实心方块',
                triangle: '三角形',
                star: '星形',
                dot: '点',
              },
            },
            react_furry: {
              title: '兽设展示',
              description: 'React拟兽兽设说明,与react-furry-error包的使用说明',
              persona: 'React拟兽兽设',
              all_fursonas: '我的全部兽设',
              error: 'react-furry-error',
              hover: {
                persona: '查看 React 拟兽兽设展示页面。',
                all_fursonas: '浏览我的全部兽设作品。',
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
              hover: {
                sunny_zy_ui: '浏览 Sunny-ZY-UI 组件及交互预览。',
                react_furry_error: '这是一个用于捕获 React 开发错误的 npm 包，通过兽设风格的错误浮层展示报错信息，帮助开发者定位问题。',
                furry_ai_state: '这是一个通过 MCP 连接 AI 编程代理的 VS Code 扩展，以兽设插画展示代理的工作阶段、状态消息和当前文件。',
              },
            },
            furry: {
              intro: "软件工程大四学生🏫，AI全干工程师，坐标广州 发一些兽装照片和冷门的furry同人二创🐾 欢迎私信和扩列👀 English👌/日本語N1️⃣"
            },

          },
          react_furry: {
            download: '下载',
            album: '前往兽设设定集',
          },
          furry_contact: {
            title: '联系我',
            profile_title: '湛月',
            hint: '悬停图标查看平台名称，点击后访问对应主页。',
            visit: '前往{{platform}}',
            icon_alt: '{{platform}}图标',
            carousel_alt: '兽设照片 {{index}}',
            qr_tabs_label: '联系方式二维码',
            qr_alt: '{{platform}}二维码',
            platforms: {
              x: 'X',
              personal_website: '个人网站',
              pixiv: 'pixiv',
              deviantart: 'DeviantArt',
              strayfawnstudio: 'Stray Fawn Studio',
              qq: 'QQ',
              xiaohongshu: '小红书',
              douyin: '抖音',
            },
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
          experience: ExperienceI18n.jp,
          lang: '言語',
          mainpage: {
            title: 'Sunny_湛月',
            description: 'これは静的リソースサイトです。ここでは、私の各種プロジェクトを示しています。',
            introduction: `私は**Sunny_Tangetsu**と申します。現在は**华南理工大学**のソフトウェア工学専攻の**4年生**です。

高校時代、私は *C++* プログラミングコンテストに魅せられ、それがこの専攻を選んだ理由でもある。

私は **PERN（PostgreSQL, Express.js, React.js, Node.js）** をフレームワークとするフルスタック開発を学んでおり、このページは私の最初のフロントエンド作品です。

私は現在**英語**（TOEFL 100点、C1レベル）と**日本語**（JLPT 1級）を学んでいます。将来的にはスペイン語やフランス語などの他の言語も学びたいと考えています。

暇なときは、絵を描いたり実用的な道具を作ったりします。小さなプロジェクトを完成させた後の達成感を楽しんでいます。

左側のキャラクターは私の**ファーリー**兽设です。それは私の最初の兽设で、高校2年生の時に手に入れたものです。

私の座右の銘：**やる気があってもプレッシャーなく、緊張していても不安なく、迅速で慌てずに**。

下記の「連絡する」より私の連絡先をご確認ください
`,
            dropdown: 'そのうえ',
            about: '私について',
            seeme: 'Github',
            theme: '色気',
            theme_variant: 'テーマバリエーション',
            back: '戻る',
            contact: '連絡する',
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
            cursor: {
              title: 'CursorLab',
              reset: 'リセット',
              enable: 'カーソル効果を有効化',
              click_effect: 'クリック拡散エフェクト',
              trail_shape: 'トレイル形状',
              size: 'トレイルサイズ',
              thickness: 'トレイル太さ',
              delay: 'トレイル遅延',
              trail_types: {
                circle: '円',
                'circle-filled': '塗りつぶし円',
                square: '四角',
                'square-filled': '塗りつぶし四角',
                triangle: '三角',
                star: '星',
                dot: 'ドット',
              },
            },
            react_furry: {
              title: 'ファーソナ展示',
              description: 'Reactのファー(擬獣)設定説明とreact-furry-error パッケージの使用説明',
              persona: 'Reactのファー(擬獣)設定',
              all_fursonas: '私のすべてのファーソナ',
              error: 'react-furry-error',
              hover: {
                persona: 'React のファーソナ紹介ページを表示します。',
                all_fursonas: '私のファーソナ作品をすべて表示します。',
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
              hover: {
                sunny_zy_ui: 'Sunny-ZY-UI コンポーネントとプレビューを表示します。',
                react_furry_error: 'React 開発中のエラーを捕捉し、ファーソナを使ったエラーオーバーレイで内容を表示してデバッグを支援する npm パッケージです。',
                furry_ai_state: 'MCP 経由で AI コーディングエージェントと連携し、ファーソナのイラストで作業段階、ステータスメッセージ、現在のファイルを表示する VS Code 拡張機能です。',
              },
            },
            furry: {
              intro: "ソフトウェア工学専攻の大学4年生🏫。広州在住のAIフルスタックエンジニアです。着ぐるみ写真やニッチなFurry二次創作を投稿しています🐾。DM・友達追加歓迎👀 English👌／日本語N1️⃣"
            },
          },
          react_furry: {
            download: 'ダウンロード',
            album: 'Reactファーソナ設定集へ',
          },
          furry_contact: {
            title: '連絡先',
            profile_title: 'キノツキ',
            hint: 'アイコンにカーソルを合わせるとサービス名が表示され、クリックすると移動します。',
            visit: '{{platform}}へ移動',
            icon_alt: '{{platform}}のアイコン',
            carousel_alt: 'ファーソナ写真 {{index}}',
            qr_tabs_label: '連絡先QRコード',
            qr_alt: '{{platform}}のQRコード',
            platforms: {
              x: 'X',
              personal_website: '個人サイト',
              pixiv: 'pixiv',
              deviantart: 'DeviantArt',
              strayfawnstudio: 'Stray Fawn Studio',
              qq: 'QQ',
              xiaohongshu: '小紅書',
              douyin: 'Douyin',
            },
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
