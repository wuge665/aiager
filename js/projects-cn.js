// ===== AI 项目中文描述映射 =====
// 用于将 GitHub 热门 AI 项目的英文描述替换为更详细、有吸引力的中文内容
// 优先级：本地中文映射 > API 英文原内容

const PROJECTS_CN = {
  // === 实际 API 返回的项目 ===
  'AutoGPT': {
    name: 'AutoGPT',
    desc: '人人可用的 AI 自动化神器，让 GPT 自主完成复杂任务，支持联网搜索+文件操作+代码执行',
    tags: ['自动化', 'Agent', 'GPT', '开源'],
    category: 'llm'
  },
  'prompts.chat': {
    name: 'Awesome ChatGPT Prompts',
    desc: '最全的 ChatGPT 提示词大全，数千个高质量 Prompt 模板，覆盖写作/编程/翻译/营销',
    tags: ['提示词', 'ChatGPT', '模板', '社区'],
    category: 'llm'
  },
  'transformers': {
    name: 'Transformers',
    desc: 'Hugging Face 旗舰框架，一站式加载 GPT/BERT/LLaMA 等 10 万+预训练模型',
    tags: ['模型框架', 'HuggingFace', '10万+模型', 'Python'],
    category: 'code'
  },
  'LLMs-from-scratch': {
    name: 'LLMs 从零构建',
    desc: '手把手教你从零构建 ChatGPT，PyTorch 实现 LLM 全流程，最佳学习资源',
    tags: ['教程', '从零构建', 'PyTorch', 'LLM'],
    category: 'llm'
  },
  'Deep-Live-Cam': {
    name: 'Deep Live Cam',
    desc: '实时 AI 换脸 + 视频 Deepfake，只需一张照片即可实时换脸，效果惊人',
    tags: ['实时换脸', 'Deepfake', '摄像头', 'AI'],
    category: 'video'
  },
  'claude-mem': {
    name: 'Claude Memory',
    desc: 'Claude 跨会话记忆插件，自动记录 Agent 操作，下次对话无缝衔接上下文',
    tags: ['Claude', '记忆', 'Agent', '跨会话'],
    category: 'llm'
  },
  'netdata': {
    name: 'Netdata',
    desc: 'AI 驱动的全栈监控平台，实时性能数据 + 智能告警，运维必备神器',
    tags: ['监控', '运维', 'AI告警', '实时'],
    category: 'code'
  },
  'OpenBB': {
    name: 'OpenBB',
    desc: '开源金融数据分析平台，AI 驱动的股票/加密货币/量化分析工具',
    tags: ['金融', '量化', '数据分析', 'AI'],
    category: 'code'
  },
  'system_prompts_leaks': {
    name: 'System Prompts 泄露合集',
    desc: 'ChatGPT/Claude/Gemini 等 AI 系统提示词泄露大全，了解 AI 背后的秘密',
    tags: ['提示词泄露', 'ChatGPT', 'Claude', 'Gemini'],
    category: 'llm'
  },
  'AI-For-Beginners': {
    name: 'AI 入门教程',
    desc: '微软官方出品，12周24节课全面学习 AI，零基础到实战的完整学习路径',
    tags: ['微软', '入门', '教程', '零基础'],
    category: 'llm'
  },
  'ray': {
    name: 'Ray',
    desc: '分布式 AI 计算引擎，轻松扩展 ML/DL 工作负载，大模型训练推理首选',
    tags: ['分布式', '计算引擎', 'ML', '大模型'],
    category: 'code'
  },
  'ai-engineering-from-scratch': {
    name: 'AI 工程从零构建',
    desc: '从零构建 AI 系统的完整教程，覆盖 Agent/CV/NLP/强化学习全栈技能',
    tags: ['教程', '全栈', 'Agent', '从零构建'],
    category: 'code'
  },
  'CV': {
    name: '深度学习笔记',
    desc: '超全面的深度学习笔记集合，涵盖 PyTorch/李沐/吴恩达/AI Agent 课程',
    tags: ['笔记', '深度学习', 'PyTorch', '中文'],
    category: 'llm'
  },
  'datasets': {
    name: 'HuggingFace Datasets',
    desc: '最大的开源数据集仓库，10万+数据集一键加载，NLP/CV/语音全覆盖',
    tags: ['数据集', 'HuggingFace', '10万+', '开源'],
    category: 'code'
  },
  '500-AI-Machine-learning-Deep-learning-Computer-vision-NLP-Projects-with-code': {
    name: '500+ AI 项目合集',
    desc: '500 个带代码的 AI 实战项目，机器学习/深度学习/CV/NLP 全覆盖',
    tags: ['项目合集', '实战', '代码', '500+'],
    category: 'code'
  },
  'ollama': {
    name: 'Ollama',
    desc: '本地运行大模型的神器，一键部署 Llama、Mistral 等开源模型，无需 GPU 也能跑',
    tags: ['本地部署', 'LLM', '开源', '新手友好'],
    category: 'llm'
  },
  'vllm': {
    name: 'vLLM',
    desc: '高性能 LLM 推理引擎，PagedAttention 技术实现 10x 吞吐量提升，生产环境首选',
    tags: ['推理加速', '高并发', '企业级', 'GPU优化'],
    category: 'llm'
  },
  'llama.cpp': {
    name: 'llama.cpp',
    desc: 'C++ 实现的 LLaMA 推理，CPU 也能跑 7B 模型，跨平台支持 macOS/Linux/Windows',
    tags: ['CPU推理', '跨平台', '轻量级', '嵌入式'],
    category: 'llm'
  },
  'cursor': {
    name: 'Cursor',
    desc: 'AI 原生代码编辑器，GPT-4 驱动的智能补全 + 对话调试，重新定义编程效率',
    tags: ['AI编辑器', '智能补全', '对话调试', '效率神器'],
    category: 'code'
  },
  'langchain': {
    name: 'LangChain',
    desc: '最流行的 AI 应用开发框架，串联 LLM + 工具 + 记忆，构建复杂 Agent',
    tags: ['开发框架', 'Agent', 'LLM编排', '开源'],
    category: 'code'
  },
  'whisper': {
    name: 'Whisper',
    desc: 'OpenAI 开源语音识别，支持 99 种语言转录，准确率媲美人类水平',
    tags: ['语音识别', '开源', '多语言', '转录'],
    category: 'audio'
  },
  'bark': {
    name: 'Bark',
    desc: 'Suno AI 开源语音合成，支持笑声/叹气/哼唱等情感表达，最逼真 TTS',
    tags: ['语音合成', '情感表达', '开源', '逼真'],
    category: 'audio'
  },
  'musicgen': {
    name: 'MusicGen',
    desc: 'Meta 出品 AI 音乐生成，文本描述即可生成高质量音乐，开源免费',
    tags: ['音乐生成', 'Meta', '开源', '文本转音乐'],
    category: 'audio'
  },
  'stable-diffusion-webui': {
    name: 'Stable Diffusion WebUI',
    desc: '最流行的 AI 绘图工具，文生图 + 图生图 + ControlNet，插件生态丰富',
    tags: ['AI绘画', '插件丰富', 'ControlNet', '社区活跃'],
    category: 'image'
  },
  'comfyui': {
    name: 'ComfyUI',
    desc: '节点式 AI 绘图工作流，可视化编排复杂生成流程，专业创作者首选',
    tags: ['节点编辑', '工作流', '专业级', '高度定制'],
    category: 'image'
  },
  'lobe-chat': {
    name: 'Lobe Chat',
    desc: '高颜值 AI 聊天平台，支持插件/RAG/多模型，可自部署',
    tags: ['聊天平台', '高颜值', '插件系统', '自部署'],
    category: 'llm'
  },
  'gpt4all': {
    name: 'GPT4All',
    desc: '本地 AI 助手全家桶，桌面应用一键安装，离线运行保护隐私',
    tags: ['本地AI', '桌面应用', '隐私保护', '一键安装'],
    category: 'llm'
  },
  'jan': {
    name: 'Jan',
    desc: '开源本地 AI 平台，精美 UI 支持多模型，类似 ChatGPT 的离线体验',
    tags: ['本地AI', '开源', '精美UI', '离线'],
    category: 'llm'
  },
  'segment-anything': {
    name: 'Segment Anything',
    desc: 'Meta 通用分割模型，点击即可分割图片任意物体，零样本泛化能力',
    tags: ['图像分割', 'Meta', '零样本', '通用'],
    category: 'image'
  },
  'animatediff': {
    name: 'AnimateDiff',
    desc: 'SD 视频扩展插件，一张图片生成流畅动画，角色一致性出色',
    tags: ['AI动画', '图片动画', 'SD插件', '角色一致'],
    category: 'video'
  },
  'rvc-project': {
    name: 'RVC',
    desc: '实时语音变声器，低延迟高音质，支持直播和录音实时变声',
    tags: ['实时变声', '低延迟', '直播', '开源'],
    category: 'audio'
  },
  'so-vits-svc': {
    name: 'So-VITS-SVC',
    desc: 'AI 歌声转换，将任意声音转换为目标歌手音色，翻唱神器',
    tags: ['歌声转换', '翻唱', '音色迁移', '开源'],
    category: 'audio'
  },
  'text-generation-webui': {
    name: 'Text Generation WebUI',
    desc: '一站式 LLM 网页界面，支持 GPTQ/GGUF/AWQ 量化，聊天记录 + 角色扮演 + 插件',
    tags: ['WebUI', '多格式', '角色扮演', '可视化'],
    category: 'llm'
  },
  'koboldcpp': {
    name: 'KoboldCpp',
    desc: 'AI 故事创作引擎，本地运行无审查模型，支持交互式小说和创意写作',
    tags: ['故事生成', '创意写作', '无审查', '本地'],
    category: 'llm'
  },
  'localai': {
    name: 'LocalAI',
    desc: 'OpenAI API 本地替代，支持文本/图像/语音多模态，无需联网即可使用',
    tags: ['API替代', '多模态', '隐私保护', '自托管'],
    category: 'llm'
  },
  'lm-studio': {
    name: 'LM Studio',
    desc: '精美桌面应用，拖拽加载 GGUF 模型，内置聊天界面 + API 服务器',
    tags: ['桌面应用', '可视化', 'API服务', '新手友好'],
    category: 'llm'
  },
  'continue': {
    name: 'Continue',
    desc: 'VS Code/JetBrains AI 插件，开源免费的 Copilot 替代，支持本地模型',
    tags: ['IDE插件', '开源', '本地模型', '免费'],
    category: 'code'
  },
  'aider': {
    name: 'Aider',
    desc: 'AI 结对编程助手，终端内直接修改代码，支持 Git 版本控制和多文件编辑',
    tags: ['结对编程', 'Git集成', '终端', '多文件'],
    category: 'code'
  },
  'open-interpreter': {
    name: 'Open Interpreter',
    desc: '本地代码执行环境，用自然语言控制你的电脑，执行 Python/JS/Shell 代码',
    tags: ['本地执行', '自然语言', '多语言', '自动化'],
    category: 'code'
  },
  'llama-index': {
    name: 'LlamaIndex',
    desc: 'RAG 框架王者，高效连接 LLM 与私有数据，知识库问答首选',
    tags: ['RAG', '知识库', '数据连接', '开源'],
    category: 'code'
  },
  'whisper.cpp': {
    name: 'whisper.cpp',
    desc: 'Whisper C++ 版，CPU 也能实时语音转文字，支持多平台部署',
    tags: ['语音识别', 'C++', '实时', '跨平台'],
    category: 'code'
  },
  'nextchat': {
    name: 'NextChat',
    desc: '轻量级 ChatGPT 镜像，支持一键部署到 Vercel，免费使用',
    tags: ['ChatGPT镜像', 'Vercel', '一键部署', '免费'],
    category: 'llm'
  },
  'chatglm.cpp': {
    name: 'ChatGLM.cpp',
    desc: '智谱 GLM-4 本地推理，国产大模型 C++ 加速，中文能力出色',
    tags: ['ChatGLM', '国产', 'C++加速', '中文'],
    category: 'llm'
  }
};
