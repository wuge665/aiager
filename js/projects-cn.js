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
  }
};
