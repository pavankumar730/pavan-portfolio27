# Pavan Kumar — Portfolio

Personal portfolio website of Dandaveni Pavan Kumar, a B.Tech Data Science student (class of 2027) in Hyderabad. It covers education, toolkit, job simulations, projects, certifications, achievements, ambitions and contact details.

Plain HTML, CSS and JavaScript. No build step and no dependencies.

## Features

- Single-page layout with a sticky section menu
- Animated regression sketch in the hero (drawn on a canvas)
- Light and dark themes, following the system setting with a manual toggle
- Responsive from phone to desktop
- Copy buttons for email and phone

## Project structure

```
pavan-portfolio27/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## Run locally

Open `index.html` in a browser. Fonts load from Google Fonts, so an internet connection gives the intended look.

## Publish with GitHub Pages

1. Push this folder to the repository (commands below).
2. On GitHub, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. After a minute the site is live at `https://pavankumar730.github.io/pavan-portfolio27/`.

## Push to GitHub

Run these from inside the project folder:

```bash
git init
git add .
git commit -m "Add portfolio website"
git branch -M main
git remote add origin https://github.com/pavankumar730/pavan-portfolio27.git
git push -u origin main
```

If the repository already has a README or other files, run `git pull origin main --allow-unrelated-histories` before the push.

## Customize

- **Text and sections:** edit `index.html`.
- **Colors and fonts:** change the variables at the top of `css/style.css` (the `:root` blocks hold the light and dark palettes).
- **Project links:** each project has a "GitHub" link in `index.html` that currently points to the profile page. Replace each `href` with the matching repository URL.
- **Hero sketch:** the points and line are generated in `js/script.js` and are an illustration, not project data.

## Contact

- Email: pp3421117@gmail.com
- LinkedIn: https://www.linkedin.com/in/pavan-kumar-d8p9a6
- GitHub: https://github.com/pavankumar730
