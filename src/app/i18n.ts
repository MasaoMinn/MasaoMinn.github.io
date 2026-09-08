// i18n.ts
"use client";
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { SunnyZyUiI18n } from './tools/sunny-zy-ui/i18n';

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
            description: 'Curated entrances for my projects. Choose a lane and jump in.',
            introduction: `# Sunny_湛月

Passionate about technology and creation, with a focus on frontend, UI design, and AI applications.

Currently learning English and Japanese continuously, hoping to connect with broader cultures through language.

I enjoy exploring new technologies and also turning ideas into real products.
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
              cursor_shape: 'Mouse shape',
              trail_shape: 'Trail shape',
              trail_type: 'Trail shape',
              pointer_style: 'Pointer style',
              size: 'Trail size',
              thickness: 'Trail thickness',
              delay: 'Trail delay',
              cursor_shapes: {
                circle: 'Circle',
                'circle-filled': 'Circle Filled',
                square: 'Square',
                'square-filled': 'Square Filled',
                triangle: 'Triangle',
                star: 'Star',
                dot: 'Dot',
              },
              trail_types: {
                circle: 'Circle',
                'circle-filled': 'Circle Filled',
                square: 'Square',
                'square-filled': 'Square Filled',
                triangle: 'Triangle',
                star: 'Star',
                dot: 'Dot',
              },
              pointer_styles: {
                default: 'Default',
                crosshair: 'Crosshair',
                grab: 'Grab',
                copy: 'Copy',
                none: 'Hidden',
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
              tobe: 'Stay Tuned',
              furry: 'Contact Me',
              hover: {
                sunny_zy_ui: 'Browse Sunny-ZY-UI components and interactive previews.',
                furry: 'Open furry contact and related tools page.',
                tobe: 'Placeholder entry for upcoming tools.',
              },
            },
            furry: {
              intro: "Senior Software Engineering student 🏫 and AI full-stack engineer based in Guangzhou. I post fursuit photos and niche furry fan creations 🐾. DMs and new friends are always welcome 👀 English👌 / 日本語N1️⃣"
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
            get: 'get persona',
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
          lang: '语言',
          mainpage: {
            title: 'Sunny_湛月 - 静态资源网站',
            description: '这是一个静态资源网站，用于展示我的各种各样的项目',
            introduction: `# Sunny_湛月

热爱技术与创作的开发者, 关注前端、UI 设计与 AI 应用

在持续学习英语与日语，希望能够通过语言接触更广阔的世界与文化

喜欢有趣的新技术，也喜欢把灵感真正做出来

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
              cursor_shape: '鼠标形状',
              trail_shape: '尾迹形状',
              trail_type: '尾迹形状',
              pointer_style: '鼠标样式',
              size: '尾迹大小',
              thickness: '尾迹粗细',
              delay: '尾迹延迟',
              cursor_shapes: {
                circle: '圆环',
                'circle-filled': '实心圆',
                square: '方框',
                'square-filled': '实心方块',
                triangle: '三角形',
                star: '星形',
                dot: '点',
              },
              trail_types: {
                circle: '圆环',
                'circle-filled': '实心圆',
                square: '方框',
                'square-filled': '实心方块',
                triangle: '三角形',
                star: '星形',
                dot: '点',
              },
              pointer_styles: {
                default: '默认',
                crosshair: '十字准星',
                grab: '抓取',
                copy: '复制',
                none: '隐藏',
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
              intro: "软件工程大四学生🏫，AI全干工程师，坐标广州 发一些兽装照片和冷门的furry同人二创🐾 欢迎私信和扩列👀 English👌/日本語N1️⃣"
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
          lang: '言語',
          mainpage: {
            title: 'Sunny_湛月 - 静的リソースサイト',
            description: 'これは静的リソースサイトです。ここでは、私の各種プロジェクトを示しています。',
            introduction: `# Sunny_湛月

技術と創作が好きな開発者で、フロントエンド、UI デザイン、AI 応用に関心があります。

英語と日本語を継続的に学び、言語を通じてより広い世界や文化に触れたいと考えています。

新しい技術を試すことが好きで、アイデアを実際の形にすることも大切にしています。
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
              cursor_shape: 'カーソル形状',
              trail_shape: 'トレイル形状',
              trail_type: 'トレイル形状',
              pointer_style: 'カーソルスタイル',
              size: 'トレイルサイズ',
              thickness: 'トレイル太さ',
              delay: 'トレイル遅延',
              cursor_shapes: {
                circle: '円',
                'circle-filled': '塗りつぶし円',
                square: '四角',
                'square-filled': '塗りつぶし四角',
                triangle: '三角',
                star: '星',
                dot: 'ドット',
              },
              trail_types: {
                circle: '円',
                'circle-filled': '塗りつぶし円',
                square: '四角',
                'square-filled': '塗りつぶし四角',
                triangle: '三角',
                star: '星',
                dot: 'ドット',
              },
              pointer_styles: {
                default: 'デフォルト',
                crosshair: 'クロスヘア',
                grab: 'グラブ',
                copy: 'コピー',
                none: '非表示',
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
              intro: "ソフトウェア工学専攻の大学4年生🏫。広州在住のAIフルスタックエンジニアです。着ぐるみ写真やニッチなFurry二次創作を投稿しています🐾。DM・友達追加歓迎👀 English👌／日本語N1️⃣"
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
