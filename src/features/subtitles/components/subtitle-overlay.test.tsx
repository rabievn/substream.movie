import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render-with-providers";
import { translationSubtitlesToggled } from "../model/subtitle-settings-slice";
import type { SubtitleCue } from "../types";
import { SubtitleOverlay } from "./subtitle-overlay";

const original: SubtitleCue[] = [{ id: 0, start: 1, end: 4, text: "Don't let us down!" }];
const translation: SubtitleCue[] = [{ id: 0, start: 1, end: 4, text: "Не подведи нас!" }];

const renderOverlay = (currentTime: number, onWordClick = vi.fn()) =>
  renderWithProviders(
    <SubtitleOverlay
      originalCues={original}
      translationCues={translation}
      currentTime={currentTime}
      originalLanguage="en"
      translationLanguage="ru"
      onWordClick={onWordClick}
    />,
  );

describe("SubtitleOverlay", () => {
  it("renders both lines for the active cue", () => {
    renderOverlay(2);
    expect(screen.getByText("Не подведи нас!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Don't" })).toBeInTheDocument();
  });

  it("renders nothing between cues", () => {
    const { container } = renderOverlay(5);
    expect(container).toBeEmptyDOMElement();
  });

  it("reports clicked words with their context", async () => {
    const onWordClick = vi.fn();
    renderOverlay(2, onWordClick);
    await userEvent.click(screen.getByRole("button", { name: "down" }));
    expect(onWordClick).toHaveBeenCalledWith(
      expect.objectContaining({
        word: "down",
        context: "Don't let us down!",
        translationContext: "Не подведи нас!",
      }),
    );
  });

  it("hides the translation when toggled off", () => {
    const { store } = renderOverlay(2);
    act(() => {
      store.dispatch(translationSubtitlesToggled());
    });
    expect(screen.queryByText("Не подведи нас!")).not.toBeInTheDocument();
  });
});
