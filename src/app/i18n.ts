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
            description: 'This is a static resource website showcasing my various projects.',
            introduction: `I am **Sunny_Tangetsu**, currently a **senior** majoring in **Software Engineering** at **South China University of Technology**.

In high school, I fell in love with *C++* programming competitions, which is also the reason I chose this major.

I am studying full-stack development with **PERN (PostgreSQL, Express.js, React.js, Node.js)** and Next.js. This page is my first frontend project.

I am currently learning **English** *(TOEFL 100, C1)* and **Japanese** *(JLPT N1)*. In the future, I plan to study other languages, such as Spanish and French.

In my free time, I enjoy painting or making practical tools. I find great satisfaction in the sense of achievement after completing a small project.

The character on the left is my **furry** character. It was my first fursona, which I received in my second year of high school.

My motto: **Stay motivated without pressure, tense without anxiety, and act swiftly without panic.**

You can find my contact information in the "Contact Me" section below.
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
              description: 'An introduction to my React fursona.',
              persona: 'React Fursona',
              all_fursonas: 'All My Fursonas',
              error: 'react-furry-error',
              hover: {
                persona: 'View my React fursona.',
                all_fursonas: 'Browse all of my fursona works.',
              },
            },
            minigame: {
              title: 'H5 Minigames',
              description: 'These are minigames I made when I was first learning frontend development. AI coding tools did not exist then, so I typed all the code myself. The mobile support and UI are both pretty bad QAQ',
              bwite: 'Black-White Iteration',
              color: 'My Sense Of Color Is Amazing',
              light: 'Light On The Lights(Two-player Battle)',
              hover: {
                bwite: 'The Brain: Black-White Iteration',
                color: 'My Sense of Color Is Amazing',
                light: 'The Brain: Light Up a New World',
              },
            },
            tools: {
              title: 'Tools',
              description: 'Here are some tools I have made.',
              hover: {
                sunny_zy_ui: 'Browse Sunny-ZY-UI components and interactive previews. It currently contains only one UI component.',
                react_furry_error: 'A project for visualizing React development-time and runtime errors through an error overlay featuring furry illustrations.',
                furry_ai_state: 'A VS Code extension that connects to AI coding agents through MCP and visualizes agent states such as thinking, planning, coding, testing, errors, and completion with furry illustrations, adding some fun for vibe-coding developers.',
                furry_agent_pet: 'The Windows desktop application version of furry-ai-state, reusing furry-mcp capabilities and state animations.',
              },
            },
            furry: {
              intro: "Senior Software Engineering student 🏫 and AI full-stack engineer based in Guangzhou. I post fursuit photos and niche furry fan creations 🐾. DMs and new friends are always welcome 👀 English👌 / 日本語N1️⃣"
            },
          },
          cookie: {
            title: 'Would You Accept My Cookies?',
            content: 'If you decline, I will ask again in your next session. If you accept, I still have no cookies to give you because this is a static website. I just want you to see how cute I am.',
            accept: 'Accept',
            reject: 'Reject',
          },
          react_furry: {
            download: 'Download',
            album: 'Go to the Fursona Reference Album',
          },
          furry_contact: {
            title: 'Contact Me',
            profile_title: 'Tangetsu',
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
          redirects: {
            furry_agent_pet: {
              message: 'Redirecting to the furry-agent-pet GitHub repository. If you are not redirected automatically,',
              link: 'click here',
            },
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
              description: 'React拟兽兽设说明',
              persona: 'React拟兽兽设',
              all_fursonas: '我的全部兽设',
              error: 'react-furry-error',
              hover: {
                persona: '查看 React 拟兽兽设',
                all_fursonas: '浏览我的全部兽设作品',
              },
            },
            minigame: {
              title: 'H5小游戏',
              description: '这里是我初学前端时写的一些小游戏. 当时还没有AI编程, 所有代码都是手敲的. 移动端的适配很糟糕, UI也很糟糕 QAQ',
              bwite: '黑白迭代',
              color: '我色感贼6',
              light: '点灯新世界(双人游戏)',
              hover: {
                bwite: '最强大脑-黑白迭代',
                color: '我色感贼6',
                light: '最强大脑-点灯新世界',
              },
            },
            tools: {
              title: '工具',
              description: '这里是我写的一些工具。',
              hover: {
                sunny_zy_ui: '浏览 Sunny-ZY-UI 组件及交互预览。虽然目前只有1个UI组件.',
                react_furry_error: '这是一个用于可视化 React 开发时和运行时错误的项目, 通过furry插画的错误浮层展示报错信息.',
                furry_ai_state: '这是一个通过 MCP 连接 AI 编程代理的 VS Code 扩展, 以furry插画展示agent的状态(思考,规划,编写代码,测试,错误,完成等), 为Vibe Coding 的开发者提供一些乐趣',
                furry_agent_pet: '这是 furry-ai-state 的 Windows 桌面应用版本, 复用了 furry-mcp 能力和状态动画.',
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
          redirects: {
            furry_agent_pet: {
              message: '正在前往 furry-agent-pet 的 GitHub 仓库. 如果没有自动跳转, 请',
              link: '点击这里',
            },
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
            description: 'これは、私のさまざまなプロジェクトを紹介する静的リソースサイトです。',
            introduction: `私は**Sunny_Tangetsu**です。現在、**華南理工大学**でソフトウェア工学を専攻する**4年生**です。

