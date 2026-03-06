## Workout Journal Telegram Mini App

This project is a small React + Vite front-end that recreates the **Workout Journal** mini app UI, suitable for embedding as a Telegram Web App.

### Auto-deploy (GitHub Pages)

This repo is configured to auto-deploy to **GitHub Pages** on every push to `main` via GitHub Actions.

- In your GitHub repo, go to `Settings` → `Pages`
- Under **Build and deployment**, select **Source** = `GitHub Actions`
- After the workflow finishes, your site will be available at `https://<your-username>.github.io/<repo>/`

### Development

- **Install dependencies**

```bash
npm install
```

- **Run in development mode**

```bash
npm run dev
```

Then open the printed localhost URL in a browser (or configure it as the URL of your Telegram Web App).
