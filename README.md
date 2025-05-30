<div align="center">

![Moonshot Logo](https://github.com/moonshot-admin/moonshot/raw/main/misc/aiverify-moonshot-logo.png)

This repository contains the UI integration for [Project Moonshot](https://github.com/aiverify-foundation/moonshot)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)


</div>

## 🎯 Motivation

Developed by the [AI Verify Foundation](https://aiverifyfoundation.sg/), [Moonshot](https://aiverifyfoundation.sg/project-moonshot/) is one of the first tools to bring Benchmarking and Red-Teaming together to help AI developers, compliance teams and AI system owners <b>evaluate LLMs and LLM-based AI systems</b>.

Project Moonshot's UI is designed to provide a more intuitive user experience for benchmarking and red teaming processes via [Moonshot Library](https://pypi.org/project/aiverify-moonshot/).

You can view the Project Moonshot Library Repository [here](https://github.com/aiverify-foundation/moonshot).

#### 🎥 Preview: 

![moonshot-ui](./misc/ui-homepage.png)

</br>

## Getting Started

### ✅ Prerequisites

1. <b>Git Version Control:</b> [Git](https://github.com/git-guides/install-git) is essential for cloning the repository.

2. <b>Node.js:</b> [Node.js verion 20.11.1 LTS](https://nodejs.org/en/blog/release/v20.11.1) and above

3. <b>Moonshot:</b> [Moonshot Python Library](https://pypi.org/project/aiverify-moonshot/)

</br>

### ⬇️ Installation

If you already have installed the [Moonshot Python Library](https://pypi.org/project/aiverify-moonshot/), simply run
```
python -m moonshot -i moonshot-ui
```

Else, to install and build from source:
1. Download Moonshot UI from GitHub.
    ```
    git clone git@github.com:moonshot-admin/moonshot-ui.git
    ```
2. Install Required Dependencies
- Make sure that all requirements are installed by executing the following command:
    ```
    npm install
    ```
3. From the project root folder, execute the following command:
    ```
    npm run build
    ```

</br>

### 🖼️ Serving Moonshot UI
After the build is completed, serve the UI with this command:
```
python -m moonshot web
```
Access the Web UI from browser `http://localhost:3000`

Alternatively, to manually start up the Web UI, you can run:
```
npm start
```

⚠️ You will need to have test assets from [moonshot-data](https://github.com/aiverify-foundation/moonshot-data) before you can run any tests.

Check out our [Installation Guide](https://aiverify-foundation.github.io/moonshot/getting_started/quick_install/) for more details.

If you have installation issues, please take a look at the [Troubleshooting Guide](https://aiverify-foundation.github.io/moonshot/faq/).

</br>

## 📚 User Guides

[Getting Started with Moonshot Web UI](https://aiverify-foundation.github.io/moonshot/user_guide/web_ui/web_ui_guide/)

</br>
