// ===== Tool Data (55+ 工具) =====
const TOOLS_DATA = [
  {
    id: 'metaso',
    name: '秘塔AI',
    desc: 'AI搜索引擎，深度思考+结构化回答，适合调研与写作',
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
    name: '秘塔写作猫',
    desc: 'AI辅助写作，一键优化公众号文案结构+标题+关键词',
    icon: '✍️',
    category: 'writing',
    tags: ['公众号', '文案优化', '免费'],
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
    tags: ['长文本', '阅读', '免费'],
    url: 'https://kimi.moonshot.cn',
    roles: ['student', 'operator', 'developer'],
    relations: [
      { id: 'jiying-ai', reason: '长文→精简' },
      { id: 'trae', reason: '需求文档→代码' }
    ]
  },
  {
    id: '135editor',
    name: '135编辑器',
    desc: '公众号排版神器，海量模板+AI一键排版',
    icon: '📰',
    category: 'writing',
    tags: ['排版', '公众号', '模板'],
    url: 'https://www.135editor.com',
    roles: ['operator'],
    relations: [
      { id: 'jiying-ai', reason: '文案→排版' }
    ]
  },
  {
    id: 'libtv',
    name: 'LibTV',
    desc: 'Seedance 2.0同款视频生成，3分钟出AI短视频',
    icon: '🎬',
    category: 'video',
    tags: ['短视频', 'AI生成', 'Pro'],
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
    id: 'mj',
    name: 'Midjourney',
    desc: '顶级AI图像生成，高质量创意设计首选',
    icon: '🖼️',
    category: 'image',
    tags: ['AI绘画', '设计', '付费'],
    url: 'https://midjourney.com',
    login: true,
    roles: ['designer'],
    relations: [
      { id: 'jimeng', reason: '国产替代' },
      { id: 'kling', reason: '视频延伸' }
    ]
  },
  {
    id: 'kling',
    name: '可灵AI',
    desc: '快手旗下AI视频生成，图生视频效果出色',
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
    name: '剪映专业版',
    desc: '全能视频剪辑工具，AI功能丰富（字幕/配音/调色）',
    icon: '✂️',
    category: 'video',
    tags: ['剪辑', '字幕', '免费'],
    url: 'https://www.capcut.cn',
    roles: ['operator', 'designer'],
    relations: [
      { id: 'libtv', reason: 'AI素材→剪辑' },
      { id: 'kling', reason: 'AI视频精修' }
    ]
  },
  {
    id: 'trae',
    name: 'TRAE',
    desc: 'Vibe Coding编程助手，自然语言生成前端页面',
    icon: '💻',
    category: 'code',
    tags: ['开发', '效率', '免费'],
    url: 'https://trae.ai',
    roles: ['developer'],
    relations: [
      { id: 'dify', reason: '工作流编排' },
      { id: 'cursor', reason: '同类对比' }
    ]
  },
  {
    id: 'cursor',
    name: 'Cursor',
    desc: 'AI优先的代码编辑器，深度集成GPT-4/Claude',
    icon: '⌨️',
    category: 'code',
    tags: ['开发', '编辑器', '付费'],
    url: 'https://cursor.sh',
    login: true,
    roles: ['developer'],
    relations: [
      { id: 'trae', reason: '国产替代' },
      { id: 'dify', reason: 'API集成' }
    ]
  },
  {
    id: 'dify',
    name: 'Dify',
    desc: '开源LLM应用开发平台，拖拽构建AI工作流',
    icon: '🔧',
    category: 'agent',
    tags: ['智能体', '工作流', '开源'],
    url: 'https://dify.ai',
    login: true,
    roles: ['developer', 'operator'],
    relations: [
      { id: 'fastgpt', reason: '同类对比' },
      { id: 'trae', reason: '前端→后端' }
    ]
  },
  {
    id: 'fastgpt',
    name: 'FastGPT',
    desc: '开源知识库+AI问答平台，支持私有化部署',
    icon: '🧠',
    category: 'agent',
    tags: ['知识库', '开源', '私有部署'],
    url: 'https://fastgpt.in',
    login: true,
    roles: ['developer'],
    relations: [
      { id: 'dify', reason: '工作流对比' },
      { id: 'kimi', reason: '知识库填充' }
    ]
  },
  {
    id: 'coze',
    name: 'Coze扣子',
    desc: '字节跳动AI Bot构建平台，可发布到微信/飞书',
    icon: '🤖',
    category: 'agent',
    tags: ['智能体', '公众号', '免费'],
    url: 'https://www.coze.cn',
    roles: ['operator', 'developer'],
    relations: [
      { id: 'dify', reason: '平台对比' },
      { id: 'doubao', reason: '字节生态' }
    ]
  },
  {
    id: 'doubao',
    name: '豆包',
    desc: '字节跳动AI助手，支持语音/图像/文档多模态交互',
    icon: '🗣️',
    category: 'agent',
    tags: ['AI助手', '多模态', '免费'],
    url: 'https://www.doubao.com',
    roles: ['all'],
    relations: [
      { id: 'kimi', reason: '同类对比' },
      { id: 'coze', reason: 'Bot生态' }
    ]
  },
  {
    id: 'tongyi',
    name: '通义千问',
    desc: '阿里云AI助手，支持文档理解/代码生成/图像分析',
    icon: '🌐',
    category: 'agent',
    tags: ['AI助手', '阿里', '免费'],
    url: 'https://tongyi.aliyun.com',
    roles: ['all'],
    relations: [
      { id: 'doubao', reason: '国产AI对比' },
      { id: 'kimi', reason: '长文本对比' }
    ]
  },
  {
    id: 'ernie',
    name: '文心一言',
    desc: '百度AI大模型，擅长中文理解与知识问答',
    icon: '📚',
    category: 'agent',
    tags: ['AI助手', '百度', '免费'],
    url: 'https://yiyan.baidu.com',
    roles: ['all'],
    relations: [
      { id: 'tongyi', reason: '大模型对比' },
      { id: 'metaso', reason: '搜索增强' }
    ]
  },
  {
    id: 'gamma',
    name: 'Gamma',
    desc: 'AI PPT生成工具，从大纲到精美演示文稿一键生成',
    icon: '📊',
    category: 'productivity',
    tags: ['PPT', '演示', '效率'],
    url: 'https://gamma.app',
    login: true,
    roles: ['student', 'operator', 'designer'],
    relations: [
      { id: 'jiying-ai', reason: '文案→PPT' },
      { id: 'jimeng', reason: '配图生成' }
    ]
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    desc: 'AI增强版笔记与知识管理，自动摘要/写作/翻译',
    icon: '📝',
    category: 'productivity',
    tags: ['笔记', '知识管理', '付费'],
    url: 'https://www.notion.so',
    login: true,
    roles: ['developer', 'student'],
    relations: [
      { id: 'kimi', reason: '长文分析' },
      { id: 'gamma', reason: '笔记→PPT' }
    ]
  },
  {
    id: 'wolai',
    name: '我来 wolai',
    desc: '中文块编辑器+AI辅助，适合团队知识库搭建',
    icon: '📋',
    category: 'productivity',
    tags: ['笔记', '知识库', '免费'],
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
      { id: 'gamma', reason: '设计→演示' }
    ]
  },
  {
    id: 'suno',
    name: 'Suno AI',
    desc: 'AI音乐生成，文本描述即可生成完整歌曲',
    icon: '🎵',
    category: 'audio',
    tags: ['音乐', 'AI生成', '付费'],
    url: 'https://suno.ai',
    login: true,
    roles: ['designer', 'operator'],
    relations: [
      { id: 'capcut', reason: '视频配乐' },
      { id: 'libtv', reason: '视频BGM' }
    ]
  },
  {
    id: 'tts',
    name: 'Fish Audio',
    desc: 'AI语音合成，克隆人声/多语言/情感化朗读',
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
    desc: 'OpenAI旗舰对话模型，多模态/代码/创意全能',
    icon: '💬',
    category: 'agent',
    tags: ['AI助手', '多模态', '付费'],
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
    desc: 'Anthropic出品，长上下文+安全对齐+深度推理',
    icon: '🧠',
    category: 'agent',
    tags: ['AI助手', '长文本', '付费'],
    url: 'https://claude.ai',
    roles: ['developer', 'student'],
    relations: [
      { id: 'chatgpt', reason: '模型对比' },
      { id: 'trae', reason: '代码生成' }
    ]
  },
  {
    id: 'n8n',
    name: 'n8n',
    desc: '开源工作流自动化，连接200+服务实现AI流水线',
    icon: '⚡',
    category: 'productivity',
    tags: ['自动化', '工作流', '开源'],
    url: 'https://n8n.io',
    login: true,
    roles: ['developer', 'operator'],
    relations: [
      { id: 'dify', reason: 'AI工作流' },
      { id: 'coze', reason: 'Bot集成' }
    ]
  },
  {
    id: 'zapier',
    name: 'Zapier',
    desc: '自动化连接器，无需编码串联Web应用',
    icon: '🔗',
    category: 'productivity',
    tags: ['自动化', '集成', '付费'],
    url: 'https://zapier.com',
    login: true,
    roles: ['operator', 'developer'],
    relations: [
      { id: 'n8n', reason: '开源替代' },
      { id: 'coze', reason: '公众号自动化' }
    ]
  },
  {
    id: 'quantum',
    name: '量子位',
    desc: 'AI行业资讯与深度分析，掌握前沿动态',
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
    desc: 'AI模型社区与托管平台，开源模型/数据集/Spaces',
    icon: '🤗',
    category: 'code',
    tags: ['开源', '模型', '社区'],
    url: 'https://huggingface.co',
    roles: ['developer'],
    relations: [
      { id: 'dify', reason: '模型部署' },
      { id: 'fastgpt', reason: '模型微调' }
    ]
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    desc: 'AI代码补全工具，集成VS Code/JetBrains',
    icon: '🤖',
    category: 'code',
    tags: ['开发', '补全', '付费'],
    url: 'https://github.com/features/copilot',
    login: true,
    roles: ['developer'],
    relations: [
      { id: 'cursor', reason: 'AI编辑器' },
      { id: 'trae', reason: '国产替代' }
    ]
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    desc: '英文写作助手，语法纠错+风格优化+AI生成',
    icon: '✍️',
    category: 'writing',
    tags: ['英文', '语法', '付费'],
    url: 'https://grammarly.com',
    login: true,
    roles: ['student', 'operator'],
    relations: [
      { id: 'jiying-ai', reason: '中英文写作对比' },
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
      { id: 'grammarly', reason: '翻译→润色' },
      { id: 'kimi', reason: '长文翻译' }
    ]
  },
  {
    id: 'runway',
    name: 'Runway',
    desc: 'AI视频生成与编辑，支持文生视频/图生视频/修图',
    icon: '🎥',
    category: 'video',
    tags: ['AI视频', '编辑', '付费'],
    url: 'https://runwayml.com',
    login: true,
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
      { id: 'runway', reason: '轻量版' },
      { id: 'jimeng', reason: '国产平替' }
    ]
  },
  {
    id: 'heygen',
    name: 'HeyGen',
    desc: 'AI数字人视频生成，上传照片即可生成口播视频',
    icon: '👤',
    category: 'video',
    tags: ['数字人', '口播', '付费'],
    url: 'https://heygen.com',
    login: true,
    roles: ['operator'],
    relations: [
      { id: 'capcut', reason: '后期剪辑' },
      { id: 'tts', reason: '语音配音' }
    ]
  },
  {
    id: 'leonardo',
    name: 'Leonardo AI',
    desc: 'AI图像生成平台，模型丰富+实时生成',
    icon: '🎨',
    category: 'image',
    tags: ['AI绘画', '模型', '免费'],
    url: 'https://leonardo.ai',
    login: true,
    roles: ['designer'],
    relations: [
      { id: 'mj', reason: '免费替代' },
      { id: 'jimeng', reason: '同类对比' }
    ]
  },
  {
    id: 'stability',
    name: 'Stable Diffusion',
    desc: '开源AI图像生成，本地部署+高度可控',
    icon: '🖼️',
    category: 'image',
    tags: ['AI绘画', '开源', '免费'],
    url: 'https://stability.ai',
    roles: ['designer', 'developer'],
    relations: [
      { id: 'leonardo', reason: '云端版' },
      { id: 'huggingface', reason: '模型下载' }
    ]
  },
  {
    id: 'adobe-firefly',
    name: 'Adobe Firefly',
    desc: 'Adobe官方AI生成，集成PS/AE生态',
    icon: '✨',
    category: 'image',
    tags: ['AI绘画', '设计', '付费'],
    url: 'https://firefly.adobe.com',
    login: true,
    roles: ['designer'],
    relations: [
      { id: 'canva', reason: '设计对比' },
      { id: 'mj', reason: '风格对比' }
    ]
  },
  {
    id: 'replit',
    name: 'Replit',
    desc: '在线IDE+AI编程，浏览器写代码+一键部署',
    icon: '🖥️',
    category: 'code',
    tags: ['开发', 'IDE', '免费'],
    url: 'https://replit.com',
    roles: ['developer', 'student'],
    relations: [
      { id: 'trae', reason: 'AI编程对比' },
      { id: 'cursor', reason: '编辑器对比' }
    ]
  },
  {
    id: 'codeium',
    name: 'Codeium',
    desc: '免费的AI代码补全，支持70+语言/40+编辑器',
    icon: '⚡',
    category: 'code',
    tags: ['开发', '补全', '免费'],
    url: 'https://codeium.com',
    roles: ['developer'],
    relations: [
      { id: 'github-copilot', reason: '免费替代' },
      { id: 'tabnine', reason: '同类对比' }
    ]
  },
  {
    id: 'tabnine',
    name: 'Tabnine',
    desc: 'AI代码补全，本地模型保护代码隐私',
    icon: '🔒',
    category: 'code',
    tags: ['开发', '补全', '隐私'],
    url: 'https://tabnine.com',
    login: true,
    roles: ['developer'],
    relations: [
      { id: 'codeium', reason: '免费版对比' },
      { id: 'github-copilot', reason: '功能对比' }
    ]
  },
  {
    id: 'v0',
    name: 'v0.dev',
    desc: 'Vercel出品，自然语言生成前端UI组件',
    icon: '🧩',
    category: 'code',
    tags: ['开发', '前端', '免费'],
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
    desc: 'AI搜索引擎，带来源的深度问答',
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
    tags: ['AI助手', '多模型', '免费'],
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
    desc: '清华系AI助手，GLM模型中文能力强',
    icon: '🧪',
    category: 'agent',
    tags: ['AI助手', '国产', '免费'],
    url: 'https://chatglm.cn',
    roles: ['all'],
    relations: [
      { id: 'doubao', reason: '国产AI对比' },
      { id: 'tongyi', reason: '大模型对比' }
    ]
  },
  {
    id: 'spark',
    name: '讯飞星火',
    desc: '科大讯飞AI助手，语音交互+文档处理能力强',
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
    id: 'elevenlabs',
    name: 'ElevenLabs',
    desc: '顶级AI语音合成，情感丰富+声音克隆',
    icon: '🎙️',
    category: 'audio',
    tags: ['语音', '克隆', '付费'],
    url: 'https://elevenlabs.io',
    login: true,
    roles: ['operator', 'designer'],
    relations: [
      { id: 'tts', reason: '免费替代' },
      { id: 'heygen', reason: '数字人口型' }
    ]
  },
  {
    id: 'riffusion',
    name: 'Riffusion',
    desc: 'AI音乐生成，文本描述生成器乐片段',
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
    id: 'otter',
    name: 'Otter.ai',
    desc: 'AI会议记录，实时转录+自动摘要+行动项提取',
    icon: '📞',
    category: 'productivity',
    tags: ['会议', '转录', '免费'],
    url: 'https://otter.ai',
    login: true,
    roles: ['operator', 'developer'],
    relations: [
      { id: 'notion-ai', reason: '笔记同步' },
      { id: 'kimi', reason: '长文总结' }
    ]
  },
  {
    id: 'mem',
    name: 'Mem',
    desc: 'AI笔记，自动标签+关联推荐+知识图谱',
    icon: '🧠',
    category: 'productivity',
    tags: ['笔记', 'AI', '知识管理'],
    url: 'https://mem.ai',
    login: true,
    roles: ['student', 'developer'],
    relations: [
      { id: 'notion-ai', reason: '对比' },
      { id: 'wolai', reason: '国产替代' }
    ]
  },
  {
    id: 'motion',
    name: 'Motion',
    desc: 'AI日程管理，自动排优先级+防冲突',
    icon: '📅',
    category: 'productivity',
    tags: ['日程', '效率', '付费'],
    url: 'https://motion.app',
    login: true,
    roles: ['all'],
    relations: [
      { id: 'reclaim', reason: '同类对比' }
    ]
  },
  {
    id: 'reclaim',
    name: 'Reclaim.ai',
    desc: 'AI日历助手，自动安排任务+习惯+会议',
    icon: '⏰',
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
    desc: '国产顶级AI大模型，推理能力强+超长上下文，性价比极高',
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
    desc: 'Google多模态AI，原生图像理解+超长上下文100万token',
    icon: '♊',
    category: 'agent',
    tags: ['AI助手', '多模态', '免费'],
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
    desc: 'xAI出品，实时联网+幽默风格+深度推理',
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
    id: 'manus',
    name: 'Manus',
    desc: 'AI智能体平台，自动完成复杂任务（调研/分析/报告生成）',
    icon: '🦾',
    category: 'agent',
    tags: ['智能体', '自动化', '国产'],
    url: 'https://manus.im',
    login: true,
    roles: ['developer', 'operator', 'student'],
    relations: [
      { id: 'dify', reason: '工作流对比' },
      { id: 'deepseek', reason: '推理引擎' }
    ]
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    desc: 'AI原生IDE，智能代码补全+多文件编辑+Agent模式',
    icon: '🏄',
    category: 'code',
    tags: ['开发', '编辑器', 'AI'],
    url: 'https://codeium.com/windsurf',
    login: true,
    roles: ['developer'],
    relations: [
      { id: 'cursor', reason: '编辑器对比' },
      { id: 'trae', reason: '国产替代' }
    ]
  },
  {
    id: 'bolt',
    name: 'Bolt.new',
    desc: 'AI全栈Web应用生成，对话即可构建可部署应用',
    icon: '⚡',
    category: 'code',
    tags: ['开发', '全栈', 'AI生成'],
    url: 'https://bolt.new',
    roles: ['developer', 'designer'],
    relations: [
      { id: 'v0', reason: '前端对比' },
      { id: 'trae', reason: '国产替代' }
    ]
  },
  {
    id: 'cline',
    name: 'Cline',
    desc: 'VS Code AI编程助手，自主编码+终端操作+文件管理',
    icon: '🧩',
    category: 'code',
    tags: ['开发', '编辑器', '开源'],
    url: 'https://cline.bot',
    login: true,
    roles: ['developer'],
    relations: [
      { id: 'windsurf', reason: 'Agent模式对比' },
      { id: 'cursor', reason: '功能对比' }
    ]
  },
  {
    id: 'napkin',
    name: 'Napkin AI',
    desc: '文字一键转图表/流程图/信息图，适合PPT和公众号配图',
    icon: '📊',
    category: 'productivity',
    tags: ['图表', '可视化', '效率'],
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
    desc: '浏览器AI助手，集成搜索+写作+翻译+ChatGPT',
    icon: '🔍',
    category: 'productivity',
    tags: ['AI助手', '浏览器', '免费'],
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
    desc: '字节跳动AI创意工具，智能生成短视频、图文与直播素材',
    icon: '🎬',
    category: 'video',
    tags: ['短视频', '素材', 'AI生成', '免费'],
    url: 'https://aic.oceanengine.com',
    roles: ['operator', 'designer'],
    relations: [
      { id: 'capcut', reason: '剪辑联动' },
      { id: 'coze', reason: '字节生态' }
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
  },
  {
    id: 'opencode-vps',
    name: 'VPS OpenCode',
    desc: 'VPS 上的 AI 编程助手网页版，支持远程编码与终端操作',
    icon: '💻',
    category: 'code',
    tags: ['编程', 'AI助手', '远程', '免费'],
    url: 'https://memohmt4.tail369da7.ts.net/',
    roles: ['developer', 'student'],
    badge: '🆓 可试用3次',
    relations: []
  },
  {
    id: 'thbe',
    name: 'THBE 按键工具集',
    desc: '在线按键工具集合，提供多种实用按键功能与自动化操作',
    icon: '🖱️',
    category: 'productivity',
    tags: ['效率', '自动化', '在线工具'],
    url: 'https://thbe.pages.dev',
    roles: ['operator', 'developer'],
    relations: []
  }
];

