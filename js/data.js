// ===== Tool Data (55+ 工具) =====
const TOOLS_DATA = [
  {
    id: 'metaso',
    name: '秘塔AI',
    desc: 'AI搜索引擎，深度思�?结构化回答，适合调研与写�?,
    icon: '🔍',
    category: 'writing',
    tags: ['搜索', '调研', '免费'],
    url: 'https://metaso.cn',
    roles: ['operator', 'student', 'developer'],
    relations: [
      { id: 'jiying-ai', reason: '写作协作' },
      { id: 'kimi', reason: '长文处理对比' }
    ]
  },
  {
    id: 'jiying-ai',
    name: '秘塔写作�?,
    desc: 'AI辅助写作，一键优化公众号文案结构+标题+关键�?,
    icon: '✍️',
    category: 'writing',
    tags: ['公众�?, '文案优化', '免费'],
    url: 'https://xiezuocat.com',
    roles: ['operator', 'student'],
    relations: [
      { id: '135editor', reason: '排版联动' },
      { id: 'metaso', reason: '素材搜集' }
    ]
  },
  {
    id: 'kimi',
    name: 'Kimi Chat',
    desc: '长文本AI助手，可处理20万字上下文，支持链接/文件阅读',
    icon: '📖',
    category: 'writing',
    tags: ['长文�?, '阅读', '免费'],
    url: 'https://kimi.moonshot.cn',
    roles: ['student', 'operator', 'developer'],
    relations: [
      { id: 'jiying-ai', reason: '长文→精简' },
      { id: 'trae', reason: '需求文档→代码' }
    ]
  },
  {
    id: '135editor',
    name: '135编辑�?,
    desc: '公众号排版神器，海量模板+AI一键排�?,
    icon: '📰',
    category: 'writing',
    tags: ['排版', '公众�?, '模板'],
    url: 'https://www.135editor.com',
    roles: ['operator'],
    relations: [
      { id: 'jiying-ai', reason: '文案→排�? }
    ]
  },
  {
    id: 'libtv',
    name: 'LibTV',
    desc: 'Seedance 2.0同款视频生成�?分钟出AI短视�?,
    icon: '🎬',
    category: 'video',
    tags: ['短视�?, 'AI生成', 'Pro'],
    url: 'https://libtv.ai',
    roles: ['operator', 'designer'],
    relations: [
      { id: 'jimeng', reason: '视频素材来源' },
      { id: 'capcut', reason: '后期剪辑' }
    ]
  },
  {
    id: 'jimeng',
    name: '即梦AI',
    desc: '字节旗下AI图像/视频生成，文生图+图生视频',
    icon: '🎨',
    category: 'image',
    tags: ['AI绘画', '视频', '免费'],
    url: 'https://jimeng.jianying.com',
    roles: ['designer', 'operator'],
    relations: [
      { id: 'libtv', reason: '图→视频' },
      { id: 'mj', reason: '风格对比' }
    ]
  },
  {
    id: 'mj',    id: 'mj',
    name: 'Midjourney'
    login: true,,
    desc: '顶级AI图像生成，高质量创意设计首�?,
    icon: '🖼�?,
    category: 'image',
    tags: ['AI绘画', '设计', '付费'],
    url: 'https://midjourney.com',
    roles: ['designer'],
    login: true,
    relations: [
      { id: 'jimeng', reason: '国产替代' },
      { id: 'kling', reason: '视频延伸' }
    ]
  },
  {
    id: 'kling',
    name: '可灵AI',
    desc: '快手旗下AI视频生成，图生视频效果出�?,
    icon: '🎥',
    category: 'video',
    tags: ['AI视频', '图生视频', '免费'],
    url: 'https://klingai.com',
    roles: ['designer', 'operator'],
    relations: [
      { id: 'jimeng', reason: '图像来源' },
      { id: 'libtv', reason: '同类对比' }
    ]
  },
  {
    id: 'capcut',
    name: '剪映专业�?,
    desc: '全能视频剪辑工具，AI功能丰富（字�?配音/调色�?,
    icon: '✂️',
    category: 'video',
    tags: ['剪辑', '字幕', '免费'],
    url: 'https://www.capcut.cn',
    roles: ['operator', 'designer'],
    relations: [
      { id: 'libtv', reason: 'AI素材→剪�? },
      { id: 'kling', reason: 'AI视频精修' }
    ]
  },
  {
    id: 'trae',
    name: 'TRAE',
    desc: 'Vibe Coding编程助手，自然语言生成前端页面',
    icon: '💻',
    category: 'code',
    tags: ['开�?, '效率', '免费'],
    url: 'https://trae.ai',
    roles: ['developer'],
    relations: [
      { id: 'dify', reason: '工作流编�? },
      { id: 'cursor', reason: '同类对比' }
    ]
  },
  {
    id: 'cursor',    id: 'cursor',
    name: 'Cursor'
    login: true,,
    desc: 'AI优先的代码编辑器，深度集成GPT-4/Claude',
    icon: '⌨️',
    category: 'code',
    tags: ['开�?, '编辑�?, '付费'],
    url: 'https://cursor.sh',
    roles: ['developer'],
    relations: [
      { id: 'trae', reason: '国产替代' },
      { id: 'dify', reason: 'API集成' }
    ]
  },
  {
    id: 'dify',    id: 'dify',
    name: 'Dify'
    login: true,,
    desc: '开源LLM应用开发平台，拖拽构建AI工作�?,
    icon: '🔧',
    category: 'agent',
    tags: ['智能�?, '工作�?, '开�?],
    url: 'https://dify.ai',
    roles: ['developer', 'operator'],
    relations: [
      { id: 'fastgpt', reason: '同类对比' },
      { id: 'trae', reason: '前端→后�? }
    ]
  },
  {
    id: 'fastgpt',    id: 'fastgpt',
    name: 'FastGPT'
    login: true,,
    desc: '开源知识库+AI问答平台，支持私有化部署',
    icon: '🧠',
    category: 'agent',
    tags: ['知识�?, '开�?, '私有部署'],
    url: 'https://fastgpt.in',
    roles: ['developer'],
    relations: [
      { id: 'dify', reason: '工作流对�? },
      { id: 'kimi', reason: '知识库填�? }
    ]
  },
  {
    id: 'coze',
    name: 'Coze扣子',
    desc: '字节跳动AI Bot构建平台，可发布到微�?飞书',
    icon: '🤖',
    category: 'agent',
    tags: ['智能�?, '公众�?, '免费'],
    url: 'https://www.coze.cn',
    roles: ['operator', 'developer'],
    relations: [
      { id: 'dify', reason: '平台对比' },
      { id: 'doubao', reason: '字节生�? }
    ]
  },
  {
    id: 'doubao',
    name: '豆包',
    desc: '字节跳动AI助手，支持语�?图像/文档多模态交�?,
    icon: '🗣�?,
    category: 'agent',
    tags: ['AI助手', '多模�?, '免费'],
    url: 'https://www.doubao.com',
    roles: ['all'],
    relations: [
      { id: 'kimi', reason: '同类对比' },
      { id: 'coze', reason: 'Bot生�? }
    ]
  },
  {
    id: 'tongyi',
    name: '通义千问',
    desc: '阿里云AI助手，支持文档理�?代码生成/图像分析',
    icon: '🌐',
    category: 'agent',
    tags: ['AI助手', '阿里', '免费'],
    url: 'https://tongyi.aliyun.com',
    roles: ['all'],
    relations: [
      { id: 'doubao', reason: '国产AI对比' },
      { id: 'kimi', reason: '长文本对�? }
    ]
  },
  {
    id: 'ernie',
    name: '文心一言',
    desc: '百度AI大模型，擅长中文理解与知识问�?,
    icon: '📚',
    category: 'agent',
    tags: ['AI助手', '百度', '免费'],
    url: 'https://yiyan.baidu.com',
    roles: ['all'],
    relations: [
      { id: 'tongyi', reason: '大模型对�? },
      { id: 'metaso', reason: '搜索增强' }
    ]
  },
  {
    id: 'gamma',    id: 'gamma',
    name: 'Gamma'
    login: true,,
    desc: 'AI PPT生成工具，从大纲到精美演示文稿一键生�?,
    icon: '📊',
    category: 'productivity',
    tags: ['PPT', '演示', '效率'],
    url: 'https://gamma.app',
    roles: ['student', 'operator', 'designer'],
    relations: [
      { id: 'jiying-ai', reason: '文案→PPT' },
      { id: 'jimeng', reason: '配图生成' }
    ]
  },
  {
    id: 'notion-ai',    id: 'notion-ai',
    name: 'Notion AI'
    login: true,,
    desc: 'AI增强版笔记与知识管理，自动摘�?写作/翻译',
    icon: '📝',
    category: 'productivity',
    tags: ['笔记', '知识管理', '付费'],
    url: 'https://www.notion.so',
    roles: ['developer', 'student'],
    relations: [
      { id: 'kimi', reason: '长文分析' },
      { id: 'gamma', reason: '笔记→PPT' }
    ]
  },
  {
    id: 'wolai',
    name: '我来 wolai',
    desc: '中文块编辑器+AI辅助，适合团队知识库搭�?,
    icon: '📋',
    category: 'productivity',
    tags: ['笔记', '知识�?, '免费'],
    url: 'https://www.wolai.com',
    roles: ['all'],
    relations: [
      { id: 'notion-ai', reason: '同类对比' }
    ]
  },
  {
    id: 'removebg',
    name: 'Remove.bg',
    desc: 'AI自动抠图，秒级去除背景，支持批量处理',
    icon: '✂️',
    category: 'image',
    tags: ['抠图', '设计', '免费'],
    url: 'https://www.remove.bg',
    roles: ['designer', 'operator'],
    relations: [
      { id: 'jimeng', reason: '图片精修' },
      { id: 'canva', reason: '设计集成' }
    ]
  },
  {
    id: 'canva',
    name: 'Canva',
    desc: '在线设计平台，AI辅助生成海报/封面/社交媒体素材',
    icon: '🎨',
    category: 'image',
    tags: ['设计', '模板', '免费'],
    url: 'https://www.canva.cn',
    roles: ['designer', 'operator'],
    relations: [
      { id: 'removebg', reason: '素材处理' },
      { id: 'gamma', reason: '设计→演�? }
    ]
  },
  {
    id: 'suno',    id: 'suno',
    name: 'Suno AI'
    login: true,,
    desc: 'AI音乐生成，文本描述即可生成完整歌�?,
    icon: '🎵',
    category: 'audio',
    tags: ['音乐', 'AI生成', '付费'],
    url: 'https://suno.ai',
    roles: ['designer', 'operator'],
    relations: [
      { id: 'capcut', reason: '视频配乐' },
      { id: 'libtv', reason: '视频BGM' }
    ]
  },
  {
    id: 'tts',
    name: 'Fish Audio',
    desc: 'AI语音合成，克隆人�?多语言/情感化朗�?,
    icon: '🔊',
    category: 'audio',
    tags: ['语音', '配音', '免费'],
    url: 'https://fish.audio',
    roles: ['operator', 'designer'],
    relations: [
      { id: 'capcut', reason: '视频配音' },
      { id: 'libtv', reason: 'AI视频旁白' }
    ]
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    desc: 'OpenAI旗舰对话模型，多模�?代码/创意全能',
    icon: '💬',
    category: 'agent',
    tags: ['AI助手', '多模�?, '付费'],
    url: 'https://chat.openai.com',
    roles: ['all'],
    relations: [
      { id: 'kimi', reason: '长文处理' },
      { id: 'cursor', reason: '编程协作' }
    ]
  },
  {
    id: 'claude',
    name: 'Claude',
    desc: 'Anthropic出品，长上下�?安全对齐+深度推理',
    icon: '🧠',
    category: 'agent',
    tags: ['AI助手', '长文�?, '付费'],
    url: 'https://claude.ai',
    roles: ['developer', 'student'],
    relations: [
      { id: 'chatgpt', reason: '模型对比' },
      { id: 'trae', reason: '代码生成' }
    ]
  },
  {
    id: 'n8n',    id: 'n8n',
    name: 'n8n'
    login: true,,
    desc: '开源工作流自动化，连接200+服务实现AI流水�?,
    icon: '�?,
    category: 'productivity',
    tags: ['自动�?, '工作�?, '开�?],
    url: 'https://n8n.io',
    roles: ['developer', 'operator'],
    relations: [
      { id: 'dify', reason: 'AI工作�? },
      { id: 'coze', reason: 'Bot集成' }
    ]
  },
  {
    id: 'zapier',    id: 'zapier',
    name: 'Zapier'
    login: true,,
    desc: '自动化连接器，无需编码串联Web应用',
    icon: '🔗',
    category: 'productivity',
    tags: ['自动�?, '集成', '付费'],
    url: 'https://zapier.com',
    roles: ['operator', 'developer'],
    relations: [
      { id: 'n8n', reason: '开源替�? },
      { id: 'coze', reason: '公众号自动化' }
    ]
  },
  {
    id: 'quantum',
    name: '量子�?,
    desc: 'AI行业资讯与深度分析，掌握前沿动�?,
    icon: '📡',
    category: 'writing',
    tags: ['资讯', 'AI', '免费'],
    url: 'https://www.qbitai.com',
    roles: ['all'],
    relations: [
      { id: 'metaso', reason: '资讯搜索' }
    ]
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    desc: 'AI模型社区与托管平台，开源模�?数据�?Spaces',
    icon: '🤗',
    category: 'code',
    tags: ['开�?, '模型', '社区'],
    url: 'https://huggingface.co',
    roles: ['developer'],
    relations: [
      { id: 'dify', reason: '模型部署' },
      { id: 'fastgpt', reason: '模型微调' }
    ]
  },
  {
    id: 'github-copilot',    id: 'github-copilot',
    name: 'GitHub Copilot'
    login: true,,
    desc: 'AI代码补全工具，集成VS Code/JetBrains',
    icon: '🤖',
    category: 'code',
    tags: ['开�?, '补全', '付费'],
    url: 'https://github.com/features/copilot',
    roles: ['developer'],
    relations: [
      { id: 'cursor', reason: 'AI编辑�? },
      { id: 'trae', reason: '国产替代' }
    ]
  },
  {
    id: 'grammarly',    id: 'grammarly',
    name: 'Grammarly'
    login: true,,
    desc: '英文写作助手，语法纠�?风格优化+AI生成',
    icon: '✍️',
    category: 'writing',
    tags: ['英文', '语法', '付费'],
    url: 'https://grammarly.com',
    roles: ['student', 'operator'],
    relations: [
      { id: 'jiying-ai', reason: '中英文写作对�? },
      { id: 'deepl', reason: '翻译联动' }
    ]
  },
  {
    id: 'deepl',
    name: 'DeepL',
    desc: 'AI翻译工具，译文自然度超过谷歌翻译',
    icon: '🌍',
    category: 'writing',
    tags: ['翻译', '英文', '免费'],
    url: 'https://deepl.com',
    roles: ['all'],
    relations: [
      { id: 'grammarly', reason: '翻译→润�? },
      { id: 'kimi', reason: '长文翻译' }
    ]
  },
  {
    id: 'runway',    id: 'runway',
    name: 'Runway'
    login: true,,
    desc: 'AI视频生成与编辑，支持文生视频/图生视频/修图',
    icon: '🎥',
    category: 'video',
    tags: ['AI视频', '编辑', '付费'],
    url: 'https://runwayml.com',
    roles: ['designer', 'operator'],
    relations: [
      { id: 'kling', reason: '国产替代' },
      { id: 'libtv', reason: '同类对比' }
    ]
  },
  {
    id: 'pika',
    name: 'Pika',
    desc: '轻量AI视频生成，快速出片适合社交媒体',
    icon: '🎬',
    category: 'video',
    tags: ['AI视频', '社交', '免费'],
    url: 'https://pika.art',
    roles: ['designer', 'operator'],
    relations: [
      { id: 'runway', reason: '轻量�? },
      { id: 'jimeng', reason: '国产平替' }
    ]
  },
  {
    id: 'heygen',    id: 'heygen',
    name: 'HeyGen'
    login: true,,
    desc: 'AI数字人视频生成，上传照片即可生成口播视频',
    icon: '👤',
    category: 'video',
    tags: ['数字�?, '口播', '付费'],
    url: 'https://heygen.com',
    roles: ['operator'],
    relations: [
      { id: 'capcut', reason: '后期剪辑' },
      { id: 'tts', reason: '语音配音' }
    ]
  },
  {
    id: 'leonardo',    id: 'leonardo',
    name: 'Leonardo AI'
    login: true,,
    desc: 'AI图像生成平台，模型丰�?实时生成',
    icon: '🎨',
    category: 'image',
    tags: ['AI绘画', '模型', '免费'],
    url: 'https://leonardo.ai',
    roles: ['designer'],
    relations: [
      { id: 'mj', reason: '免费替代' },
      { id: 'jimeng', reason: '同类对比' }
    ]
  },
  {
    id: 'stability',    id: 'stability',
    name: 'Stable Diffusion'
    login: true,,
    desc: '开源AI图像生成，本地部�?高度可控',
    icon: '🖼�?,
    category: 'image',
    tags: ['AI绘画', '开�?, '免费'],
    url: 'https://stability.ai',
    roles: ['designer', 'developer'],
    relations: [
      { id: 'leonardo', reason: '云端�? },
      { id: 'huggingface', reason: '模型下载' }
    ]
  },
  {
    id: 'adobe-firefly',    id: 'adobe-firefly',
    name: 'Adobe Firefly'
    login: true,,
    desc: 'Adobe官方AI生成，集成PS/AE生�?,
    icon: '�?,
    category: 'image',
    tags: ['AI绘画', '设计', '付费'],
    url: 'https://firefly.adobe.com',
    roles: ['designer'],
    relations: [
      { id: 'canva', reason: '设计对比' },
      { id: 'mj', reason: '风格对比' }
    ]
  },
  {
    id: 'replit',    id: 'replit',
    name: 'Replit'
    login: true,,
    desc: '在线IDE+AI编程，浏览器写代�?一键部�?,
    icon: '🖥�?,
    category: 'code',
    tags: ['开�?, 'IDE', '免费'],
    url: 'https://replit.com',
    roles: ['developer', 'student'],
    relations: [
      { id: 'trae', reason: 'AI编程对比' },
      { id: 'cursor', reason: '编辑器对�? }
    ]
  },
  {
    id: 'codeium',
    name: 'Codeium',
    desc: '免费的AI代码补全，支�?0+语言/40+编辑�?,
    icon: '�?,
    category: 'code',
    tags: ['开�?, '补全', '免费'],
    url: 'https://codeium.com',
    roles: ['developer'],
    relations: [
      { id: 'github-copilot', reason: '免费替代' },
      { id: 'tabnine', reason: '同类对比' }
    ]
  },
  {
    id: 'tabnine',    id: 'tabnine',
    name: 'Tabnine'
    login: true,,
    desc: 'AI代码补全，本地模型保护代码隐�?,
    icon: '🔒',
    category: 'code',
    tags: ['开�?, '补全', '隐私'],
    url: 'https://tabnine.com',
    roles: ['developer'],
    relations: [
      { id: 'codeium', reason: '免费版对�? },
      { id: 'github-copilot', reason: '功能对比' }
    ]
  },
  {
    id: 'v0',
    name: 'v0.dev',
    desc: 'Vercel出品，自然语言生成前端UI组件',
    icon: '🧩',
    category: 'code',
    tags: ['开�?, '前端', '免费'],
    url: 'https://v0.dev',
    roles: ['developer', 'designer'],
    relations: [
      { id: 'trae', reason: '前端代码' },
      { id: 'cursor', reason: '编程协作' }
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    desc: 'AI搜索引擎，带来源的深度问�?,
    icon: '🔎',
    category: 'agent',
    tags: ['搜索', 'AI助手', '免费'],
    url: 'https://perplexity.ai',
    roles: ['all'],
    relations: [
      { id: 'metaso', reason: '国产替代' },
      { id: 'chatgpt', reason: '搜索对比' }
    ]
  },
  {
    id: 'poe',
    name: 'Poe',
    desc: '集成多个AI模型的聊天平台，GPT/Claude/Gemini随意切换',
    icon: '💬',
    category: 'agent',
    tags: ['AI助手', '多模�?, '免费'],
    url: 'https://poe.com',
    roles: ['all'],
    relations: [
      { id: 'chatgpt', reason: '模型对比' },
      { id: 'claude', reason: '模型切换' }
    ]
  },
  {
    id: 'zhipu',
    name: '智谱清言',
    desc: '清华系AI助手，GLM模型中文能力�?,
    icon: '🧪',
    category: 'agent',
    tags: ['AI助手', '国产', '免费'],
    url: 'https://chatglm.cn',
    roles: ['all'],
    relations: [
      { id: 'doubao', reason: '国产AI对比' },
      { id: 'tongyi', reason: '大模型对�? }
    ]
  },
  {
    id: 'spark',
    name: '讯飞星火',
    desc: '科大讯飞AI助手，语音交�?文档处理能力�?,
    icon: '🔥',
    category: 'agent',
    tags: ['AI助手', '语音', '免费'],
    url: 'https://xinghuo.xfyun.cn',
    roles: ['all'],
    relations: [
      { id: 'zhipu', reason: '国产AI对比' },
      { id: 'tts', reason: '语音联动' }
    ]
  },
  {
    id: 'elevenlabs',    id: 'elevenlabs',
    name: 'ElevenLabs'
    login: true,,
    desc: '顶级AI语音合成，情感丰�?声音克隆',
    icon: '🎙�?,
    category: 'audio',
    tags: ['语音', '克隆', '付费'],
    url: 'https://elevenlabs.io',
    roles: ['operator', 'designer'],
    relations: [
      { id: 'tts', reason: '免费替代' },
      { id: 'heygen', reason: '数字人口�? }
    ]
  },
  {
    id: 'riffusion',
    name: 'Riffusion',
    desc: 'AI音乐生成，文本描述生成器乐片�?,
    icon: '🎸',
    category: 'audio',
    tags: ['音乐', '生成', '免费'],
    url: 'https://riffusion.com',
    roles: ['designer'],
    relations: [
      { id: 'suno', reason: '同类对比' },
      { id: 'capcut', reason: '配乐素材' }
    ]
  },
  {
    id: 'otter',    id: 'otter',
    name: 'Otter.ai'
    login: true,,
    desc: 'AI会议记录，实时转�?自动摘要+行动项提�?,
    icon: '📞',
    category: 'productivity',
    tags: ['会议', '转录', '免费'],
    url: 'https://otter.ai',
    roles: ['operator', 'developer'],
    relations: [
      { id: 'notion-ai', reason: '笔记同步' },
      { id: 'kimi', reason: '长文总结' }
    ]
  },
  {
    id: 'mem',    id: 'mem',
    name: 'Mem'
    login: true,,
    desc: 'AI笔记，自动标�?关联推荐+知识图谱',
    icon: '🧠',
    category: 'productivity',
    tags: ['笔记', 'AI', '知识管理'],
    url: 'https://mem.ai',
    roles: ['student', 'developer'],
    relations: [
      { id: 'notion-ai', reason: '对比' },
      { id: 'wolai', reason: '国产替代' }
    ]
  },
  {
    id: 'motion',    id: 'motion',
    name: 'Motion'
    login: true,,
    desc: 'AI日程管理，自动排优先�?防冲�?,
    icon: '📅',
    category: 'productivity',
    tags: ['日程', '效率', '付费'],
    url: 'https://motion.app',
    roles: ['all'],
    relations: [
      { id: 'reclaim', reason: '同类对比' }
    ]
  },
  {
    id: 'reclaim',
    name: 'Reclaim.ai',
    desc: 'AI日历助手，自动安排任�?习惯+会议',
    icon: '�?,
    category: 'productivity',
    tags: ['日历', '效率', '免费'],
    url: 'https://reclaim.ai',
    roles: ['all'],
    relations: [
      { id: 'motion', reason: '免费替代' }
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    desc: '国产顶级AI大模型，推理能力�?超长上下文，性价比极�?,
    icon: '🔮',
    category: 'agent',
    tags: ['AI助手', '国产', '免费', '推理'],
    url: 'https://chat.deepseek.com',
    roles: ['all'],
    relations: [
      { id: 'kimi', reason: '国产AI对比' },
      { id: 'chatgpt', reason: '推理对比' }
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    desc: 'Google多模态AI，原生图像理�?超长上下�?00万token',
    icon: '�?,
    category: 'agent',
    tags: ['AI助手', '多模�?, '免费'],
    url: 'https://gemini.google.com',
    roles: ['all'],
    relations: [
      { id: 'chatgpt', reason: '模型对比' },
      { id: 'deepseek', reason: '推理对比' }
    ]
  },
  {
    id: 'grok',
    name: 'Grok',
    desc: 'xAI出品，实时联�?幽默风格+深度推理',
    icon: '🤖',
    category: 'agent',
    tags: ['AI助手', '实时', '付费'],
    url: 'https://grok.com',
    roles: ['all'],
    relations: [
      { id: 'perplexity', reason: '实时信息' },
      { id: 'chatgpt', reason: '模型对比' }
    ]
  },
  {
    id: 'manus',    id: 'manus',
    name: 'Manus'
    login: true,,
    desc: 'AI智能体平台，自动完成复杂任务（调�?分析/报告生成�?,
    icon: '🦾',
    category: 'agent',
    tags: ['智能�?, '自动�?, '国产'],
    url: 'https://manus.im',
    roles: ['developer', 'operator', 'student'],
    relations: [
      { id: 'dify', reason: '工作流对�? },
      { id: 'deepseek', reason: '推理引擎' }
    ]
  },
  {
    id: 'windsurf',    id: 'windsurf',
    name: 'Windsurf'
    login: true,,
    desc: 'AI原生IDE，智能代码补�?多文件编�?Agent模式',
    icon: '🏄',
    category: 'code',
    tags: ['开�?, '编辑�?, 'AI'],
    url: 'https://codeium.com/windsurf',
    roles: ['developer'],
    relations: [
      { id: 'cursor', reason: '编辑器对�? },
      { id: 'trae', reason: '国产替代' }
    ]
  },
  {
    id: 'bolt',
    name: 'Bolt.new',
    desc: 'AI全栈Web应用生成，对话即可构建可部署应用',
    icon: '�?,
    category: 'code',
    tags: ['开�?, '全栈', 'AI生成'],
    url: 'https://bolt.new',
    roles: ['developer', 'designer'],
    relations: [
      { id: 'v0', reason: '前端对比' },
      { id: 'trae', reason: '国产替代' }
    ]
  },
  {
    id: 'cline',    id: 'cline',
    name: 'Cline'
    login: true,,
    desc: 'VS Code AI编程助手，自主编�?终端操作+文件管理',
    icon: '🧩',
    category: 'code',
    tags: ['开�?, '编辑�?, '开�?],
    url: 'https://cline.bot',
    roles: ['developer'],
    relations: [
      { id: 'windsurf', reason: 'Agent模式对比' },
      { id: 'cursor', reason: '功能对比' }
    ]
  },
  {
    id: 'napkin',
    name: 'Napkin AI',
    desc: '文字一键转图表/流程�?信息图，适合PPT和公众号配图',
    icon: '📊',
    category: 'productivity',
    tags: ['图表', '可视�?, '效率'],
    url: 'https://napkin.ai',
    roles: ['all'],
    relations: [
      { id: 'gamma', reason: '演示联动' },
      { id: 'canva', reason: '设计搭配' }
    ]
  },
  {
    id: 'monica',
    name: 'Monica AI',
    desc: '浏览器AI助手，集成搜�?写作+翻译+ChatGPT',
    icon: '🔍',
    category: 'productivity',
    tags: ['AI助手', '浏览�?, '免费'],
    url: 'https://monica.im',
    roles: ['all'],
    relations: [
      { id: 'perplexity', reason: '搜索对比' },
      { id: 'deepl', reason: '翻译联动' }
    ]
  },
  {
    id: 'douyin-ai',
    name: '抖音即创',
    desc: '字节旗下AI视频创作工具，脚本文�?数字�?剪辑一�?,
    icon: '🎵',
    category: 'video',
    tags: ['短视�?, '数字�?, '免费', '国产'],
    url: 'https://jichuang.bytedance.com',
    roles: ['operator', 'designer'],
    relations: [
      { id: 'capcut', reason: '剪辑联动' },
      { id: 'coze', reason: '字节生�? }
    ]
  },
  {
    id: 'minimax',
    name: 'MiniMax海螺AI',
    desc: '国产AI语音+视频生成，角色扮演+语音对话',
    icon: '🐚',
    category: 'agent',
    tags: ['AI助手', '语音', '国产'],
    url: 'https://hailuoai.com',
    roles: ['all'],
    relations: [
      { id: 'doubao', reason: '国产AI对比' },
      { id: 'suno', reason: '音频生成' }
    ]
  },
  {
    id: 'descript',
    name: 'Descript',
    desc: 'AI视频/音频编辑器，像编辑文档一样剪辑视频，自动转录+去口癖',
    icon: '🎙️',
    category: 'video',
    tags: ['剪辑', '转录', '播客', '付费'],
    url: 'https://descript.com',
    roles: ['operator', 'designer'],
    login: true,
    relations: [
      { id: 'capcut', reason: '剪辑对比' },
      { id: 'otter', reason: '转录联动' }
    ]
  },
  {
    id: 'elicit',
    name: 'Elicit',
    desc: 'AI学术研究助手，自动搜索论文+提取关键数据+生成综述',
    icon: '📚',
    category: 'productivity',
    tags: ['学术', '研究', '论文', '付费'],
    url: 'https://elicit.com',
    roles: ['student', 'developer'],
    login: true,
    relations: [
      { id: 'kimi', reason: '论文阅读' },
      { id: 'perplexity', reason: '研究搜索' }
    ]
  },
  {
    id: 'make',
    name: 'Make',
    desc: '高级自动化平台，可视化搭建复杂业务工作流，替代Zapier',
    icon: '🔗',
    category: 'productivity',
    tags: ['自动化', '工作流', '集成', '付费'],
    url: 'https://make.com',
    roles: ['developer', 'operator'],
    login: true,
    relations: [
      { id: 'n8n', reason: '开源替代' },
      { id: 'zapier', reason: '直接竞品' }
    ]
  },
  {
    id: 'aiva',
    name: 'AIVA',
    desc: 'AI作曲助手，古典/电子/影视配乐专业级生成',
    icon: '🎼',
    category: 'audio',
    tags: ['音乐', '作曲', '配乐', '付费'],
    url: 'https://aiva.ai',
    roles: ['designer'],
    login: true,
    relations: [
      { id: 'suno', reason: 'AI音乐对比' },
      { id: 'capcut', reason: '配乐素材' }
    ]
  },
  {
    id: 'luma',
    name: 'Luma AI',
    desc: 'AI 3D生成，文字/图片生成3D模型，适合游戏和电商',
    icon: '🎲',
    category: 'image',
    tags: ['3D', '建模', 'AI生成', '付费'],
    url: 'https://lumalabs.ai',
    roles: ['designer', 'developer'],
    login: true,
    relations: [
      { id: 'mj', reason: '3D延伸' },
      { id: 'stability', reason: '生成对比' }
    ]
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    desc: 'Anthropic官方AI编程工具，终端内自主完成编码任务',
    icon: '🖥️',
    category: 'code',
    tags: ['开发', '编程', 'AI', '付费'],
    url: 'https://claude.ai/code',
    roles: ['developer'],
    login: true,
    relations: [
      { id: 'cursor', reason: '编程对比' },
      { id: 'cline', reason: 'Agent对比' }
    ]
  },
  {
    id: 'jasper',
    name: 'Jasper',
    desc: '企业级AI内容营销平台，批量生成博客/广告/社交媒体文案',
    icon: '📢',
    category: 'writing',
    tags: ['营销', '文案', '企业', '付费'],
    url: 'https://jasper.ai',
    roles: ['operator'],
    login: true,
    relations: [
      { id: 'jiying-ai', reason: '文案生成' },
      { id: 'grammarly', reason: '润色联动' }
    ]
  },
  {
    id: 'udio',
    name: 'Udio',
    desc: 'AI音乐生成，文本/哼唱生成完整歌曲，音质出色',
    icon: '🎶',
    category: 'audio',
    tags: ['音乐', '生成', '歌曲'],
    url: 'https://udio.com',
    roles: ['designer', 'operator'],
    relations: [
      { id: 'suno', reason: '音乐对比' },
      { id: 'aiva', reason: '作曲对比' }
    ]
  },
  {
    id: 'mubert',
    name: 'Mubert',
    desc: 'AI实时生成背景音乐，适合视频/直播/播客无版权配乐',
    icon: '🎧',
    category: 'audio',
    tags: ['音乐', '配乐', '无版权', '免费'],
    url: 'https://mubert.com',
    roles: ['all'],
    relations: [
      { id: 'capcut', reason: '视频配乐' },
      { id: 'udio', reason: '音乐生成对比' }
    ]
  },
  {
    id: 'soundraw',
    name: 'Soundraw',
    desc: 'AI音乐创作平台，自定义风格/情绪/时长生成独特配乐',
    icon: '🎹',
    category: 'audio',
    tags: ['音乐', '配乐', '创作', '付费'],
    url: 'https://soundraw.io',
    roles: ['designer', 'operator'],
    login: true,
    relations: [
      { id: 'mubert', reason: '配乐对比' },
      { id: 'suno', reason: '生成对比' }
    ]
  }
];

// ===== Scene Config =====
const SCENES = [
  { id: 'wechat-article', label: '📰 公众号推�?, tools: ['jiying-ai', '135editor', 'metaso', 'kimi', 'quantum', 'deepl', 'deepseek'] },
  { id: 'ai-video', label: '🎬 AI短视�?, tools: ['libtv', 'jimeng', 'kling', 'capcut', 'runway', 'pika', 'heygen', 'suno', 'tts', 'douyin-ai'] },
  { id: 'auto-workflow', label: '🔄 自动化工作流', tools: ['n8n', 'zapier', 'dify', 'coze', 'fastgpt', 'manus'] },
  { id: 'ai-coding', label: '💻 AI编程', tools: ['trae', 'cursor', 'github-copilot', 'codeium', 'tabnine', 'v0', 'replit', 'huggingface', 'dify', 'windsurf', 'bolt', 'cline'] },
  { id: 'design-creative', label: '🎨 创意设计', tools: ['mj', 'jimeng', 'leonardo', 'stability', 'adobe-firefly', 'canva', 'removebg', 'gamma', 'napkin'] },
  { id: 'research-study', label: '📚 学习研究', tools: ['kimi', 'metaso', 'perplexity', 'doubao', 'tongyi', 'zhipu', 'spark', 'notion-ai', 'deepseek', 'gemini', 'grok'] },
  { id: 'podcast-audio', label: '🎵 音频创作', tools: ['suno', 'elevenlabs', 'riffusion', 'tts', 'capcut', 'minimax', 'udio', 'mubert', 'soundraw', 'aiva'] },
  { id: 'wechat-bot', label: '🤖 公众号Bot', tools: ['coze', 'dify', 'fastgpt', 'n8n', 'zapier', 'manus'] },
  { id: 'english-writing', label: '🌍 英文写作', tools: ['grammarly', 'deepl', 'chatgpt', 'claude', 'perplexity', 'gemini'] },
  { id: 'meeting-notes', label: '📝 会议纪要', tools: ['otter', 'notion-ai', 'kimi', 'mem', 'reclaim', 'monica'] }
];

// ===== Tag Relations (搜索联想) =====
const TAG_RELATIONS = {
  '公众�?: ['文案', '排版', '选题', '涨粉', '运营', '封面'],
  '视频': ['剪辑', '字幕', '封面', '脚本', '配乐', '数字�?],
  '免费': ['学生', '入门', '试用', '开�?, '新手'],
  '开�?: ['编程', '代码', 'API', '部署', 'Git', '前端'],
  '设计': ['海报', '配图', '抠图', '封面', '排版', '绘画'],
  'AI助手': ['对话', '写作', '翻译', '总结', '问答', '搜索'],
  '英文': ['翻译', '写作', '语法', '润色', '校对'],
  '开�?: ['免费', '自部�?, '社区', 'GitHub', '模型'],
  '语音': ['配音', '克隆', '朗读', '播客', '字幕'],
  '效率': ['自动�?, '日程', '笔记', '会议', '工作�?],
  '国产': ['免费', 'AI助手', '大模�?, '中文', 'DeepSeek'],
  '推理': ['逻辑', '数学', '代码', '深度思�?, '分析'],
  '多模�?: ['图像', '视频', '语音', '文档', '识别']
};
