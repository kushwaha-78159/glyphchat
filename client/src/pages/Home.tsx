import { useMemo, useState } from "react";
import {
  Bell, Check, Copy, Hash, Info, LockKeyhole, Menu, Paperclip,
  Phone, Plus, Search, Send, Settings2, Smile, Sparkles, Timer, Unlock, Video, X,
} from "lucide-react";

const alphabet = [
  ["A", "◆"], ["B", "◇"], ["C", "●"], ["D", "○"], ["E", "■"], ["F", "□"],
  ["G", "▲"], ["H", "△"], ["I", "★"], ["J", "☆"], ["K", "✦"], ["L", "✧"],
  ["M", "✚"], ["N", "✜"], ["O", "✖"], ["P", "✕"], ["Q", "⬟"], ["R", "⬢"],
  ["S", "⬣"], ["T", "⬡"], ["U", "◈"], ["V", "⬥"], ["W", "⬦"], ["X", "⬧"],
  ["Y", "⬨"], ["Z", "⬩"],
] as const;

const letterToSymbol: Record<string, string> = Object.fromEntries(alphabet);
const symbolToLetter: Record<string, string> = Object.fromEntries(alphabet.map(([letter, symbol]) => [symbol, letter]));
export const DECRYPT_DISPLAY_MS = 120000;

export function encodeText(value: string) {
  return value.toUpperCase().split("").map((character) => letterToSymbol[character] ?? character).join("");
}

export function decodeSymbols(value: string) {
  return value.split("").map((character) => symbolToLetter[character] ?? character).join("");
}

type Message = { id: number; text: string; encoded: string; mine?: boolean; time: string };
const initialMessages: Message[] = [
  { id: 1, text: "Hey! The new alphabet feels so good.", encoded: encodeText("Hey! The new alphabet feels so good."), time: "10:41" },
  { id: 2, text: "Right? Send me a secret test.", encoded: encodeText("Right? Send me a secret test."), mine: true, time: "10:42" },
  { id: 3, text: "Meet me at 7 tonight ✨", encoded: encodeText("Meet me at 7 tonight ✨"), time: "10:43" },
];

const friends = [
  { name: "Maya Chen", initials: "MC", color: "coral", status: "online", preview: "△■■✧◈ · ✚★✧✧…", time: "10:43", active: true },
  { name: "Arjun Kapoor", initials: "AK", color: "blue", status: "typing…", preview: "◆⬢■ · ◈✧✧ · ◆", time: "09:18" },
  { name: "Sofia Alvarez", initials: "SA", color: "violet", status: "last seen 2h ago", preview: "★☆ · ⬢✧✧⬥", time: "Yesterday" },
  { name: "Leo Martin", initials: "LM", color: "green", status: "last seen yesterday", preview: "⬦■ · ⬣⬢⬢", time: "Yesterday" },
];

function Avatar({ initials, color, size = "md" }: { initials: string; color: string; size?: "sm" | "md" }) {
  return <div className={`avatar avatar-${color} avatar-${size}`}>{initials}</div>;
}
function AppLogo() { return <div className="app-logo"><span>◆</span><span>✦</span><span>⬡</span></div>; }

