<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AeroLeaf CFD: Standalone Airflow Analysis Tool

<div align="center">
  <a href="https://[dr-richard-barker].github.io/aeroleaf-cfd-blender-integrated-airflow-analysis/" target="_blank">
    <img src="https://img.shields.io/badge/Launch-Application-brightgreen?style=for-the-badge&logo=rocket" alt="Launch Application">
  </a>
</div>

This repository contains a standalone, browser-based computational fluid dynamics (CFD) modeling tool. It can be used to simulate airflow around a 3D model and visualize the results.

**Note:** The simulation is a mock and does not perform real CFD calculations. It is intended for demonstration purposes only.

## How to Use

1. **Build the application:**
   - First, ensure you have Node.js installed.
   - Install the development dependencies:
     ```
     npm install
     ```
   - Build the application:
     ```
     npm run build
     ```
2. **Run the application:**
   - After the build is complete, you will find the standalone application in the `dist` directory.
   - Open the `dist/index.html` file in your web browser to use the modeling tool.

## Deployment to GitHub Pages

This repository is configured to automatically deploy the application to GitHub Pages when changes are pushed to the `main` branch.

To enable this for your fork of the repository, you need to:

1.  **Enable GitHub Pages:**
    - Go to your repository's **Settings** tab.
    - In the left sidebar, click on **Pages**.
    - Under **Build and deployment**, select **GitHub Actions** as the source.

2.  **Update the Launch Button URL:**
    - In this `README.md` file, replace `[YOUR_USERNAME]` in the launch button's URL with your GitHub username.

Once GitHub Pages is enabled, the application will be available at `https://[YOUR_USERNAME].github.io/aeroleaf-cfd-blender-integrated-airflow-analysis/`.
