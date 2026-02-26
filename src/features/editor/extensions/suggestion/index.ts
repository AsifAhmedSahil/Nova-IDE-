import { StateEffect, StateField, Transaction } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
  keymap,
} from "@codemirror/view";
import { effect } from "zod/v3";

const setSuggestionEffect = StateEffect.define<string | null>();

const suggestionState = StateField.define<string | null>({
  create() {
    return "";
  },
  update(value, transaction) {
    for (const effect of transaction.effects) {
      if (effect.is(setSuggestionEffect)) {
        return effect.value;
      }
    }
    return value;
  },
});

class SuggestionWidget extends WidgetType{
    constructor(readonly text:string){
        super()
    }
}

const renderPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.build(view);
    }

    update(update: ViewUpdate) {
      // Rebuild decorations if doc changed, cursor moved, or suggestion changed
      const suggestionChanged = update.transactions.some((transaction) =>
        transaction.effects.some((effect) => effect.is(setSuggestionEffect)),
      );

    //   rebuild decorations if doc chnaged, cursor moved or suggestion changed

    const shouldRebuild = update.docChanged || update.selectionSet || suggestionChanged;

      if(shouldRebuild){
        this.decorations = this.build(update.view)
      }
    }

    build(view:EditorView){
        const suggestion = view.state.field(suggestionState);
        if(!suggestion){
            return Decoration.none;
        }

        // create a widget decoration at the cursor position
        const cursor = view.state.selection.main.head;

        return Decoration.set([
            Decoration.widget({
                widget: new SuggestionWidget(suggestion),
                side:1,
            }).range(cursor)
        ])



    }
  },{
        decorations:(plugin) => plugin.decorations
    }
);

export const suggestion = (fileName: string) => [suggestionState, renderPlugin];