export default function Home() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [activePanel, setActivePanel] = useState<"chat" | "alphabet">("chat");
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDecoder, setShowDecoder] = useState(false);
  const [decoderInput, setDecoderInput] = useState("△■✧✧✖ · ⬥◈⬢✧");
  const [decryptedIds, setDecryptedIds] = useState<Record<number, boolean>>({});

  const visibleFriends = useMemo(() => friends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery]);

  function sendMessage() {
    if (!draft.trim()) return;
    const plainText = draft.trim();
    setMessages((current) => [...current, {
      id: Date.now(), text: plainText, encoded: encodeText(plainText), mine: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setDraft("");
  }

  function decryptMessage(messageId: number) {
    setDecryptedIds((current) => ({ ...current, [messageId]: true }));
    window.setTimeout(() => {
      setDecryptedIds((current) => {
        const next = { ...current };
        delete next[messageId];
        return next;
      });
    }, DECRYPT_DISPLAY_MS);
  }
  async function copyValue(value: string, label: string) {
    try { await navigator.clipboard?.writeText(value); } catch { /* preview fallback */ }
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1200);
  }

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-lockup"><AppLogo /><div><div className="brand-name">glyph<span>chat</span></div><div className="brand-tagline">Speak beyond words</div></div></div>
      <div className="topbar-actions"><button className="icon-button mobile-only" aria-label="Open navigation" onClick={() => setShowMobileNav(true)}><Menu size={20} /></button><div className="security-pill"><LockKeyhole size={14} /> End-to-end encrypted</div><button className="icon-button" aria-label="Notifications"><Bell size={19} /><span className="notification-dot" /></button><Avatar initials="RK" color="ink" size="sm" /></div>
    </header>

    <main className="workspace">
      <aside className={`sidebar ${showMobileNav ? "sidebar-open" : ""}`}>
        <div className="sidebar-mobile-head"><span>Messages</span><button className="icon-button" onClick={() => setShowMobileNav(false)}><X size={19} /></button></div>
        <div className="sidebar-heading"><div><p className="eyebrow">Your space</p><h1>Messages</h1></div><button className="new-chat-button" aria-label="New chat"><Plus size={18} /></button></div>
        <div className="search-box"><Search size={16} /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search conversations" /></div>
        <div className="conversation-list"><div className="list-label">Recent chats <span>{visibleFriends.length}</span></div>
          {visibleFriends.map((friend) => <button key={friend.name} className={`conversation ${friend.active ? "active" : ""}`} onClick={() => setShowMobileNav(false)}><Avatar initials={friend.initials} color={friend.color} /><div className="conversation-copy"><div className="conversation-name"><strong>{friend.name}</strong><time>{friend.time}</time></div><div className={`conversation-preview ${friend.status === "typing…" ? "typing" : ""}`}>{friend.preview}</div></div>{friend.active && <span className="unread-dot" />}</button>)}
          {visibleFriends.length === 0 && <div className="empty-search">No matching chats</div>}
        </div>
        <div className="sidebar-footer"><button className="sidebar-action"><Settings2 size={17} /> Preferences</button><button className="sidebar-action"><Info size={17} /> How GlyphChat works</button></div>
      </aside>

      <section className="chat-panel">
        <div className="chat-header"><div className="chat-person"><Avatar initials="MC" color="coral" /><div><h2>Maya Chen <span className="verified">✦</span></h2><p><span className="online-indicator" /> Online · using Glyph alphabet</p></div></div><div className="chat-header-actions"><button className="icon-button" aria-label="Start video call"><Video size={19} /></button><button className="icon-button" aria-label="Start phone call"><Phone size={18} /></button><button className="icon-button" aria-label="Chat details"><Info size={19} /></button></div></div>
        <div className="mobile-tabs"><button className={activePanel === "chat" ? "selected" : ""} onClick={() => setActivePanel("chat")}>Conversation</button><button className={activePanel === "alphabet" ? "selected" : ""} onClick={() => setActivePanel("alphabet")}>Alphabet</button></div>
        <div className={`chat-body ${activePanel === "alphabet" ? "mobile-hide-chat" : ""}`}>
          <div className="date-divider"><span>Today, September 7</span></div>
          <div className="protocol-note"><Sparkles size={14} /><span>Messages are encoded with the <strong>Glyph-26</strong> alphabet</span><button onClick={() => setShowDecoder((value) => !value)}>{showDecoder ? "Hide decoder" : "Try decoder"}</button></div>
          {showDecoder && <div className="decoder-card"><div className="decoder-label"><span>Symbol decoder</span><span className="decoder-live"><span /> live</span></div><input value={decoderInput} onChange={(event) => setDecoderInput(event.target.value)} /><div className="decoder-result">{decodeSymbols(decoderInput) || "Type symbols to decode"}</div></div>}
          <div className="messages">{messages.map((message) => <div key={message.id} className={`message-row ${message.mine ? "mine" : ""}`}>{!message.mine && <Avatar initials="MC" color="coral" size="sm" />}<div className="message-stack"><div className="message-bubble"><div className="encoded-message"><span className="encoded-lock"><LockKeyhole size={12} /> encrypted</span><strong>{message.encoded}</strong></div>{decryptedIds[message.id] ? <div className="decrypted-message"><span><Unlock size={11} /> decrypted for 2 min</span><p>{message.text}</p></div> : <button className="decrypt-button" onClick={() => decryptMessage(message.id)}><Unlock size={12} /> Decrypt message <Timer size={12} /></button>}<div className="encoded-line"><span>Tap decrypt to reveal English</span><button aria-label="Copy encrypted message" onClick={() => copyValue(message.encoded, String(message.id))}>{copied === String(message.id) ? <Check size={13} /> : <Copy size={13} />}</button></div></div><div className="message-meta">{message.time}{message.mine && <><span>·</span><Check size={13} className="read-check" /><Check size={13} className="read-check second" /></>}</div></div></div>)}</div>
        </div>
        <div className="composer-wrap"><div className="composer-mode"><span>Writing in</span><span className="english-mode"><span className="mode-dot" /> English</span><span className="mode-hint">will encrypt on send</span></div><div className="composer"><button className="composer-icon" aria-label="Attach file"><Paperclip size={19} /></button><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Write in English…" /><button className="composer-icon" aria-label="Add emoji"><Smile size={19} /></button><button className="send-button" aria-label="Send encrypted message" onClick={sendMessage}><Send size={18} /></button></div><div className="symbol-keyboard"><div className="keyboard-head"><span><Hash size={14} /> English keyboard</span><span>type normally · encrypts on send</span></div><div className="keys">{alphabet.map(([letter, symbol]) => <button key={letter} className="key" title={`Insert ${letter}`} onClick={() => setDraft((value) => value + letter)}><span>{letter}</span><small>{symbol}</small></button>)}</div></div></div>
      </section>

      <aside className={`alphabet-panel ${activePanel === "alphabet" ? "mobile-show-alphabet" : ""}`}><div className="alphabet-heading"><div><p className="eyebrow">Your language</p><h2>Glyph-26</h2></div><span className="live-badge"><span /> Active</span></div><p className="alphabet-intro">A simple, shared visual alphabet. Each glyph maps to one letter, so your friends can read every message instantly.</p><div className="example-card"><div className="example-top"><span>Quick example</span><Sparkles size={15} /></div><div className="example-line"><strong>HELLO</strong><span className="example-arrow">↓</span><span className="example-glyphs">△■✧✧✖</span></div><div className="example-caption">Plain text → encoded symbols</div></div><div className="alphabet-title-row"><h3>26 glyphs</h3><button onClick={() => copyValue(alphabet.map(([, symbol]) => symbol).join(""), "alphabet")}>{copied === "alphabet" ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy set</>}</button></div><div className="alphabet-grid">{alphabet.map(([letter, symbol]) => <button key={letter} className="alphabet-cell" onClick={() => copyValue(`${letter} = ${symbol}`, letter)}><span className="cell-symbol">{symbol}</span><span className="cell-letter">{letter}</span></button>)}</div><div className="alphabet-footer"><LockKeyhole size={15} /><span>Your mapping is shared only with the people you invite.</span><span className="footer-arrow">↗</span></div></aside>
    </main>
    <footer className="page-footer"><span>GlyphChat prototype</span><span><span className="footer-dot" /> Built for close friends</span><span>v0.1 · Glyph-26</span></footer>
  </div>;
}
