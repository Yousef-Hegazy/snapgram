# Snapgram

![Snapgram Logo](public/icons/home.svg)

Welcome to Snapgram, a modern social media application inspired by Instagram! Snapgram allows users to share photos, follow friends, and discover new content in a sleek, user-friendly interface.

## Features

- **User Authentication**: Secure sign-up and sign-in using Appwrite.
- **Post Creation**: Upload and share images with captions.
- **User Profiles**: View and edit personal profiles, see followers and following.
- **Explore Feed**: Discover posts from all users.
- **Saved Posts**: Save favorite posts for later viewing.
- **Real-time Interactions**: Like, comment, and share posts.
- **Responsive Design**: Optimized for desktop and mobile devices.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Routing**: TanStack Router
- **State Management**: TanStack Query for data fetching
- **Backend**: Appwrite (database, authentication, storage)
- **Styling**: Tailwind CSS, Shadcn UI components
- **Linting & Formatting**: ESLint, Prettier
- **Testing**: Vitest

## Getting Started

To run this application locally:

```bash
npm install
npm run start
```

Make sure you have Appwrite set up and configured in `src/appwrite/config.ts`.

## Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling, with custom components from [Shadcn](https://ui.shadcn.com/).

## Linting & Formatting

This project uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for linting and formatting. ESLint is configured using [TanStack ESLint config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```

## Environment Variables

Environment variables are managed with T3Env for type safety. Add variables to `src/env.ts` and use them in your code.

Example:

```ts
import { env } from "@/env";

console.log(env.VITE_APPWRITE_URL);
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are defined in `src/routes/`.

### Adding a Route

Add a new file in `./src/routes` to create a new route. TanStack Router will auto-generate the route content.

### Navigation

Use the `Link` component from `@tanstack/react-router` for SPA navigation:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/profile">Profile</Link>
```

## Data Fetching

Data is fetched using TanStack Query, integrated with Appwrite services. Queries and mutations are defined in `src/lib/react-query/`.

## State Management

Global state is managed with React Context, particularly for authentication in `src/context/AuthContext.tsx`.

## Appwrite Integration

Snapgram uses Appwrite for backend services:
- Database: Store user and post data
- Authentication: User sign-up/sign-in
- Storage: Upload and serve images

Configure your Appwrite instance in `src/appwrite/config.ts`.

## Contributing

Feel free to contribute to Snapgram! Follow the standard Git workflow: fork, branch, commit, pull request.

## License

This project is open-source. Check the license file for details.
