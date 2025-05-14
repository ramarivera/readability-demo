# ✨ Next.js & Shadcn UI Template ✨

[![Use this template](https://img.shields.io/badge/Use%20this%20template-GitHub-blue)](https://github.com/ramarivera/template-next-shadcn/generate)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/ramarivera/template-next-shadcn&project-name=my-app&repository-name=my-app)

This is a feature-rich [Next.js](https://nextjs.org) project template, supercharged with Shadcn UI, TypeScript, Tailwind CSS, and more, ready for you to build amazing applications! 🚀

## 🚀 Getting Started

To get your project up and running:

1. **Clone the template** (or use it as a template on GitHub).
2. **Install dependencies** using your preferred package manager:

   ```bash
   pnpm install
   # or
   yarn install
   # or
   npm install
   # or
   bun install
   ```

3. **Run the development server**:

   ```bash
   pnpm dev
   # or
   yarn dev
   # or
   npm run dev
   # or
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the initial page.

You can start editing the main page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file. 🪄

This template uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a versatile font family.

## 🛠️ Project Configuration

This project comes pre-configured with a modern development stack:

- 🔷 **TypeScript**
- 💨 **Tailwind CSS** (v4)
- 🎨 **Shadcn UI** (for beautiful, accessible UI components)
- ESLint & Prettier (for code linting & formatting)
- 🤖 **Cursor AI Rules** (for enhanced AI-assisted development)

### 🧹 Linting and Formatting

Keep your code clean and consistent:

- Lint your code: `pnpm lint` (or `yarn lint` / `npm run lint`)
- Automatically fix linting issues: `pnpm lint:fix`
- Format your code: `pnpm format`

### 🧩 Shadcn UI

[Shadcn UI](https://ui.shadcn.com/) components are added directly to your project via its CLI.

To add a new component (e.g., a `button`):

```bash
pnpm dlx shadcn@latest add button
```

Dive deeper with the `.cursor/rules/shadcn-ui-installation.mdc` rule for more details.

### 🤖 Cursor AI Rules

Enhance your development workflow with [Cursor AI Rules](https://docs.cursor.com/context/rules) located in the `.cursor/rules/` directory. These rules guide the AI, ensuring it understands your project's conventions and structure.

Key rules included:

- `project-structure.mdc`: 🗺️ Overview of the project's file and directory layout.
- `shadcn-ui-installation.mdc`: 🛠️ Instructions for adding and managing Shadcn UI components.
- `nextjs-conventions.mdc`: 📜 Best practices for Next.js development within this template.

Leverage these rules in Cursor chat (e.g., by typing `@project-structure`) or let the AI use them automatically.

## 📚 Learn More about Next.js

To learn more about the power of Next.js, check out these resources:

- [Next.js Documentation](https://nextjs.org/docs) - Dive into Next.js features and its API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive tutorial to master Next.js.

The [Next.js GitHub repository](https://github.com/vercel/next.js) is also a great place for community support and contributions.

## ☁️ Deploy Your App

When you're ready to share your creation with the world, the [Vercel Platform](https://vercel.com/new?utm_medium=template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) (from the creators of Next.js) offers a seamless deployment experience.

For more deployment options and details, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