// ===== Scene Config =====
const SCENES = [
  { id: 'wechat-article', label: '📰 公众号推文', tools: ['jiying-ai', '135editor', 'metaso', 'kimi', 'quantum', 'deepl', 'deepseek'] },
  { id: 'ai-video', label: '🎬 AI短视频', tools: ['libtv', 'jimeng', 'kling', 'capcut', 'runway', 'pika', 'heygen', 'suno', 'tts', 'douyin-ai'] },
  { id: 'auto-workflow', label: '🔄 自动化工作流', tools: ['n8n', 'zapier', 'dify', 'coze', 'fastgpt', 'manus'] },
  { id: 'ai-coding', label: '💻 AI编程', tools: ['trae', 'cursor', 'github-copilot', 'codeium', 'tabnine', 'v0', 'replit', 'huggingface', 'dify', 'windsurf', 'bolt', 'cline', 'opencode-vps'] },
  { id: 'design-creative', label: '🎨 创意设计', tools: ['mj', 'jimeng', 'leonardo', 'stability', 'adobe-firefly', 'canva', 'removebg', 'gamma', 'napkin'] },
  { id: 'research-study', label: '📚 学习研究', tools: ['kimi', 'metaso', 'perplexity', 'doubao', 'tongyi', 'zhipu', 'spark', 'notion-ai', 'deepseek', 'gemini', 'grok'] },
  { id: 'podcast-audio', label: '🎵 音频创作', tools: ['suno', 'elevenlabs', 'riffusion', 'tts', 'capcut', 'minimax', 'udio', 'mubert', 'soundraw', 'aiva'] },
  { id: 'wechat-bot', label: '🤖 公众号Bot', tools: ['coze', 'dify', 'fastgpt', 'n8n', 'zapier', 'manus'] },
  { id: 'english-writing', label: '🌍 英文写作', tools: ['grammarly', 'deepl', 'chatgpt', 'claude', 'perplexity', 'gemini'] },
  { id: 'meeting-notes', label: '📝 会议纪要', tools: ['otter', 'notion-ai', 'kimi', 'mem', 'reclaim', 'monica'] }
];

