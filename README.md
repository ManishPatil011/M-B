# Bharath & Madhushri Wedding Invitation

A responsive wedding invitation website for the celebration of Bharath and Madhushri on 5-6 December 2026.

## Features

- Interactive opening envelope and optional wedding music
- Wedding countdown for 5 December 2026
- Reception and Muhurtham schedule
- Venue details with an embedded Google Map
- Family and gallery photo sections
- Downloadable `.ics` calendar invitation
- Responsive layout, reduced-motion support, and protected gallery images
- Animated transitions powered by Framer Motion

## Tech Stack

- React 19
- Create React App with CRACO
- Tailwind CSS
- Framer Motion
- Radix UI
- Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer

### Installation

```powershell
npm install
```

### Start the Development Server

```powershell
npm run dev
```

Open `http://localhost:3000`. The page reloads automatically when source files change.

You can also use `npm start`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm start` | Start the development server |
| `npm test` | Run tests in watch mode |
| `npm run build` | Create the optimized production build in `build/` |

## Customizing the Invitation

The main event details are defined in `src/app.js`:

- Couple name and year
- Event dates and times
- Venue name, address, directions, and map URL
- Gallery images

Wedding photos and audio are stored in `public/` and can be replaced with files that use the same names.

```text
public/
├── music.mp3
├── ganesha.png
├── bouquet.jpg
├── groomfam.jpeg
├── bridefam.jpeg
└── <gallery and monogram images>
```

## Production Build

```powershell
npm run build
```

Deploy the contents of the generated `build/` directory to any static web host, such as GitHub Pages, Netlify, or Vercel.

Because the app uses public-root asset paths, configure the host at the domain root or set the appropriate base path before deployment.

## Project Structure

```text
public/                 Static images, map and audio assets
src/
├── app.js              Invitation content and application components
├── app.css             Application styles
├── entrance.css        Opening-envelope styles
├── index.css           Global styles
├── components/ui/      Reusable UI components
├── constants/          Test identifiers
├── hooks/              React hooks
└── lib/                Shared utilities
craco.config.js         CRA/CRACO and webpack configuration
tailwind.config.js      Tailwind configuration
```
