# Encrypt Chatboad

**Encrypt Chatboad** is a mobile-first, WhatsApp-inspired messenger prototype built around the **Glyph-26** visual alphabet. Instead of displaying ordinary A–Z characters inside sent messages, the interface converts English text into 26 geometric symbols. A recipient can reveal the English text once for ten seconds; after the timer expires, that message is locked again for the current session.

> **Important security note:** The current website demonstrates the product interaction and symbol transformation. A substitution alphabet is not encryption by itself. Before handling real private conversations, production must add audited end-to-end encryption, server-side one-time-decrypt enforcement, secure key management, authentication hardening, abuse controls, and data-protection policies.

## Contents

1. [Product overview](#product-overview)
2. [Current features](#current-features)
3. [Message lifecycle](#message-lifecycle)
4. [Glyph-26 alphabet](#glyph-26-alphabet)
5. [Project architecture](#project-architecture)
6. [Repository structure](#repository-structure)
7. [Requirements](#requirements)
8. [Run locally](#run-locally)
9. [Run in GitHub Codespaces](#run-in-github-codespaces)
10. [Environment variables](#environment-variables)
11. [Commands](#commands)
12. [Authentication and Gmail-style entry](#authentication-and-gmail-style-entry)
13. [Username friend search](#username-friend-search)
14. [Testing and validation](#testing-and-validation)
15. [Production and Play Store roadmap](#production-and-play-store-roadmap)
16. [Known limitations](#known-limitations)
17. [References](#references)

## Product overview

The product name is **Encrypt Chatboad**. The interface uses a clean light messenger workspace with a Web3-inspired network indicator, a private identity panel, a Glyph-26 alphabet panel, an English composer, and encoded message bubbles. The responsive layout supports desktop and mobile widths.

The product currently contains a working frontend prototype backed by the WebDev full-stack template. The template includes Manus OAuth integration, tRPC, Drizzle database support, and server scaffolding. The current chat examples are local UI state; persistent friend accounts, real-time delivery, and production encryption are planned follow-up work.

## Current features

| Area | Current behavior |
|---|---|
| Product branding | Encrypt Chatboad wordmark, private-by-design tagline, metadata, and responsive branding |
| Login entry | Web3-inspired login screen with Gmail-styled “Continue with Gmail” action connected to the project OAuth flow |
| Chat layout | WhatsApp-inspired conversations sidebar, active chat, message status, and responsive mobile layout |
| Composer | Always uses an English keyboard and English text input |
| Encoding | English A–Z characters convert to the final Glyph-26 symbol mapping on send |
| Sent bubble | Displays the encoded symbol string instead of the original English text |
| Decryption | “Decrypt once” reveals the English message underneath the code |
| Decrypt timer | English text remains visible for exactly 10 seconds, then disappears |
| One-time rule | After the timer expires, the same message becomes “already viewed · locked again” for that session |
| Friend discovery | Sidebar search accepts names and `@username` handles such as `@maya.glyph` |
| Alphabet reference | Full 26-symbol Glyph-26 grid with copy controls and an example transformation |
| Responsive design | Desktop, tablet, and mobile layouts with mobile navigation and chat/alphabet tabs |
| Verification | Vitest tests, TypeScript validation, and production build are configured |

## Message lifecycle

The current client-side demonstration follows this flow:

1. The user types ordinary English text, for example `HELLO`, using the English composer.
2. When the user selects **Send**, `encodeText()` converts each A–Z character to its Glyph-26 symbol.
3. The bubble displays only the encoded string, for example `△■✧✧✖`.
4. The recipient selects **Decrypt once**.
5. The app reveals the original English text in a smaller line below the encoded string.
6. A ten-second timer starts immediately.
7. After ten seconds, the English text is removed from view and the message changes to a locked state.
8. Selecting decrypt again does nothing for that message during the current session.

The timer constant is defined in `client/src/lib/glyphConfig.ts`:

```ts
export const DECRYPT_DISPLAY_MS = 10000;
```

The production version must enforce this rule on the server as well. A browser-only timer can be bypassed by a malicious client and must not be treated as a security boundary.

## Glyph-26 alphabet

The final alphabet contains 26 unique geometric symbols. Spaces, punctuation, numbers, and emoji are preserved during encoding.

| Letter | Symbol | Letter | Symbol |
|---|---|---|---|
| A | ◆ | B | ◇ |
| C | ● | D | ○ |
| E | ■ | F | □ |
| G | ▲ | H | △ |
| I | ★ | J | ☆ |
| K | ✦ | L | ✧ |
| M | ✚ | N | ✜ |
| O | ✖ | P | ✕ |
| Q | ⬟ | R | ⬢ |
| S | ⬣ | T | ⬡ |
| U | ◈ | V | ⬥ |
| W | ⬦ | X | ⬧ |
| Y | ⬨ | Z | ⬩ |

### Encoding example

```text
Plain text:       HELLO
Encoded symbols:  △■✧✧✖
Decoded text:     HELLO
```

The core demonstration logic is:

```ts
const letterToSymbol = Object.fromEntries(alphabet);
const symbolToLetter = Object.fromEntries(
  alphabet.map(([letter, symbol]) => [symbol, letter]),
);

function encodeText(value: string) {
  return value
    .toUpperCase()
    .split("")
    .map((character) => letterToSymbol[character] ?? character)
    .join("");
}

function decodeSymbols(value: string) {
  return value
    .split("")
    .map((character) => symbolToLetter[character] ?? character)
    .join("");
}
```

This transformation is a **substitution mapping**, not cryptographic encryption. It is useful for the visual language experience but must be combined with real encryption for private communication.

## Project architecture

The project uses a React and TypeScript frontend served by an Express-based WebDev runtime. The full-stack scaffold provides tRPC contracts, Manus OAuth hooks, Drizzle schema support, MySQL/TiDB connectivity, and server-side environment handling.

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React 19, TypeScript, Vite | Messenger UI, keyboard, encoding display, decrypt interaction |
| Styling | Tailwind CSS 4 plus project CSS | Responsive layout, Web3 login treatment, wordmark, message states |
| Icons | lucide-react | Interface icons and status indicators |
| API contract | tRPC 11 | Typed frontend/server procedures |
| Server | Express 4 and Node.js | Runtime, OAuth callback, API gateway, production serving |
| Authentication | Manus OAuth template flow | Session-aware login entry and user identity state |
| Database layer | Drizzle ORM with MySQL/TiDB support | Future users, friendships, conversations, and messages |
| Validation | Vitest and TypeScript | Codec tests, type safety, and build checks |

## Repository structure

```text
.
├── client/
│   ├── index.html                 # Browser title and metadata
│   └── src/
│       ├── _core/hooks/useAuth.ts # Session and login state hook
│       ├── components/            # Shared UI and template components
│       ├── contexts/              # Theme context
│       ├── lib/
│       │   ├── glyphConfig.ts     # Ten-second decrypt duration
│       │   └── trpc.ts             # Typed tRPC client
│       ├── pages/
│       │   └── Home.tsx           # Encrypt Chatboad experience and codec demo
│       ├── App.tsx                # Router and application shell
│       └── index.css              # Global layout, branding, and responsive styles
├── drizzle/
│   └── schema.ts                  # Database schema entry point
├── server/
│   ├── _core/                     # Runtime and OAuth infrastructure
│   ├── db.ts                      # Drizzle database helpers
│   ├── routers.ts                 # tRPC procedures
│   ├── auth.logout.test.ts        # Authentication test
│   └── glyphchat.codec.test.ts    # Glyph codec and timer tests
├── shared/                        # Shared constants and types
├── package.json                   # Scripts and dependencies
├── pnpm-lock.yaml                 # Locked dependency versions
└── README.md                      # This documentation
```

## Requirements

The recommended development environment includes:

| Requirement | Recommended version or setup |
|---|---|
| Node.js | Node.js 22 or a compatible current LTS release |
| pnpm | pnpm 10; the repository declares a pnpm package manager version |
| Git | Required for cloning and version control |
| GitHub account | Required for GitHub Codespaces |
| Browser | A modern Chromium, Firefox, or Safari browser with cookies enabled |
| Project environment | Required server environment variables for authenticated or database-backed features |

## Run locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/<your-account>/<your-repository>.git
cd <your-repository>
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The server uses the project runtime and exposes the Vite preview through port `3000`. Open the local URL reported by the terminal. Do not hard-code the preview hostname because hosted development environments can assign a different URL.

Run the project checks:

```bash
pnpm test
pnpm check
pnpm build
```

The production server can be started after a successful build:

```bash
pnpm start
```

## Run in GitHub Codespaces

GitHub Codespaces provides a browser-based development container for the repository. The following commands work in a new Codespace terminal.

### 1. Create or open a Codespace

Open the repository on GitHub, select **Code**, select **Codespaces**, and create a new Codespace from the repository branch. After the VS Code web editor opens, open **Terminal → New Terminal**.

### 2. Verify the runtime

```bash
node --version
corepack --version
git --version
```

If pnpm is not available, enable Corepack and activate the repository-compatible version:

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm --version
```

### 3. Install dependencies

```bash
pnpm install
```

### 4. Configure Codespaces secrets

Do not commit `.env` files or credentials to GitHub. Add required values through the repository or Codespace secret settings, then expose them to the Codespace environment. The names are listed in [Environment variables](#environment-variables).

For a UI-only codec preview, the frontend can render without a working database. Authentication, OAuth callbacks, persistent users, and server-backed features require the corresponding environment variables.

### 5. Start the site

```bash
pnpm dev
```

When the terminal reports that the application is listening on port `3000`, open the **Ports** panel in Codespaces. Find port `3000`, choose **Open in Browser**, or change the port visibility according to your testing needs.

You can also inspect the forwarded port from the terminal with:

```bash
git status
pnpm check
```

### 6. Use a second terminal for checks

Keep `pnpm dev` running in the first terminal. Open a second terminal and run:

```bash
pnpm test
pnpm build
```

### 7. Stop the development server

In the terminal running `pnpm dev`, press:

```text
Ctrl + C
```

### 8. Save and push changes

```bash
git status
git add .
git commit -m "Update Encrypt Chatboad frontend"
git push origin main
```

Replace `main` with the branch you are using. Review `git diff` before committing:

```bash
git diff -- client/src/pages/Home.tsx client/src/index.css README.md
```

### 9. Rebuild from a clean dependency state

If the Codespace has stale dependencies or build artifacts, use:

```bash
rm -rf node_modules dist
pnpm install
pnpm check
pnpm test
pnpm build
```

Do not delete database data as part of a routine frontend cleanup. Database migrations and data operations require a deliberate backup and migration plan.

## Environment variables

The full-stack template reads environment values through `server/_core/env.ts`. Values may be injected by the managed WebDev runtime or supplied through Codespaces Secrets. Never commit secret values.

| Variable | Purpose | Required for |
|---|---|---|
| `DATABASE_URL` | MySQL/TiDB connection string | Persistent database features |
| `JWT_SECRET` | Session cookie signing secret | Authenticated production sessions |
| `VITE_APP_ID` | OAuth application identifier | Login flow |
| `OAUTH_SERVER_URL` | OAuth backend base URL | Server OAuth callback |
| `VITE_OAUTH_PORTAL_URL` | Frontend OAuth portal URL | Login redirect |
| `OWNER_OPEN_ID` | Project owner identity | Owner/admin initialization |
| `OWNER_NAME` | Project owner display name | Owner/admin initialization |
| `BUILT_IN_FORGE_API_URL` | Built-in server API base URL | Built-in server integrations |
| `BUILT_IN_FORGE_API_KEY` | Server-side built-in API key | Server-side integrations |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend built-in API base URL | Frontend integrations |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend integration key | Frontend integrations |

For a real Google/Gmail OAuth provider, configure the provider and redirect URI in the authentication service used by the deployment. The current UI presents a Gmail-styled entry action while using the project’s existing OAuth flow. It should not be described as a direct Google OAuth integration until Google credentials and provider configuration are installed and tested.

## Commands

| Command | Result |
|---|---|
| `pnpm install` | Installs locked dependencies |
| `pnpm dev` | Starts the development server with file watching |
| `pnpm test` | Runs the Vitest suite once |
| `pnpm check` | Runs TypeScript without emitting files |
| `pnpm build` | Builds the frontend and bundles the production server |
| `pnpm start` | Starts the production bundle after `pnpm build` |
| `pnpm format` | Formats repository files with Prettier |
| `pnpm db:push` | Generates and applies Drizzle migrations; use only with the correct database configuration |
| `git diff` | Reviews uncommitted changes |
| `git status` | Shows branch and working-tree state |

## Authentication and Gmail-style entry

The login screen uses the existing project `useAuth()` hook. When the visitor is unauthenticated, the app presents the Encrypt Chatboad login screen. Selecting **Continue with Gmail** calls the configured project login helper, which creates the OAuth state and redirects the browser.

The OAuth flow must preserve the existing nonce and cookie protections. Login URLs must use the browser origin rather than a hard-coded deployment hostname. The relevant callback path is:

```text
/api/oauth/callback
```

For a Play Store release, the native Android client will require its own OAuth redirect configuration and secure token storage. The web login flow cannot be copied into a mobile client without adapting the redirect and session model.

## Username friend search

The current sidebar search filters the demonstration friend list by display name and handle. Examples include:

```text
@maya.glyph
@arjun.k
@sofia.a
@leo.m
```

A production implementation should add a normalized username column with a uniqueness constraint, search rate limits, blocked-user filtering, friend request state, and privacy controls. Usernames should not expose email addresses by default.

## Testing and validation

The current suite covers:

- `HELLO` encoding to `△■✧✧✖`.
- Decoding `△■✧✧✖` back to `HELLO`.
- Preservation of spaces, punctuation, numbers, and emoji.
- Round-tripping all 26 letters through the final mapping.
- Enforcement of the ten-second decrypt display constant.
- Existing authentication logout behavior.

Run all validation commands before opening a pull request or creating a release build:

```bash
pnpm test
pnpm check
pnpm build
```

A successful build may still report a non-blocking bundle-size warning. Investigate bundle splitting separately from functional failures.

## Production and Play Store roadmap

The current repository is a web prototype and is not yet a complete public messaging service or Play Store submission. The recommended delivery sequence is:

| Phase | Work |
|---|---|
| 1. Product foundation | Add persistent users, unique usernames, friend requests, conversations, messages, read states, blocks, reports, and notification preferences |
| 2. Real-time messaging | Add a managed realtime channel or WebSocket service with reconnect handling and delivery receipts |
| 3. Security | Implement audited end-to-end encryption, device keys, key rotation, secure backup choices, abuse prevention, and server-side one-time-decrypt rules |
| 4. Authentication | Configure real Google OAuth credentials, account linking, session expiry, logout-all-devices, and mobile redirect URIs |
| 5. Native mobile | Create the Expo/React Native client, implement push notifications, deep links, secure local storage, camera/media permissions, and Android back behavior |
| 6. Quality | Add unit, integration, device, accessibility, and security tests; run closed testing with real Android devices |
| 7. Release | Prepare app icon, screenshots, privacy policy, data-safety answers, content rating, signing key, versioning, and Play Console release tracks |

Google Play publication requires a native Android artifact and Play Console configuration. The current responsive website is a foundation and does not itself create an Android App Bundle.

## Known limitations

The current demo has the following limitations:

1. The message list is local component state and is not shared between real users.
2. The symbol transformation is not cryptographic encryption.
3. The ten-second lock is currently a client-side interaction demonstration.
4. The friend list is sample data rather than a database-backed directory.
5. The Gmail-styled button uses the project OAuth flow; direct Google OAuth requires provider credentials and configuration.
6. Media upload, voice/video calls, push notifications, moderation, and account recovery are not yet implemented.
7. Unicode symbol rendering can vary by operating system and font. A production app should use a tested custom icon font or SVG glyph set.

## References

[1]: https://docs.github.com/en/codespaces "GitHub Codespaces documentation"

[2]: https://nodejs.org/en/docs "Node.js documentation"

[3]: https://pnpm.io/ "pnpm documentation"

[4]: https://developer.android.com/guide/app-bundle "Android App Bundle documentation"

[5]: https://support.google.com/googleplay/android-developer/ "Google Play Console Help"
