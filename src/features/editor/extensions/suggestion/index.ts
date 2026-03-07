import { StateEffect, StateField } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
  keymap,
} from "@codemirror/view";
import { fetcher } from "./fetcher";

const setSuggestionEffect = StateEffect.define<string | null>();

const suggestionState = StateField.define<string | null>({
  create() {
    return null;
  },
  update(value, tr) {
    for (const e of tr.effects) {
      if (e.is(setSuggestionEffect)) return e.value;
    }
    return value;
  },
});

class SuggestionWidget extends WidgetType {
  constructor(readonly text: string) {
    super();
  }

  toDOM() {
    const span = document.createElement("span");
    span.textContent = this.text;
    span.style.opacity = "0.4";
    span.style.pointerEvents = "none";
    return span;
  }
}

let debounceTimer: number | null = null;
let currentAbortController: AbortController | null = null;

const DEBOUNCE_DELAY = 800;

const generatePayload = (view: EditorView, fileName: string) => {
  const fullCode = view.state.doc.toString();

  if (!fullCode.trim()) return null;

  const code = fullCode.split("\n").slice(-120).join("\n");

  const cursor = view.state.selection.main.head;
  const line = view.state.doc.lineAt(cursor);
  const cursorInLine = cursor - line.from;

  if (/[;})]\s*$/.test(line.text)) return null;

  const previousLines: string[] = [];
  const prevCount = Math.min(5, line.number - 1);

  for (let i = prevCount; i >= 1; i--) {
    previousLines.push(view.state.doc.line(line.number - i).text);
  }

  const nextLines: string[] = [];
  const total = view.state.doc.lines;
  const nextCount = Math.min(5, total - line.number);

  for (let i = 1; i <= nextCount; i++) {
    nextLines.push(view.state.doc.line(line.number + i).text);
  }

  return {
    fileName,
    code,
    currentLine: line.text,
    previousLines: previousLines.join("\n"),
    textBeforeCursor: line.text.slice(0, cursorInLine),
    textAfterCursor: line.text.slice(cursorInLine),
    nextLines: nextLines.join("\n"),
    lineNumber: line.number,
  };
};

const createDebouncePlugin = (fileName: string) =>
  ViewPlugin.fromClass(
    class {
      constructor(view: EditorView) {
        this.trigger(view);
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.selectionSet) {
          this.trigger(update.view);
        }
      }

      trigger(view: EditorView) {
        if (debounceTimer) clearTimeout(debounceTimer);

        if (currentAbortController) {
          currentAbortController.abort();
        }

        debounceTimer = window.setTimeout(async () => {
          const payload = generatePayload(view, fileName);

          if (!payload) {
            view.dispatch({
              effects: setSuggestionEffect.of(null),
            });
            return;
          }

          currentAbortController = new AbortController();

          const suggestion = await fetcher(
            payload,
            currentAbortController.signal
          );

          if (currentAbortController.signal.aborted) return;

          if (!suggestion || !suggestion.trim()) {
            view.dispatch({
              effects: setSuggestionEffect.of(null),
            });
            return;
          }

          view.dispatch({
            effects: setSuggestionEffect.of(suggestion),
          });
        }, DEBOUNCE_DELAY);
      }

      destroy() {
        if (debounceTimer) clearTimeout(debounceTimer);
        if (currentAbortController) currentAbortController.abort();
      }
    }
  );

const renderPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.build(view);
    }

    update(update: ViewUpdate) {
      const suggestionChanged = update.transactions.some((tr) =>
        tr.effects.some((e) => e.is(setSuggestionEffect))
      );

      if (update.docChanged || update.selectionSet || suggestionChanged) {
        this.decorations = this.build(update.view);
      }
    }

    build(view: EditorView) {
      const suggestion = view.state.field(suggestionState);
      if (!suggestion) return Decoration.none;

      const cursor = view.state.selection.main.head;

      return Decoration.set([
        Decoration.widget({
          widget: new SuggestionWidget(suggestion),
          side: 1,
        }).range(cursor),
      ]);
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);

const acceptSuggestionKeyMap = keymap.of([
  {
    key: "Tab",
    run(view) {
      const suggestion = view.state.field(suggestionState);

      if (!suggestion) return false;

      const cursor = view.state.selection.main.head;

      view.dispatch({
        changes: { from: cursor, insert: suggestion },
        selection: { anchor: cursor + suggestion.length },
        effects: setSuggestionEffect.of(null),
      });

      return true;
    },
  },
]);

export const suggestion = (fileName: string) => [
  suggestionState,
  createDebouncePlugin(fileName),
  renderPlugin,
  acceptSuggestionKeyMap,
];