# 清苑西瓜溯源平台 🍉

一个基于 Next.js 的现代化农产品全流程溯源管理系统，为清苑区西瓜产业提供从播种到销售的完整追溯解决方案。

## 📋 项目简介

清苑西瓜溯源平台是一个全面的农产品质量安全追溯管理系统，旨在实现"一瓜一码，全程透明，品质保障"的目标。该平台通过数字化手段记录西瓜从播种、生长、采收到销售的全过程，为消费者提供透明可信的产品信息，为监管部门提供高效的质量管理工具。

### 核心功能

- **🔍 消费者端溯源查询**：通过扫描或输入溯源码查看产品完整生产档案
- **🌱 农户生产管理**：批次管理、农事记录、图片上传等
- **👮 监管部门审核**：多阶段质量检测、数据审核、风险预警
- **📊 全流程可视化**：时间轴展示、二维码分享、消费者反馈

## 🛠 技术栈

### 前端框架
- **Next.js 16.1.0** - React 19.2.3 全栈框架
- **TypeScript 5** - 类型安全保障
- **TailwindCSS 4** - 现代化样式解决方案
- **shadcn/ui** - 高品质 UI 组件库

### 后端 & 数据库
- **Prisma 7.2.0** - 现代数据库 ORM
- **PostgreSQL** - 生产级关系型数据库
- **Supabase** - 云数据库与存储服务

### 其他依赖
- **lucide-react** - 优雅的图标库
- **date-fns** - 日期处理
- **qrcode.react** - 二维码生成
- **jose** - JWT 认证
- **React Compiler** - 性能优化

## 📂 项目结构

```
qingyuan-watermelon/
├── app/                    # Next.js App Router
│   ├── actions/           # Server Actions（数据操作）
│   ├── admin/             # 农户/监管后台页面
│   │   ├── create-batch/  # 创建批次
│   │   ├── add-record/    # 添加农事记录
│   │   ├── add-quality/   # 添加质检记录
│   │   ├── quality/       # 质量检测管理
│   │   └── users/         # 用户管理
│   ├── login/             # 登录页
│   ├── register/          # 注册页
│   ├── trace/[id]/        # 溯源详情页
│   └── page.tsx           # 首页（消费者查询）
├── components/            # React 组件
│   ├── admin/             # 后台管理组件
│   └── ui/                # 通用 UI 组件
├── lib/                   # 工具库
│   ├── db.ts              # 数据库客户端
│   ├── auth.ts            # 认证工具
│   └── utils.ts           # 通用工具函数
├── prisma/                # 数据库配置
│   └── schema.prisma      # 数据模型定义
└── public/                # 静态资源
```

## 📊 数据模型

### 核心数据表

- **app_users** - 用户表（农户、监管员）
  - 用户名、密码、真实姓名
  - 角色（farmer/inspector/admin）
  - 账户状态（active/pending/rejected）

- **batches** - 生产批次
  - 批次号、品种、种植地点
  - 播种日期、批次状态
  - 一对多关联：records、inspections、feedbacks

- **records** - 农事操作记录
  - 操作类型（灌溉/施肥/防控/采收等）
  - 描述、图片、操作员、记录时间

- **inspections** - 质量检测记录
  - 检测阶段（种植期/采收期/流通/销售）
  - 检测结果（合格/不合格/预警）
  - 检测数据（糖度、农残等）、检测员

- **feedbacks** - 消费者评价
  - 评分（1-5星）
  - 评价内容、消费者昵称

- **base_locations** - 基础数据：种植地点
- **base_varieties** - 基础数据：西瓜品种

## 🚀 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- PostgreSQL 数据库
- Bun / npm / yarn / pnpm（包管理器）

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd qingyuan-watermelon
```

2. **安装依赖**
```bash
bun install
# 或
npm install
```

3. **配置环境变量**

创建 `.env` 文件，配置以下变量：
```env
# 数据库连接
DATABASE_URL="postgresql://user:password@host:port/database"

# Supabase（如需使用文件上传）
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# JWT 密钥
JWT_SECRET="your-secret-key"
```

4. **初始化数据库**
```bash
# 生成 Prisma Client
bun prisma generate

# 运行数据库迁移（如果有）
bun prisma db push
```

```bash
bun dev


6. **访问应用**

打开浏览器访问 [http://localhost:3000](http://localhost:3000)



**访问路径：** `/` 或 `/trace/[批次号]`

- 输入溯源码（如 KL-1718）查询产品信息
- 查看完整生产时间轴（播种→农事操作→采收）
- 查看多阶段质量检测报告
- 监管审批状态展示
- 风险预警提示
- 消费者评价与反馈
- 二维码分享功能

### 2. 农户端 - 生产管理

**访问路径：** `/admin`（需登录）

- **批次创建**：录入品种、地点、播种日期
- **农事记录**：
  - 灌溉水源、施肥养护、绿色防控、成熟采摘
  - 支持图片上传（多图展示）
  - 自动时间戳记录
- **批次管理**：查看所有批次及状态

### 3. 监管端 - 质量检控

**访问路径：** `/admin/quality`（需监管员权限）

- **多阶段检测**：
  - 种植期检测
  - 采收期检测
  - 流通抽检
  - 销售复检
- **检测数据录入**：糖度、农残、备注等
- **检测结果判定**：合格/不合格/预警
- **用户审核**：农户账号审批管理

## 🔐 认证与权限

### 用户角色

- **farmer**（农户）：创建批次、添加农事记录
- **inspector**（监管员）：质量检测、用户审核
- **admin**（管理员）：全部权限

### 认证流程

采用 JWT（JSON Web Token）认证：
1. 用户登录后生成加密 Cookie
2. 服务端 Actions 验证 Token
3. 根据角色控制访问权限

## 🎨 界面设计

### 设计理念
- **绿色主题**：符合农业主题的清新配色
- **移动优先**：响应式设计，完美适配手机端
- **信息可视化**：时间轴、卡片式布局、图标化操作
- **状态反馈**：风险预警、审核状态、质检结果醒目展示

### 核心组件
- 溯源详情页：渐变头部、信息卡片、时间轴、评价系统
- 管理后台：表格展示、表单录入、图片预览
- 通用组件：Button、Card、Badge、Input、Dialog 等

## 🌐 部署

### Vercel 部署（推荐）

1. 在 Vercel 导入 GitHub 仓库
2. 配置环境变量（与 `.env` 相同）
3. 自动部署完成

### 自托管部署

```bash
# 构建生产版本
bun run build

# 启动生产服务器
bun run start
```

## 📄 数据库管理

```bash
# 查看数据库结构
bun prisma studio

# 重置数据库
bun prisma db push --force-reset

# 查看已有数据
# 访问 Prisma Studio：http://localhost:5555
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request


---

**Built with ❤️ using Next.js 16 & React 19**
