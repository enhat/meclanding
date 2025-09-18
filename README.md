This is a [Next.js](https://nextjs.org) project.

## Getting Started (Windows)

### 1. Install Node.js

- Download: https://nodejs.org
- Pick **LTS (Recommended)**, run the installer, accept defaults.
- (Node installs `npm` too.)

### 2. Open the project folder

Open **Command Prompt** or **PowerShell**, then run (example): cd
C:\Users\YourName\Desktop\project-folder

### 3. Install packages

    npm install

### 4. Run the dev server

    npm run dev

Open http://localhost:3000 in your browser. Stop the server with **Ctrl + C**.

### 5. Change code

Using a code or text editor, navigate under src/config. The config files are
written in json, and the page uses the values in the json file to render the
page. Once you make changes, you can save, and the website in your browser
should automatically update with the changes. Once you are happy with your
changes and want to deploy to production, read the workflow section below.

---

## Publish to Github

Create a new empty repo on GitHub

Open the **Command Prompt** to the project folder (the parent folder of the src
folder), and then run the following commands.

    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/USERNAME/REPO.git
    git push -u origin main

---

## Deploy on Vercel

1. Sign in / create account: https://vercel.com/signup
2. Click New Project → Import Git Repository.
3. Connect your GitHub account and authorize Vercel.
4. Select the repo you pushed.
5. Use defaults (Vercel auto-detects Next.js). Click Deploy.
6. After build, Vercel gives a live URL like https://your-project.vercel.app.

---

## Adding your domain

1. Open Vercel → pick your **project**.
2. Go to the **Domains** section (or **Settings → Domains**).
3. Click **Add** (or **Add Domain**).
4. Type the domain (example: `yourdomain.com`) and confirm.

Vercel will show required DNS steps for that domain.

---

## Updating Workflow

1. Navigate to src/config and use your text/code editor to make changes to the
   json files
2. Run the dev server (instructions above) and navigate to localhost to see
   changes
3. As you continue to make changes and save, the website should automatically
   update to reflect those changes

### Push

Once you are satisfied push to github

    git add .
    git commit -m "Describe your changes here"
    git push

Once you have done this, vercel should auto-deploy on each push to the connected
branch (main by default). You can navigate to https://vercel.com and click on
your project to see if the build failed (which it shouldn't, and if it does,
then you should probably contact me: anhatnguyen.work@gmail.com)

---

## Links / Docs

- Next.js docs: https://nextjs.org/docs
- Deploy Next.js on Vercel:
  https://nextjs.org/docs/app/building-your-application/deploying
- Node.js downloads: https://nodejs.org