// ===== Tag Relations (搜索联想) =====
const TAG_RELATIONS = {
  '公众号': ['文案', '排版', '选题', '涨粉', '运营', '封面'],
  '视频': ['剪辑', '字幕', '封面', '脚本', '配乐', '数字人'],
  '免费': ['学生', '入门', '试用', '开源', '新手'],
  '开发': ['编程', '代码', 'API', '部署', 'Git', '前端'],
  '设计': ['海报', '配图', '抠图', '封面', '排版', '绘画'],
  'AI助手': ['对话', '写作', '翻译', '总结', '问答', '搜索'],
  '英文': ['翻译', '写作', '语法', '润色', '校对'],
  '开源': ['免费', '自部署', '社区', 'GitHub', '模型'],
  '语音': ['配音', '克隆', '朗读', '播客', '字幕'],
  '效率': ['自动化', '日程', '笔记', '会议', '工作流'],
  '国产': ['免费', 'AI助手', '大模型', '中文', 'DeepSeek'],
  '推理': ['逻辑', '数学', '代码', '深度思考', '分析'],
  '多模态': ['图像', '视频', '语音', '文档', '识别']
};

// ===== Tutorials Data (AI 教程) =====
const TUTORIALS_DATA = [
  {
    title: 'ChatGPT 从入门到精通',
    desc: '覆盖账号注册、提示词工程、插件使用、API 调用等全流程教程。',
    url: '#',
    source: 'AI 百宝箱',
    level: '入门',
    tags: ['ChatGPT', '提示词', 'GPT-4']
  },
  {
    title: 'Midjourney 绘画完全指南',
    desc: '参数详解、提示词公式、风格参考、商业应用案例一应俱全。',
    url: '#',
    source: 'AI 百宝箱',
    level: '进阶',
    tags: ['Midjourney', 'AI绘画', '设计']
  },
  {
    title: 'Claude 编程实战技巧',
    desc: '用 Claude 辅助编码、调试、代码审查、文档生成的最佳实践。',
    url: '#',
    source: 'AI 百宝箱',
    level: '进阶',
    tags: ['Claude', '编程', 'Anthropic']
  },
  {
    title: 'AI 视频制作全流程',
    desc: '从脚本生成到 AI 配音、数字人播报、自动剪辑的完整工作流。',
    url: '#',
    source: 'AI 百宝箱',
    level: '入门',
    tags: ['视频', '数字人', '剪辑']
  },
  {
    title: 'Cursor AI 编辑器入门',
    desc: 'AI 原生 IDE 的使用技巧，包括代码补全、对话调试、项目重构。',
    url: '#',
    source: 'AI 百宝箱',
    level: '入门',
    tags: ['Cursor', '编辑器', '效率']
  },
  {
    title: 'DeepSeek R1 推理模型深度解析',
    desc: '深入讲解 DeepSeek R1 的推理能力、使用场景和提示词策略。',
    url: '#',
    source: 'AI 百宝箱',
    level: '进阶',
    tags: ['DeepSeek', '推理', '国产']
  },
  {
    title: 'AI Agent 开发入门',
    desc: '使用 Dify / Coze / LangChain 搭建智能助手和自动化工作流。',
    url: '#',
    source: 'AI 百宝箱',
    level: '进阶',
    tags: ['Agent', 'Dify', 'Coze']
  },
  {
    title: 'Suno AI 音乐创作教程',
    desc: 'AI 生成音乐从零开始：歌词创作、风格控制、混音导出技巧。',
    url: '#',
    source: 'AI 百宝箱',
    level: '入门',
    tags: ['Suno', '音乐', 'AI创作']
  },
  {
    title: 'Perplexity AI 深度搜索技巧',
    desc: '学术搜索、实时数据、文件分析等高级使用方法和提示词范例。',
    url: '#',
    source: 'AI 百宝箱',
    level: '入门',
    tags: ['Perplexity', '搜索', '研究']
  },
  {
    title: 'AI 工具组合工作流案例',
    desc: '真实业务场景中多个 AI 工具的组合使用方案，提升整体效率。',
    url: '#',
    source: 'AI 百宝箱',
    level: '进阶',
    tags: ['工作流', '效率', '案例']
  }
];
