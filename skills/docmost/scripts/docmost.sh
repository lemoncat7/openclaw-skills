#!/bin/bash
# Docmost 高级封装
# 用法: ./docmost.sh <command> [args...]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONF_DIR="${HOME}/.openclaw/conf/docmost"

# 加载配置
load_config() {
    if [ -f "${CONF_DIR}/config.json" ]; then
        API_KEY=$(python3 -c "
import json, sys
c = json.load(open('${CONF_DIR}/config.json'))
print(c.get('api_key', c.get('Authorization','').replace('Bearer ','')))
" 2>/dev/null)
        export DOCMOST_API_KEY="$API_KEY"
    fi
}

load_config

CMD="$1"
shift || { echo "用法: $0 <command> [args...]"; exit 1; }

case "$CMD" in
    list-spaces)
        "${SCRIPT_DIR}/mcp_call.sh" tools/call list_spaces '{}'
        ;;
    list-pages)
        SPACE_ID="$1"
        if [ -z "$SPACE_ID" ]; then
            echo "用法: $0 list-pages <spaceId> [limit]" >&2
            exit 1
        fi
        LIMIT="${2:-50}"
        "${SCRIPT_DIR}/mcp_call.sh" tools/call list_pages "{\"spaceId\":\"${SPACE_ID}\",\"limit\":${LIMIT}}"
        ;;
    get-page)
        PAGE_ID="$1"
        if [ -z "$PAGE_ID" ]; then
            echo "用法: $0 get-page <pageId> [format]" >&2
            exit 1
        fi
        FORMAT="${2:-markdown}"
        "${SCRIPT_DIR}/mcp_call.sh" tools/call get_page "{\"pageId\":\"${PAGE_ID}\",\"format\":\"${FORMAT}\"}"
        ;;
    create-page)
        SPACE_ID="$1"; TITLE="$2"; CONTENT="$3"
        if [ -z "$SPACE_ID" ] || [ -z "$TITLE" ]; then
            echo "用法: $0 create-page <spaceId> <title> [content]" >&2
            exit 1
        fi
        CONTENT="${CONTENT:-}"
        # JSON 转义
        TITLE_ESC=$(echo "$TITLE" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read().strip()))" | tr -d '"')
        CONTENT_ESC=$(echo "$CONTENT" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read()))" | tr -d '"')
        "${SCRIPT_DIR}/mcp_call.sh" tools/call create_page "{\"spaceId\":\"${SPACE_ID}\",\"title\":${TITLE_ESC},\"content\":${CONTENT_ESC}}"
        ;;
    update-page)
        PAGE_ID="$1"; CONTENT="$2"; OP="${3:-replace}"
        if [ -z "$PAGE_ID" ] || [ -z "$CONTENT" ]; then
            echo "用法: $0 update-page <pageId> <content> [operation]" >&2
            exit 1
        fi
        CONTENT_ESC=$(echo "$CONTENT" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read()))" | tr -d '"')
        "${SCRIPT_DIR}/mcp_call.sh" tools/call update_page "{\"pageId\":\"${PAGE_ID}\",\"content\":${CONTENT_ESC},\"operation\":\"${OP}\"}"
        ;;
    search)
        QUERY="$1"; LIMIT="${2:-10}"
        if [ -z "$QUERY" ]; then
            echo "用法: $0 search <query> [limit]" >&2
            exit 1
        fi
        QUERY_ESC=$(echo "$QUERY" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read().strip()))" | tr -d '"')
        "${SCRIPT_DIR}/mcp_call.sh" tools/call search_pages "{\"query\":${QUERY_ESC},\"limit\":${LIMIT}}"
        ;;
    create-space)
        NAME="$1"; DESC="${2:-}"
        if [ -z "$NAME" ]; then
            echo "用法: $0 create-space <name> [description]" >&2
            exit 1
        fi
        NAME_ESC=$(echo "$NAME" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read().strip()))" | tr -d '"')
        DESC_ESC=$(echo "$DESC" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read().strip()))" | tr -d '"')
        "${SCRIPT_DIR}/mcp_call.sh" tools/call create_space "{\"name\":${NAME_ESC},\"description\":${DESC_ESC}}"
        ;;
    move-page)
        PAGE_ID="$1"; PARENT_ID="${2:-null}"
        if [ -z "$PAGE_ID" ]; then
            echo "用法: $0 move-page <pageId> [parentPageId]" >&2
            exit 1
        fi
        "${SCRIPT_DIR}/mcp_call.sh" tools/call move_page "{\"pageId\":\"${PAGE_ID}\",\"parentPageId\":${PARENT_ID}}"
        ;;
    *)
        echo "未知命令: $CMD" >&2
        echo "" >&2
        echo "可用命令:" >&2
        echo "  list-spaces                            列出所有空间" >&2
        echo "  list-pages <spaceId> [limit]          列出页面" >&2
        echo "  get-page <pageId> [format]            获取页面" >&2
        echo "  create-page <spaceId> <title> [content] 创建页面" >&2
        echo "  update-page <pageId> <content> [op]   更新页面" >&2
        echo "  search <query> [limit]                 搜索页面" >&2
        echo "  create-space <name> [desc]              创建空间" >&2
        echo "  move-page <pageId> [parentId]          移动页面" >&2
        exit 1
        ;;
esac
