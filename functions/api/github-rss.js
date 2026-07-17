// GitHub AI Trending Projects — RSS Feed
// 为 Agr Reader 等 RSS 阅读器提供订阅源

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 获取项目数据（复用 github-trending 的逻辑）
  const trendingUrl = new URL('/api/github-trending', url.origin);
  const trendingRes = await fetch(trendingUrl.toString(), {
    headers: { 'User-Agent': 'AgrReader/1.0' }
  });
  
  if (!trendingRes.ok) {
    return new Response('Failed to fetch projects', { status: 500 });
  }
  
  const projects = await trendingRes.json();
  
  // 中文描述映射
  const PROJECTS_CN = {
    'ollama': { name: 'Ollama', desc: '本地运行大模型的神器，一键部署 Llama、Mistral 等开源模型，无需 GPU 也能跑' },
    'vllm': { name: 'vLLM', desc: '高性能 LLM 推理引擎，PagedAttention 技术实现 10x 吞吐量提升' },
    'llama.cpp': { name: 'llama.cpp', desc: 'C++ 实现的 LLaMA 推理，CPU 也能跑 7B 模型' },
    'langchain': { name: 'LangChain', desc: '最流行的 AI 应用开发框架，串联 LLM + 工具 + 记忆' },
    'whisper': { name: 'Whisper', desc: 'OpenAI 开源语音识别，支持 99 种语言转录' },
    'bark': { name: 'Bark', desc: 'Suno AI 开源语音合成，支持笑声/叹气/哼唱等情感表达' },
    'musicgen': { name: 'MusicGen', desc: 'Meta 出品 AI 音乐生成，文本描述即可生成高质量音乐' },
    'stable-diffusion-webui': { name: 'Stable Diffusion WebUI', desc: '最流行的 AI 绘图工具，文生图 + 图生图 + ControlNet' },
    'comfyui': { name: 'ComfyUI', desc: '节点式 AI 绘图工作流，可视化编排复杂生成流程' },
    'lobe-chat': { name: 'Lobe Chat', desc: '高颜值 AI 聊天平台，支持插件/RAG/多模型' },
    'gpt4all': { name: 'GPT4All', desc: '本地 AI 助手全家桶，桌面应用一键安装' },
    'jan': { name: 'Jan', desc: '开源本地 AI 平台，精美 UI 支持多模型' },
    'segment-anything': { name: 'Segment Anything', desc: 'Meta 通用分割模型，点击即可分割图片任意物体' },
    'animatediff': { name: 'AnimateDiff', desc: 'SD 视频扩展插件，一张图片生成流畅动画' },
    'rvc-project': { name: 'RVC', desc: '实时语音变声器，低延迟高音质' },
    'so-vits-svc': { name: 'So-VITS-SVC', desc: 'AI 歌声转换，将任意声音转换为目标歌手音色' },
  };

  // 生成 RSS XML
  const siteUrl = 'https://aiager.top';
  const now = new Date().toUTCString();
  
  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>AI 百宝箱 - 热门 AI 项目</title>
    <link>${siteUrl}</link>
    <description>GitHub 最具影响力的 AI 开源项目，每日更新</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/api/github-rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/assets/icons/logo.svg</url>
      <title>AI 百宝箱</title>
      <link>${siteUrl}</link>
    </image>`;

  projects.forEach((p, i) => {
    const cn = PROJECTS_CN[p.name] || PROJECTS_CN[p.full_name?.split('/')?.[1]];
    const title = cn?.name || p.name || p.full_name;
    const desc = cn?.desc || p.description || '';
    const url = p.url || p.html_url;
    const pubDate = p.updated ? new Date(p.updated).toUTCString() : now;
    
    rss += `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="false">${url}</guid>
      <description><![CDATA[${desc}]]></description>
      <content:encoded><![CDATA[
        <p>${desc}</p>
        <p>⭐ ${p.stars || 0} | 🍴 ${p.forks || 0} | 💻 ${p.language || 'N/A'}</p>
        <p><a href="${url}">查看项目 →</a></p>
      ]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <category>${p.language || 'AI'}</category>
    </item>`;
  });

  rss += `
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, max-age=1800',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
