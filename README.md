# Encrypt Chatboad — Symbol Language Messenger

Encrypt Chatboad is a mobile-first chat interface prototype using the final **Glyph-26** alphabet: 26 unique geometric symbols mapped one-to-one to A–Z.

## Encode / decode logic

The browser keeps two lookup tables:

```ts
const letterToSymbol = Object.fromEntries(alphabet);
const symbolToLetter = Object.fromEntries(alphabet.map(([letter, symbol]) => [symbol, letter]));

function encodeText(value: string) {
  return value.toUpperCase().split("").map((character) => letterToSymbol[character] ?? character).join("");
}

function decodeSymbols(value: string) {
  return value.split("").map((character) => symbolToLetter[character] ?? character).join("");
}
```

Example: `HELLO` → `△■✧✧✖`. Decoding `△■✧✧✖` gives `HELLO`. Spaces, punctuation, numbers and emoji remain unchanged.

## Final Glyph-26 mapping

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

## Prototype features

- WhatsApp-inspired three-column desktop layout
- Responsive mobile layout with drawer navigation and Chat/Alphabet tabs
- 26-key Glyph keyboard
- Plain-text composer mode that encodes on send
- Symbol composer mode that decodes on send
- Live decoder example
- Copy encoded message and copy alphabet controls
- Sample friend list, active chat, message status and encryption UI

## Run locally

```bash
pnpm dev
```

The current project is a website prototype. Production messaging still needs persistent message tables, real-time delivery (WebSockets or a managed realtime layer), user invitations, push notifications, moderation/reporting, and a thoroughly reviewed end-to-end encryption protocol. For Google Play, the responsive product should be packaged as a native Android/Expo client and then tested and published through Google Play Console; this website alone is not a Play Store submission.

## Latest interaction flow

Encrypt Chatboad composer always uses an English keyboard. On send, the plain message is converted to Glyph-26 symbols and the bubble shows only the encrypted-looking symbol string. A recipient can select **Decrypt once**; the original English text appears in a small line underneath for exactly 10 seconds, then disappears and the same message becomes permanently locked for that session. Friend discovery is designed around `@username` search, and the entry screen uses the existing project OAuth flow behind a Gmail-styled sign-in action.
