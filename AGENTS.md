# Repository Guidelines

## Project Structure & Module Organization
`src/` contains the application. Put page-level views in `src/views/`, shared UI in `src/components/`, API wrappers in `src/api/`, state in `src/store/`, routing in `src/router/`, and reusable helpers in `src/utils/`. Global styles live in `src/styles/`; SVG icons are under `src/icons/svg/` and static assets under `src/assets/`. Public files such as the favicon stay in `public/`. Build output is generated in `dist/` and should not be edited manually.

## Build, Test, and Development Commands
Use `npm run dev` to start the Vite dev server. Use `npm run build:dev` for a development-mode build and `npm run build:prod` for a production bundle. Run `npm run lint` before opening a PR; it checks `.js` and `.vue` files under `src/`. Use `npm run svgo` after changing files in `src/icons/svg/` to normalize SVG assets.

## Coding Style & Naming Conventions
Follow `.editorconfig`: 2-space indentation, trim trailing whitespace, and end files with a newline. ESLint enforces single quotes, no semicolons, spaced blocks, and `eqeqeq`. Keep Vue single-file components in PascalCase for shared components such as `NavBar.vue`; view entry files commonly use `index.vue` inside feature folders like `src/views/order/confirm/index.vue`. Use camelCase for JavaScript variables and functions, and keep API modules grouped by domain, for example `src/api/order.js`.

## Testing Guidelines
There is currently no dedicated automated test suite or `npm test` script. At minimum, run `npm run lint`, verify the affected route in the local dev server, and smoke-test mobile flows tied to your change. If you add tests, place them close to the feature or in a clearly named `tests/` directory and document the command in `package.json`.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit messages in Chinese, often with a scope prefix such as `feat(注册): 新增用户注册页面及图标资源` or concise summaries like `代码优化`. Keep commits focused and describe the user-visible change. PRs should include a brief summary, affected screens or modules, linked issues when available, and screenshots or GIFs for UI work.

## Configuration Tips
Environment files live at `.env.development` and `.env.production`. Do not commit secrets. When changing request behavior or deployment settings, review both `vite.config.js` and `src/utils/request.js` to keep local and production behavior aligned.
