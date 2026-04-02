import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { App } from "./App";

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    cleanup();
  });

  it("switches between the three control-plane views", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Mission Control" })).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "Organization" }));
    expect(screen.getByRole("heading", { name: "Organization" })).toBeTruthy();
    expect(window.location.hash).toBe("#organization");

    fireEvent.click(screen.getByRole("tab", { name: "OpenClaw Runtime" }));
    expect(screen.getByRole("heading", { name: "OpenClaw Runtime" })).toBeTruthy();
    expect(window.location.hash).toBe("#runtime");
  });

  it("hydrates the selected tab from the location hash", () => {
    window.history.replaceState({}, "", "/#runtime");

    render(<App />);

    expect(screen.getByRole("heading", { name: "OpenClaw Runtime" })).toBeTruthy();
  });
});
