# Contributing to AeroLeaf CFD

First off, thank you for considering contributing to AeroLeaf CFD! Your help is greatly appreciated.

## Getting Started

To get the project up and running on your local machine, please follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dr-richard-barker/Aero-leaf-CFD-analysis-adapted-from-blender-ish.git
    ```

2.  **Install dependencies:**
    - Make sure you have Node.js installed.
    - Navigate to the project directory and install the required dependencies:
      ```bash
      npm install
      ```

3.  **Run the development server:**
    - To start the application in development mode with hot-reloading, run:
      ```bash
      npm run dev
      ```

## Building the Application

To create a static, production-ready build of the application, run the following command:

```bash
npm run build
```

The output will be placed in the `dist` directory. You can test the build locally by opening the `dist/index.html` file in your web browser.

## Deployment to GitHub Pages

This repository is configured to automatically build and deploy the application to GitHub Pages whenever changes are pushed to the `main` branch.

If you have forked this repository and wish to deploy it to your own GitHub Pages, you will need to:

1.  **Enable GitHub Pages:**
    - Go to your repository's **Settings** tab.
    - In the left sidebar, click on **Pages**.
    - Under **Build and deployment**, select **GitHub Actions** as the source.

2.  **Update the repository URL:**
    - In `vite.config.ts`, update the `base` path to match your repository name.
    - In `README.md`, update the URL for the **Launch Interactive Tool** button to point to your new GitHub Pages URL.
