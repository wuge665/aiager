# AI Hub Relay — API 中转站

OpenAI 兼容的 API 中转/代理服务，支持多模型接入。

## 架构

```
用户 (OpenAI SDK) → Cloudflare Worker → VPS FastAPI → OpenAI / Claude / Gemini / ...
```

## 快速开始

### 1. 安装

```bash
cd relay
pip install -r requirements.txt
cp .env.example .env
# 编辑 .env 填入配置
```

### 2. 初始化数据

```bash
python seed.py
```

这会创建：
- 管理员 `admin` / `admin123`，带无限额度的 API Key
- 演示用户 `demo` / `demo123`，带 100 万 token 额度
- OpenAI / Claude / Gemini 示例通道（需自行替换 API Key）
- 模型价格表

### 3. 启动

```bash
python main.py
# 访问 http://localhost:8080/docs 查看 Swagger 文档
```

### 4. 配置上游通道

通过管理 API 添加真实的 API Key：

```bash
curl -X POST http://localhost:8080/api/admin/channels \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My OpenAI",
    "provider": "openai",
    "api_key": "sk-real-key",
    "models": "gpt-4o,gpt-4o-mini"
  }'
```

### 5. 使用

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-<用户API Key>",
    base_url="http://localhost:8080/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}]
)
print(response.choices[0].message.content)
```

## API 端点

| 端点 | 说明 |
|------|------|
| `GET /v1/models` | 可用模型列表 |
| `POST /v1/chat/completions` | 聊天补全 (支持 stream) |
| `POST /api/auth/login` | 用户登录 |
| `POST /api/auth/register` | 用户注册 |
| `GET /api/admin/users` | 管理：用户列表 |
| `POST /api/admin/channels` | 管理：添加上游通道 |
| `GET /api/admin/usage` | 管理：用量统计 |

## 支持的 Provider

| Provider | 标识 | 格式转换 |
|----------|------|----------|
| OpenAI | `openai` | 透传 |
| Azure OpenAI | `azure` | 透传 |
| Anthropic Claude | `anthropic`, `claude` | OpenAI → Claude → OpenAI |
| Google Gemini | `google`, `gemini` | OpenAI → Gemini → OpenAI |

## 部署

### VPS

```bash
# 使用 systemd 或 supervisord 管理进程
nohup python main.py > relay.log 2>&1 &
```

### Cloudflare Worker

1. 修改 `worker/relay-worker.js` 中的 `BACKEND_URL` 指向你的 VPS
2. 通过 `wrangler deploy` 或 Cloudflare Dashboard 部署