高校時代に *C++* のプログラミングコンテストに夢中になり、それがこの専攻を選んだ理由でもあります。

私は **PERN（PostgreSQL, Express.js, React.js, Node.js）** とNext.jsを使ったフルスタック開発を学んでいます。このページは私の最初のフロントエンド作品です。

私は現在、**英語**（TOEFL 100、C1）と**日本語**（JLPT N1）を学んでいます。将来はスペイン語やフランス語など、ほかの言語も学ぶ予定です。

暇なときは、絵を描いたり実用的なツールを作ったりしています。小さなプロジェクトを完成させたときの達成感が好きです。

左側のキャラクターは私の**ファーソナ**です。高校2年生のときに迎えた、私にとって最初のファーソナです。

私の座右の銘：**プレッシャーなく意欲を持ち、不安なく緊張感を保ち、慌てず素早く行動する。**

下の「連絡する」から私の連絡先をご確認いただけます。
`,
            dropdown: 'その他',
            about: '私について',
            seeme: 'GitHubを見る',
            theme: 'テーマ',
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
              description: 'Reactファーソナの紹介',
              persona: 'Reactファーソナ',
              all_fursonas: '私のすべてのファーソナ',
              error: 'react-furry-error',
              hover: {
                persona: 'Reactファーソナを表示します。',
                all_fursonas: '私のファーソナ作品をすべて閲覧します。',
              },
            },
            minigame: {
              title: 'H5ミニゲーム',
              description: 'フロントエンドを学び始めた頃に作ったミニゲームです。当時はAIコーディングがなく、すべてのコードを手で入力しました。モバイル対応もUIもかなりひどいです QAQ',
              bwite: '黒白の交替',
              color: '私の色感覚が最高だ',
              light: '電気をつける挑戦(二人のゲーム)',
              hover: {
                bwite: '最強大脳・黒白イテレーション',
                color: '私の色彩感覚は最高',
                light: '最強大脳・新世界を照らせ',
              },
            },
            tools: {
              title: 'ツール',
              description: '私が作ったツールを紹介します。',
              hover: {
                sunny_zy_ui: 'Sunny-ZY-UIのコンポーネントとインタラクティブなプレビューを表示します。現在、UIコンポーネントは1つだけです。',
                react_furry_error: 'Reactの開発時および実行時のエラーを、ファーリーイラスト入りのエラーオーバーレイで可視化するプロジェクトです。',
                furry_ai_state: 'MCPを通じてAIコーディングエージェントと連携し、思考、計画、コーディング、テスト、エラー、完了などの状態をファーリーイラストで可視化するVS Code拡張機能です。Vibe Codingを楽しむ開発者に遊び心を届けます。',
                furry_agent_pet: 'furry-ai-stateのWindowsデスクトップアプリ版で、furry-mcpの機能と状態アニメーションを再利用しています。',
              },
            },
            furry: {
              intro: "ソフトウェア工学専攻の大学4年生🏫。広州在住のAIフルスタックエンジニアです。着ぐるみ写真やニッチなFurry二次創作を投稿しています🐾。DM・友達追加歓迎👀 English👌／日本語N1️⃣"
            },
          },
          react_furry: {
            download: 'ダウンロード',
            album: 'ファーソナ設定集へ',
          },
          furry_contact: {
            title: '連絡先',
            profile_title: '湛月',
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
          redirects: {
            furry_agent_pet: {
              message: 'furry-agent-petのGitHubリポジトリへ移動しています。自動的に移動しない場合は、',
              link: 'こちらをクリックしてください',
            },
          },
          cookie: {
            title: 'Cookieを受け入れますか？',
            content: '拒否すると、次のセッションでもう一度お尋ねします。受け入れても、このサイトは静的サイトなので渡せるCookieはありません。ただ、私がどれほどかわいいか見てほしいだけです。',
            accept: '受け入れる',
            reject: '拒否する',
          }
        }
      }
    }
  });
export default i18n
