## Workout Journal Telegram Mini App

This project is a standalone React + Vite front-end (local state, no backend). **The main Telegram workout app is developed in the [workout-telegram](https://github.com/pavelyampolskiy/workout-telegram) repository** (bot + API + webapp). Use that repo for the live Mini App; this one is for reference or alternate UI experiments.

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
