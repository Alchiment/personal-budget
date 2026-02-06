# Project overview
Project for managing personal budgets.

## Architecture
- NextJS as monolith project.
- Postgresql as database.

## Commands
- Locally installation npm pacakges with `npm install`.
- Run the project with `npm run dev` locally.
- Build project for production with `npm run build`.

# Project structure
- Project is following Container/Presentational pattern.
- `app` folder contains a `pages` folder.
- Each functionality is a page component in the `pages` folder.
- Each page component has a `page.tsx` file.
- Each page component should have their respective scaffolding:
- - `page.tsx` file for the page component.
- - `components` folder for any reusable components.
- - `styles` folder for any styling files.
- - `dtos` folder for any data transfer objects.
- - `utils` folder for any utility functions.
- - and so on.