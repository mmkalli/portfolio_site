import { ImageResponse } from "next/og";

export const alt = "Mehmet Melih Kalli — Technical Leader and Product Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#090b0b",
        color: "#f0eee7",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          fontSize: 24,
          gap: 20,
          letterSpacing: "0.12em",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "#c9ff3d",
            color: "#090b0b",
            display: "flex",
            fontSize: 28,
            fontWeight: 800,
            height: 64,
            justifyContent: "center",
            width: 64,
          }}
        >
          MK
        </div>
        MEHMET MELIH KALLI
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            color: "#c9ff3d",
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.16em",
            marginBottom: 20,
          }}
        >
          TECHNICAL LEAD · PRODUCT OWNER
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: "-0.06em",
            lineHeight: 0.95,
            maxWidth: 950,
          }}
        >
          TECHNOLOGY, PRODUCT & LEADERSHIP.
        </div>
      </div>
    </div>,
    size,
  );
}
