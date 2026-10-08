import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "../src/app/page";
import { profile } from "../src/data/profile";

describe("verified portfolio content", () => {
  it("renders every verified role from the shared profile", () => {
    const html = renderToStaticMarkup(<Home />);

    for (const role of profile.roles) {
      expect(html).toContain(role.role.replaceAll("&", "&amp;"));
      expect(html).toContain(role.company.toUpperCase());
    }
  });

  it("does not present unsupported career claims as fact", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).not.toContain(
      "Designed scalable software foundations for enterprise-grade financial products.",
    );
    expect(html).not.toContain(
      "Grew from hands-on engineering into technical leadership",
    );
    expect(html).not.toContain("7<span>+</span>");
    expect(html).not.toContain("LEADERSHIP CHAPTERS");
  });
});
