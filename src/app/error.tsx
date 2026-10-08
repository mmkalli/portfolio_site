"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="status-page">
      <p>500 / SOMETHING WENT WRONG</p>
      <h1>
        LET&apos;S TRY
        <br />
        THAT AGAIN<span>.</span>
      </h1>
      <button type="button" onClick={reset}>
        RETRY →
      </button>
      <Link href="/">RETURN HOME</Link>
    </main>
  );
}
