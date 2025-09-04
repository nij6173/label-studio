# Label Studio 升级到 1.20.0 版本总结

## 概述
本次升级将 Label Studio 从 1.10.1dev 版本升级到 1.20.0 版本，并解决了 Python 3.13 兼容性问题。

## 主要变更

### 1. 版本信息更新
- **文件**: `label_studio/__init__.py`
- **变更**: 
  - 版本号从 `1.10.1dev` 更新到 `1.20.0`
  - 使用 `importlib.metadata` 动态获取版本信息
  - 添加了异常处理以支持开发环境

### 2. Python 版本要求
- **文件**: `pyproject.toml`
- **变更**: Python 版本要求从 `>=3.8` 升级到 `>=3.10`

### 3. 新增功能模块

#### JWT 认证模块 (`jwt_auth/`)
- JWT API Token 认证系统
- 组织级别的 JWT 设置管理
- 支持截断令牌存储以提高安全性
- 文件包括: `models.py`, `views.py`, `urls.py`, `serializers.py`, `middleware.py`

#### ML 模型提供商模块 (`ml_model_providers/`)
- 支持多种 AI 模型提供商：OpenAI, Azure OpenAI, Anthropic, Vertex AI, Gemini
- 预算管理和使用跟踪
- 组织和用户级别的连接管理
- 文件包括: `models.py`, `admin.py`

#### ML 模型模块 (`ml_models/`)
- 增强的机器学习模型接口
- 第三方模型版本管理
- 模型运行跟踪和性能监控
- 文件包括: `models.py`, `admin.py`

#### 会话策略模块 (`session_policy/`)
- 组织级别的会话超时策略
- 可配置的会话持续时间和活动超时
- 文件包括: `models.py`, `api.py`, `serializers.py`, `urls.py`

### 4. 依赖项更新

#### 主要框架升级
- **Django**: `3.2.23` → `4.2.0+` (支持 Python 3.13)
- **Django REST Framework**: `3.13.1` → `3.14.0+`
- **Pydantic**: `1.7.3-1.11.0` → `1.10.0-2.0.0`

#### Python 3.13 兼容性修复
- **htmlmin** → **minify-html**: `0.1.12` → `0.15.0+`
- **protobuf**: `3.15.5-4.0.0` → `4.25.0+` (解决版本冲突)
- **numpy**: `1.24.3` → `1.26.0+` (支持 Python 3.13)
- **pandas**: `0.24.0+` → `2.0.0+`

#### Google Cloud 依赖更新
- **google-api-core**: `2.11.0` → `2.15.0+`
- **google-cloud-storage**: `2.5.0` → `2.15.0+`
- **google-cloud-logging**: `2.7.0` → `3.8.0+`
- **protobuf**: 解决了与 gRPC 的版本冲突

#### 其他重要依赖
- **redis**: `3.5` → `4.5.0+`
- **requests**: `2.31.0` → `2.31.0+`
- **psycopg2-binary**: `2.9.6` → `2.9.9+`
- **sentry-sdk**: `1.1.0+` → `1.40.0+`

### 5. 配置文件更新

#### Django 设置 (`core/settings/base.py`)
- 添加新应用到 `INSTALLED_APPS`:
  - `rest_framework_simplejwt`
  - `ml_model_providers`
  - `ml_models`
  - `jwt_auth`
  - `session_policy`

#### URL 配置 (`core/urls.py`)
- 添加新模块的 URL 路由:
  - `jwt_auth.urls`
  - `session_policy.urls`

### 6. 注解模板更新
- **多页文档模板**: 更新了 `multipage-documents/config.xml`
  - 从 `Repeater` 模式改为 `Image valueList` 模式
  - 简化了数据结构和配置

### 7. 测试和验证
- 创建了集成测试脚本验证新功能
- 创建了 `minify-html` 功能测试
- 验证了所有新模块的导入和基本功能

## 解决的问题

### Python 3.13 兼容性
- ✅ 解决了 `htmlmin` 不支持 Python 3.13 的问题
- ✅ 修复了 protobuf 版本冲突
- ✅ 更新了所有不兼容的依赖项

### 依赖冲突
- ✅ 解决了 Google Cloud 依赖的版本冲突
- ✅ 修复了 gRPC 相关包的依赖问题
- ✅ 统一了 protobuf 版本要求

## 新功能亮点

1. **JWT API Token 认证**: 提供更安全的 API 访问方式
2. **多 AI 模型提供商支持**: 集成 OpenAI、Azure、Anthropic 等主流 AI 服务
3. **预算管理**: 对 AI 模型使用进行成本控制和监控
4. **会话策略管理**: 更精细的用户会话控制
5. **更好的 HTML 压缩**: 使用 minify-html 提供更快更好的压缩效果

## 安装说明

1. **Python 版本**: 确保使用 Python 3.10 或更高版本
2. **依赖安装**: 
   ```bash
   pip install -r deploy/requirements.txt
   ```
3. **数据库迁移**: 运行新的数据库迁移
   ```bash
   python manage.py migrate
   ```

## 注意事项

- 本次升级包含重大版本更新，建议在测试环境中充分测试
- 新的 JWT 认证功能需要配置后才能使用
- 某些 API 可能因为 Django 版本升级而有细微变化
- 建议备份数据库后再进行升级

## 测试验证

所有新功能已通过以下测试：
- ✅ 模块导入测试
- ✅ 版本信息验证
- ✅ HTML 压缩功能测试
- ✅ 依赖兼容性验证

升级完成后，Label Studio 现在支持最新的 Python 3.13 版本，并包含了许多新的企业级功能。
