"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const transport = new DefaultChatTransport({ api: "/api/chat" });

const prompts = [
  "What is Mehmet's current role?",
  "Walk me through his career.",
  "What are his core technical skills?",
];

const SendIcon = () => (
  <svg
    aria-hidden="true"
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path d="M5 12h13M13 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export default function DigitalTwinPanel({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, status, error, regenerate, stop } = useChat({
    transport,
    throttle: 30,
  });
  const isBusy = status === "submitted" || status === "streaming";
  const lastMessage = messages.at(-1);
  const completedReply =
    status === "ready" && lastMessage?.role === "assistant"
      ? lastMessage.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("")
      : "";

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (distanceFromBottom < 140 || status === "submitted") {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, status]);

  useEffect(() => {
    if (status === "ready") {
      inputRef.current?.focus();
    }
  }, [status]);

  const close = () => {
    dialogRef.current?.close();
  };

  const submit = (text: string) => {
    const value = text.trim();

    if (!value || isBusy) {
      return;
    }

    void sendMessage({ text: value });
    setInput("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(input);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit(input);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      id="digital-twin-dialog"
      className="twin-panel"
      aria-labelledby="twin-title"
      aria-describedby="twin-description"
      onClose={onClose}
    >
      <header className="twin-header">
        <div className="twin-identity">
          <span className="twin-avatar">
            MK
            <i aria-hidden="true" />
          </span>
          <div>
            <p id="twin-title">MEHMET / DIGITAL TWIN</p>
            <span>
              <i className="twin-live-dot" aria-hidden="true" />
              CAREER AI · ONLINE
            </span>
          </div>
        </div>
        <button
          className="twin-close"
          type="button"
          onClick={close}
          aria-label="Close Digital Twin"
        >
          <span />
          <span />
        </button>
      </header>

      <div className="twin-messages" ref={messagesRef}>
        <div className="twin-message assistant">
          <span className="message-label">DIGITAL TWIN / 00</span>
          <div className="message-bubble" id="twin-description">
            I&apos;m Mehmet&apos;s AI Digital Twin. Ask me about his career
            journey, technical background, or leadership experience.
          </div>
        </div>

        {messages.map((message, messageIndex) => {
          const assistantNumber = messages
            .slice(0, messageIndex + 1)
            .filter((candidate) => candidate.role === "assistant").length;

          return (
            <div className={`twin-message ${message.role}`} key={message.id}>
              <span className="message-label">
                {message.role === "user"
                  ? "YOU"
                  : `DIGITAL TWIN / ${String(assistantNumber).padStart(2, "0")}`}
              </span>
              <div className="message-bubble">
                {message.parts.map((part, partIndex) =>
                  part.type === "text" ? (
                    <p key={`${message.id}-${partIndex}`}>{part.text}</p>
                  ) : null,
                )}
              </div>
            </div>
          );
        })}

        {status === "submitted" && (
          <div className="twin-message assistant">
            <span className="message-label">DIGITAL TWIN</span>
            <div className="twin-thinking" aria-label="Thinking">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {error && (
          <div className="twin-error" role="alert">
            <p>The Digital Twin couldn&apos;t answer that right now.</p>
            <button type="button" onClick={() => void regenerate()}>
              TRY AGAIN
            </button>
          </div>
        )}

        {messages.length === 0 && !error && (
          <div className="twin-prompts">
            <span>QUICK QUESTIONS</span>
            {prompts.map((prompt) => (
              <button type="button" key={prompt} onClick={() => submit(prompt)}>
                {prompt}
                <i aria-hidden="true">→</i>
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="twin-composer-wrap">
        <form className="twin-composer" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Ask about Mehmet's career..."
            aria-label="Message the Digital Twin"
            rows={1}
            maxLength={2000}
            readOnly={isBusy}
          />
          {isBusy ? (
            <button
              className="twin-send twin-stop"
              type="button"
              onClick={stop}
              aria-label="Stop response"
            >
              <span />
            </button>
          ) : (
            <button
              className="twin-send"
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          )}
        </form>
        <p>
          AI-GENERATED ANSWERS MAY BE INACCURATE. DO NOT SHARE SENSITIVE
          INFORMATION. PROCESSED BY OPENROUTER AND ITS MODEL PROVIDER.
        </p>
      </div>

      <p className="sr-only" role="status">
        {completedReply ? `Digital Twin replied: ${completedReply}` : ""}
      </p>
    </dialog>
  );
}
