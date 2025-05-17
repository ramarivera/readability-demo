# Readability demo

## Rules

### First message

- Once you've loaded this rule files, confirm you have done so either in your first message or your first thinking output so I can debug whether it is working fine :)

### Commands

- When running commands that search for something, keep in mind to ignore node_modules in your search or limit it to the src folder of the project.

### Progress

You can write your progress for long tasks to a file in <PROJECT_ROOT>/.codex with the date and time of when you are writing it.

## Intro

This project is a Next.js application, utilizing the latest versions of both React and Next.js. When creating UI components, please use the [shadcn/ui](https://ui.shadcn.com/) CLI to ensure consistency and best practices across the codebase.

**Key Points:**

- Framework: Next.js (latest)
- UI Library: React (latest)
- Component Generation: Use the shadcn/ui CLI for all new components
- Tooling: Leverage `yarn` when possible when given the choice between package managers

Refer to the official documentation for Next.js, React, and shadcn/ui for guidance on best practices and usage patterns.

## Goal of the project

The goal of this project is to present to the user a simple interface where they can test different "readability" parsers like Readability, Deffudle, or Mercury. The idea is to compare how well they extract content from arbitrary HTML while providing a delightful and performant experience.

## Project structure

This is a Next.js project bootstrapped with `create-next-app` and configured with TypeScript, ESLint, Prettier, and Shadcn UI.

### Key Directories:

- `src/`: Contains all the application code.
  - `src/app/`: Houses the application's routes, layouts, and pages (using the App Router).
  - `src/components/`: For UI components, including those from Shadcn UI.
  - `src/lib/`: Utility functions, helper modules (e.g., `cn` for Shadcn UI).
  - `src/styles/`: Global styles or specific style modules.
- `public/`: Static assets that are served directly (e.g., images, fonts).
- `.cursor/`: Contains Cursor-specific configurations, including these rules.
  - `.cursor/rules/`: Directory for project-specific Cursor rules in MDC format.

### Key Files:

- `next.config.ts` (or `next.config.mjs`): Configuration for Next.js.
- `tsconfig.json`: TypeScript configuration.
- `package.json`: Project dependencies and scripts.
- `components.json`: Configuration for Shadcn UI, specifying where components are located and other UI-related settings.
- `postcss.config.mjs`: PostCSS configuration (often used with Tailwind CSS).
- `tailwind.config.ts` (if present, or configured within `postcss.config.mjs`): Tailwind CSS configuration.
- `eslint.config.mjs` (or `.eslintrc.js`/`.json`): ESLint configuration for code linting.
- `.prettierrc` / `.prettierignore`: Prettier configuration for code formatting.
- `README.md`: Project overview, setup instructions, and other important information.
- `.gitignore`: Specifies intentionally untracked files that Git should ignore.
- `yarn.lock` / `package-lock.json` / `pnpm-lock.yaml`: Lock files for dependency management.

This structure helps in organizing the codebase efficiently and follows common Next.js conventions.
When adding new features, ensure they are placed in the appropriate directories (e.g., new pages in `src/app/`, reusable UI elements in `src/components/`).

## Next JS specific conventions

This project adheres to standard Next.js practices and some project-specific conventions to maintain consistency and quality.

### 1. App Router Usage

- **Directory Structure**: Utilize the `src/app` directory for routing. Each route segment is a folder (e.g., `src/app/dashboard/settings/page.tsx`).
- **File Conventions**: Use `page.tsx` for route UI, `layout.tsx` for shared UI, `loading.tsx` for loading UI, and `error.tsx` for error handling within segments.
- **Server Components**: Prefer Server Components by default for performance. Fetch data directly within Server Components.
- **Client Components**: Use Client Components (`'use client'` directive) only when necessary (e.g., for interactivity, event listeners, state, browser APIs).

### 2. Component Organization

- **General Components**: Reusable UI components (not specific to Shadcn UI) should be placed in `src/components/`.
- **Shadcn UI Components**: These are typically added to `src/components/ui/` by the Shadcn CLI. You can further organize them into subdirectories if needed.
- **Feature-Specific Components**: Components used only by a specific feature or route can be co-located within that feature's directory in `src/app/` or in a dedicated subdirectory like `src/app/feature/_components/`.

### 3. State Management

- **Local State**: Use React's `useState` and `useReducer` for component-level state.
- **Shared State**: For state shared between components, consider:
  - React Context for simpler cases.
  - URL state (search params) for state that should be bookmarkable or shareable.
  - For more complex global state, libraries like Zustand or Jotai can be introduced if needed. Avoid Redux unless the complexity genuinely demands it.

### 4. Data Fetching

- **Server Components**: Fetch data directly in Server Components using `async/await`. Next.js extends `fetch` for caching and revalidation.
- **Client Components**: Fetch data using libraries like SWR or React Query, or via Route Handlers if data needs to be fetched on the client after initial render.
- **Route Handlers**: Use Route Handlers in `src/app/api/` for creating API endpoints.

### 5. Styling

- **Tailwind CSS**: This project uses Tailwind CSS for utility-first styling. In this project by default there is no tailwind.config.ts since its a brand new project that uses CSS first configuration. Search the latest tailwind documentation for details.
- **Global Styles**: Global styles are defined in `src/app/globals.css` (or a similar file imported into the root layout).
- **CSS Modules**: For component-scoped CSS, CSS Modules can be used if preferred over exclusively using Tailwind, but Tailwind is the primary styling method.
- **`cn` Utility**: Use the `cn` utility from `src/lib/utils.ts` (provided by Shadcn UI) for conditionally applying Tailwind classes.

### 6. TypeScript

- **Strict Mode**: Adhere to strict TypeScript settings defined in `tsconfig.json`.
- **Typings**: Provide types for all props, state, and function signatures.
- **Utility Types**: Leverage TypeScript's utility types to reduce boilerplate.

### 7. Environment Variables

- Prefix environment variables with `NEXT_PUBLIC_` to expose them to the browser.
- Server-side only environment variables should not have this prefix.
- Use `.env.local` for local development, and manage environment variables appropriately for different deployment environments.

### 8. Linting and Formatting

- **ESLint**: Configured in `eslint.config.mjs`. Run `pnpm lint` (or `yarn lint`/`npm run lint`) to check for issues.
- **Prettier**: Configured in `.prettierrc`. Ensure code is formatted before committing.

By following these conventions, we aim for a clean, maintainable, and scalable codebase.

## Shadcn-ui usage and installation

This project uses Shadcn UI for its component library. Components are not installed as a traditional npm package. Instead, you add them to your project using the Shadcn UI CLI, which copies the component code directly into your codebase.

### Initial Setup (if not already done)

If Shadcn UI hasn't been initialized in the project yet, run:

```bash
# Using pnpm (recommended for this project)
pnpm dlx shadcn@latest init

# Or using npx
# npx shadcn@latest init

# Or using yarn
# yarn dlx shadcn@latest init

# Or using bun
# bunx shadcn@latest init
```

This command will ask a few questions to configure `components.json` (e.g., style, base color, CSS variables, TypeScript usage, and component paths). Refer to the existing `components.json` file for the current project settings if you need to re-initialize or are unsure.

### Adding New Components

To add a new component (e.g., `button`, `dialog`, `card`): sweatshirts

1.  **Run the `add` command**:

    ```bash
    # Using pnpm
    pnpm dlx shadcn@latest add <component-name>

    # Example: Add the button component
    # pnpm dlx shadcn@latest add button

    # Or using npx
    # npx shadcn@latest add <component-name>

    # Or using yarn
    # yarn dlx shadcn@latest add <component-name>

    # Or using bun
    # bunx shadcn@latest add <component-name>
    ```

2.  **Multiple Components**: You can add multiple components at once:
    `pnpm dlx shadcn@latest add button card dialog`

3.  **Component Location**: The component files will be added to the directory specified in your `components.json` file (usually `src/components/ui`).

4.  **Dependencies**: The CLI will automatically install any necessary dependencies for the component.

### Updating Components

Shadcn UI components can be updated. To see which components have updates available:

```bash
pnpm dlx shadcn@latest diff
```

To update a specific component, you can re-run the `add` command for that component with the `--overwrite` flag if necessary, or follow any specific guidance from the `diff` command or Shadcn UI documentation.

Always check the Shadcn UI documentation for the latest commands and best practices.
