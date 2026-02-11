# Deploying to Azure Static Web Apps

Since this is a Vite application, the best way to deploy it to Azure is using **Azure Static Web Apps**. This service automatically builds and hosts your web app globally.

## Prerequisites
- An Azure Account (Free tier is available).
- A GitHub repository (recommended) OR the Azure CLI installed locally.

## Option 1: Deploy via GitHub (Recommended)
This sets up continuous deployment, so your site updates whenever you push code.

1.  **Push your code to GitHub**:
    Initialize git if you haven't already:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    # Follow GitHub's instructions to push to a new repo
    ```

2.  **Create the Static Web App in Azure Portal**:
    - Go to [portal.azure.com](https://portal.azure.com).
    - Search for "Static Web Apps" and click **Create**.
    - **Basics**:
        - Subscription: Select yours.
        - Resource Group: Create new (e.g., `budi95-calculator-rg`).
        - Name: `budi95-calculator`.
        - Plan Type: **Free** (for personal/hobby projects).
        - Source: **GitHub**.
    - **GitHub Details**:
        - Sign in and select your repository and branch (usually `main`).
    - **Build Details**:
        - Build Presets: Select **Vite** (or Vue/React if listed, but Custom works too if you specify paths).
        - App location: `/`
        - Api location: (leave empty)
        - Output location: `dist`
    - Click **Review + create**, then **Create**.

Azure will verify the deployment and creating a GitHub Action in your repo. Wait a few minutes, and your site will be live!

## Option 2: Deploy via VS Code Extension
If you prefer staying in the editor:

1.  Install the **Azure Static Web Apps** extension for VS Code.
2.  Click the Azure icon in the sidebar.
3.  Right-click on your subscription and select **Create Static Web App... (Advanced)**.
4.  Follow the prompts (Name, Region, Framework = Vite).

## Option 3: Deploy via Azure CLI (Manual/Scripted)
If you install the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli):

1.  Login: `az login`
2.  Create the app (you need a token for this usually, simpler to just deploy):
    ```bash
    # Build your app first
    npm run build

    # Deploy (requires SWA CLI or use 'az staticwebapp create' which ties to repo)
    ```
    *Note: The Azure CLI path often still leans on GitHub or requires the `swa` CLI for direct local deployment.*

For direct local deployment without GitHub, install the SWA CLI:
```bash
npm install -g @azure/static-web-apps-cli
swa deploy ./dist --env production
```
