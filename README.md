# To those who are confused about the "unverified" status in the ChatGPT Plugin.
There's no need to worry, it's just a plugin update that is currently pending review.

I submitted an updated version of the WebPilot's ChatGPT Plugin Thusday, which makes it faster, more accurate, and more powerful. According to ChatGPT's rules, plugin updates require a version review, which typically takes around 3 business days to complete. During the review process, the plugin will be marked as unverified and new users won't be able to install it (existing users are unaffected and can already use the more powerful new version in advance).

# Webpilot

Webpilot is a free, open-source "Copilot for web" that allows you to have free-form conversations with web pages or engage in automatic arguments with other users. Unlike ChatGPT, there is no need to chat or switch pages, and no need to constantly copy and paste back and forth. 

The current version of Webpilot is developed based on gpt-3.5-turbo, which binds some common prompts with shortcut commands, requests API, and displays results to manipulate the selected text on the webpage.

Chrome Extension: [Add to Chrome](https://chrome.google.com/webstore/detail/Webpilot/biaggnjibplcfekllonekbonhfgchopo?utm_source=link&amp;utm_medium=git&amp)

Official Website: [HomePage](https://www.Webpilot.ai/)

Dev Team: dev@webpilot.ai

Note: Webpilot is currently in Pre-Release version and will be officially released within the next month. It will continue to iterate (and remain open source and free).

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

