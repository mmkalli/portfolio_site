import Link from "next/link";

export default function NotFound() {
  return (
    <main className="status-page">
      <p>404 / NOT FOUND</p>
      <h1>
        THIS PAGE IS
        <br />
        OFF THE MAP<span>.</span>
      </h1>
      <Link href="/">RETURN HOME →</Link>
    </main>
  );
}
