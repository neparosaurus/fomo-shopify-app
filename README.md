# Fomo Toast Shopify app

## Install

Build docker containers:

#### `docker-compose up -d --build`

In the project's root directory run the following commands:

#### `docker exec -it fomo-php composer install`
#### `docker exec -it fomo-php npm install`

Create `.env` file and add necessary data as in `.env.example`. 

Open [http://localhost](http://localhost) to view it in your browser.

## Front-end

All files are located in `/app/assets/` with `app.js` as entrypoint.

### Build

In order to build front-end, run `npm run dev` or `npm run build`