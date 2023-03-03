# English

Fluentify exists to make using ChatGPT easier, and this project will remain open source.

Fluentify binds commonly used prompts to shortcut commands, and uses selected content from web pages to make API requests and display the results.

Chrome Extension: https://chrome.google.com/webstore/detail/fluentify/biaggnjibplcfekllonekbonhfgchopo?hl=en&authuser=0

Next Steps(Welcome to contribute code):

1. Add in-page plugins for Fluentify on major social media and content platforms (including GitHub) with UI styles consistent with those platforms. Restructure architecture to allow for different command settings on different platforms.
   - Plugins should include 3 shortcut commands, 1 custom input box, and 1 settings button.
   - For replying to content or emails, Fluentify should process the content being replied to and output the processed content to the appropriate text area.
   - For creating content or emails, Fluentify should process selected text (or input box text if none is selected).
2. Fix issues with inability to process selected text on certain web pages.
3. Create a GitHub page for collecting and sharing prompts.

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open your Chrome browser and load the appropriate development build：

1. Go to [chrome://extensions](chrome://extensions).
2. At the top right, turn on Developer mode.
3. Click Load unpacked.
4. Find and select the `build/chrome-mv3-dev` folder.
5. Pin this extension to your Chrome toolbar.
6. After installation, please refresh the page where you want to select text before using this extension.

# 中文

Fluentify 的存在是为了更简单地使用 ChatGPT，本项目将保持开源状态。

Fluentify 将常用的 prompt 绑定到快捷指令，结合网页中的选中内容进行 API 请求，并将请求结果进行展示。

Chrome 插件：https://chrome.google.com/webstore/detail/fluentify/biaggnjibplcfekllonekbonhfgchopo?hl=en&authuser=0

下一步更新计划（欢迎贡献代码）：

1. 在主流社交平台和内容发布平台（包括 GitHub）上，为 Fluentify 新增页面内插件。插件的 UI 风格应该与该平台保持一致。进行架构更改，使得不同平台可以有不同的指令设置。
   - 插件包括 3 个快捷指令、1 个自定义输入框和 1 个设置按钮。
   - 对于回复内容或邮件的情况，Fluentify 应该对被回复的内容进行处理，并将处理后的内容输出到相应的文本区域内。
   - 对于创作内容或邮件的情况，Fluentify 应该对被选中的文字进行处理（如果未选中，则对输入框内的文字进行处理）。
2. 处理在某些页面中无法处理选中文字的问题。
3. 新增一个 GitHub 页面，用于收集和分享大家的 prompt。

## 入门指南

首先，运行：

```bash
pnpm dev
# 或者
npm run dev
# 或者
yarn dev
```

打开 Chrome 浏览器，加载相应的开发构建：

1. 打开 [chrome://extensions](chrome://extensions)。
2. 在右上角打开开发者模式。
3. 点击“加载已解压的扩展程序”。
4. 找到并选择 `build/chrome-mv3-dev` 文件夹。
5. 将此扩展程序固定到 Chrome 工具栏上。
6. 安装完成后，请先刷新要选中文字的页面，再使用本插件。
