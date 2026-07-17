// ===== AI 项目中文描述映射 =====
// 用于将 GitHub 热门 AI 项目的英文描述替换为更详细、有吸引力的中文内容
// 优先级：本地中文映射 > API 英文原内容

const PROJECTS_CN = {
  // === 大语言模型 (LLM) ===
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

  // === AI 编程工具 ===
  'cursor': {
    name: 'Cursor',
    desc: 'AI 原生代码编辑器，GPT-4 驱动的智能补全 + 对话调试，重新定义编程效率',
    tags: ['AI编辑器', '智能补全', '对话调试', '效率神器'],
    category: 'code'
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
  'sweep': {
    name: 'Sweep',
    desc: 'AI 自动化 GitHub Issues，描述需求自动生成 PR，代码审查 + 测试全覆盖',
    tags: ['自动化', 'GitHub', 'PR生成', '代码审查'],
    category: 'code'
  },
  'gpt-engineer': {
    name: 'GPT Engineer',
    desc: 'AI 全栈开发平台，从需求描述到完整代码，支持 Web/移动端应用生成',
    tags: ['全栈开发', '需求生成代码', '快速原型', '高效'],
    category: 'code'
  },

  // === AI 绘图/图像 ===
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
  'openai-whisper': {
    name: 'Faster-Whisper',
    desc: 'Whisper 加速版，CTranslate2 引擎实现 4x 速度提升，显存占用减半',
    tags: ['语音识别', '加速版', '高效', 'GPU优化'],
    category: 'audio'
  },
  'tortoise-tts': {
    name: 'Tortoise TTS',
    desc: '高质量 AI 语音克隆，少量样本即可模仿任意声音，支持中英文',
    tags: ['语音克隆', '少样本', '高质量', '多语言'],
    category: 'audio'
  },
  'audiocraft': {
    name: 'AudioCraft',
    desc: 'Meta 音频生成全家桶，MusicGen + AudioGen + EnCodec 一站式音频 AI',
    tags: ['音频生成', 'Meta', '全家桶', '开源'],
    category: 'audio'
  },
  'so-vits-svc': {
    name: 'So-VITS-SVC',
    desc: 'AI 歌声转换，将任意声音转换为目标歌手音色，翻唱神器',
    tags: ['歌声转换', '翻唱', '音色迁移', '开源'],
    category: 'audio'
  },
  'rvc-project': {
    name: 'RVC',
    desc: '实时语音变声器，低延迟高音质，支持直播和录音实时变声',
    tags: ['实时变声', '低延迟', '直播', '开源'],
    category: 'audio'
  },
  'deforum-stable-diffusion': {
    name: 'Deforum',
    desc: 'AI 视频动画生成，基于 Stable Diffusion 的逐帧动画，梦幻视觉效果',
    tags: ['AI动画', '逐帧生成', '创意', '视觉艺术'],
    category: 'video'
  },
  'animatediff': {
    name: 'AnimateDiff',
    desc: 'SD 视频扩展插件，一张图片生成流畅动画，角色一致性出色',
    tags: ['AI动画', '图片动画', 'SD插件', '角色一致'],
    category: 'video'
  },
  'frame-interpolation': {
    name: 'FILM',
    desc: 'Google 视频插帧 AI，将 30fps 提升至 60/120fps，丝滑慢动作',
    tags: ['视频插帧', 'Google', '慢动作', '高帧率'],
    category: 'video'
  },
  'wav2lip': {
    name: 'Wav2Lip',
    desc: 'AI 口型同步，让任何人说话对口型，视频配音必备工具',
    tags: ['口型同步', '配音', '视频编辑', '开源'],
    category: 'video'
  },
  'facefusion': {
    name: 'FaceFusion',
    desc: 'AI 换脸/修复/增强，实时人脸处理，效果自然无明显痕迹',
    tags: ['AI换脸', '人脸增强', '实时', '自然'],
    category: 'video'
  },
  'photoai': {
    name: 'PhotoAI',
    desc: 'AI 写真/证件照/形象照生成，上传照片即可生成多种风格写真',
    tags: ['AI写真', '证件照', '形象照', '多风格'],
    category: 'image'
  },
  'segment-anything': {
    name: 'Segment Anything',
    desc: 'Meta 通用分割模型，点击即可分割图片任意物体，零样本泛化能力',
    tags: ['图像分割', 'Meta', '零样本', '通用'],
    category: 'image'
  },
  'grounded-sam': {
    name: 'Grounded-SAM',
    desc: '文本驱动图像分割，输入文字描述自动识别并分割目标物体',
    tags: ['文本分割', '自动识别', 'SAM', 'GPT结合'],
    category: 'image'
  },
  'clip-interrogator': {
    name: 'CLIP Interrogator',
    desc: '图片反推提示词，上传图片自动生成 AI 绘图提示词，炼图必备',
    tags: ['反推提示词', '图片分析', 'AI绘图', '工具'],
    category: 'image'
  },
  'automatic1111-webui': {
    name: 'A1111 WebUI',
    desc: 'Stable Diffusion 经典 WebUI，功能全面生态丰富，AI 绘图入门首选',
    tags: ['AI绘图', '经典', '生态丰富', '入门首选'],
    category: 'image'
  },
  'langchain': {
    name: 'LangChain',
    desc: '最流行的 AI 应用开发框架，串联 LLM + 工具 + 记忆，构建复杂 Agent',
    tags: ['开发框架', 'Agent', 'LLM编排', '开源'],
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
  'openai-cookbook': {
    name: 'OpenAI Cookbook',
    desc: '官方示例代码集，涵盖 GPT/Copilot/DALL-E 各种最佳实践',
    tags: ['官方示例', '最佳实践', '教程', 'OpenAI'],
    category: 'code'
  },
  'nomic-embed-text': {
    name: 'Nomic Embed Text',
    desc: '开源文本嵌入模型，性能媲美 OpenAI ada-002，本地部署免费',
    tags: ['文本嵌入', '开源', '本地部署', '高性价比'],
    category: 'code'
  },
  'ollama-webui': {
    name: 'Open WebUI',
    desc: 'Ollama/Ollama 美观 Web 界面，支持多模型切换、聊天记录、RAG',
    tags: ['WebUI', 'Ollama', '多模型', '美观'],
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
  'chatglm.cpp': {
    name: 'ChatGLM.cpp',
    desc: '智谱 GLM-4 本地推理，国产大模型 C++ 加速，中文能力出色',
    tags: ['ChatGLM', '国产', 'C++加速', '中文'],
    category: 'llm'
  },
  'xi-api': {
    name: 'One API',
    desc: '统一 OpenAI API 管理，一个入口对接 GPT/Claude/Gemini/国产模型',
    tags: ['API管理', '多模型', '统一入口', '自托管'],
    category: 'llm'
  },
  'lobe-chat': {
    name: 'Lobe Chat',
    desc: '高颜值 AI 聊天平台，支持插件/RAG/多模型，可自部署',
    tags: ['聊天平台', '高颜值', '插件系统', '自部署'],
    category: 'llm'
  },
  'nextchat': {
    name: 'NextChat',
    desc: '轻量级 ChatGPT 镜像，支持一键部署到 Vercel，免费使用',
    tags: ['ChatGPT镜像', 'Vercel', '一键部署', '免费'],
    category: 'llm'
  }
};
