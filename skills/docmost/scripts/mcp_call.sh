#!/bin/bash
# Docmost MCP JSON-RPC 调用封装
# 用法: ./mcp_call.sh <method> <tool_name> [json_args...]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONF_DIR="${HOME}/.openclaw/conf/docmost"
MCP_URL="${DOCMOST_MCP_URL:-http://docmost:3000/mcp}"

# 加载配置
if [ -f "${CONF_DIR}/config.json" ]; then
    API_KEY=$(python3 -c "import json; print(json.load(open('${CONF_DIR}/config.json')).get('api_key',''))" 2>/dev/null || echo "")
    if [ -z "$API_KEY" ]; then
        API_KEY=$(python3 -c "import json; print(json.load(open('${CONF_DIR}/config.json')).get('Authorization','').replace('Bearer ',''))" 2>/dev/null || echo "")
    fi
fi

# 如果没有配置，从环境变量获取
if [ -z "$API_KEY" ]; then
    API_KEY="${DOCMOST_API_KEY:-}"
fi

if [ -z "$API_KEY" ]; then
    echo "Error: No API key found" >&2
    exit 1
fi

METHOD="${1:-}"
TOOL="${2:-}"
# 剩余参数合并为 JSON
ARGS_JSON=""
if [ $# -ge 3 ]; then
    shift 2
    ARGS_JSON="$*"
else
    ARGS_JSON="{}"
fi

if [ -z "$METHOD" ] || [ -z "$TOOL" ]; then
    echo "用法: $0 <method> <tool_name> [json_args...]" >&2
    echo "  method: tools/list 或 tools/call" >&2
    echo "  tool: 工具名称（如 list_spaces）" >&2
    echo "  args: JSON 参数字符串，如 '{\"key\":\"value\"}'" >&2
    exit 1
fi

MSG_ID=$(date +%s)

# 构建请求
if [ "$METHOD" = "tools/call" ]; then
    if [ "$ARGS_JSON" = "{}" ] || [ -z "$ARGS_JSON" ]; then
        REQ="{\"jsonrpc\":\"2.0\",\"method\":\"${METHOD}\",\"id\":${MSG_ID},\"params\":{\"name\":\"${TOOL}\",\"arguments\":{}}}"
    else
        REQ="{\"jsonrpc\":\"2.0\",\"method\":\"${METHOD}\",\"id\":${MSG_ID},\"params\":{\"name\":\"${TOOL}\",\"arguments\":${ARGS_JSON}}}"
    fi
else
    REQ="{\"jsonrpc\":\"2.0\",\"method\":\"${METHOD}\",\"id\":${MSG_ID}}"
fi

# 调用 MCP
RESP=$(curl -s -X POST "${MCP_URL}" \
    -H "Authorization: Bearer ${API_KEY}" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -d "${REQ}" \
    --connect-timeout 15 -m 30 2>&1)

# 解析 SSE 响应 - 取第一个 data: 行
echo "$RESP" | grep '^data:' | head -1 | sed 's/^data: //'
