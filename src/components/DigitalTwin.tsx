"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const DigitalTwinPanel = dynamic(() => import("./DigitalTwinPanel"), {
  ssr: false,
});

const SparkIcon = () => (
  <svg
    aria-hidden="true"
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 2.5c.45 5.2 3.3 8.05 8.5 8.5-5.2.45-8.05 3.3-8.5 8.5-.45-5.2-3.3-8.05-8.5-8.5 5.2-.45 8.05-3.3 8.5-8.5Z"
      fill="currentColor"
    />
  </svg>
);

export default function DigitalTwin() {
  const [isOpen, setIsOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true;
    } else if (hasOpenedRef.current) {
      launcherRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <button
        ref={launcherRef}
        className="twin-launcher"
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="digital-twin-dialog"
      >
        <span className="twin-launcher-icon">
          <SparkIcon />
        </span>
        <span>
          <small>ASK MY</small>
          DIGITAL TWIN
        </span>
        <i aria-hidden="true">→</i>
      </button>

      {isOpen ? <DigitalTwinPanel onClose={() => setIsOpen(false)} /> : null}
    </>
  );
}
