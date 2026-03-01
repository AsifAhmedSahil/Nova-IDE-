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
    return null
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

    toDOM(){
      const span = document.createElement("span")
      span.textContent = this.text;
      span.style.opacity = "0.4";
      span.style.pointerEvents = "none";
      return span;

    }
}

let debounceTimer: number | null = null;
let isWaitingForSuggestion = false;
const DEBOUNCE_DELAY = 300;

const generateFakeSuggestion = (textBeforeCursor: string): string | null =>{
  const trimmed = textBeforeCursor.trimEnd();
  if(trimmed.endsWith("const")) return "myVariable =";
  if(trimmed.endsWith("function")) return "myFunction() {\n \n}";
  if(trimmed.endsWith("console")) return "log()";
  if(trimmed.endsWith("return")) return " null;";

  return null;
}

const createDebouncePlugin = (fileName: string) =>{
  return ViewPlugin.fromClass(
    class{
      constructor(view:EditorView){
        this.triggerSuggestion(view);

      }
      update(update:ViewUpdate){
        if(update.docChanged || update.selectionSet){
          this.triggerSuggestion(update.view);
        }
      }

      triggerSuggestion(view:EditorView) {
        if(debounceTimer !== null){
          clearTimeout(debounceTimer);
        }

        isWaitingForSuggestion = true;

        debounceTimer = window.setTimeout(async()=>{
          // Fake suggestion - delete this block later

          const cursor = view.state.selection.main.head;
          const line = view.state.doc.lineAt(cursor);
          const textBeforeCursor = line.text.slice(0,cursor - line.from)
          const suggestion = generateFakeSuggestion(textBeforeCursor);

          isWaitingForSuggestion  = false;

          view.dispatch({
            effects: setSuggestionEffect.of(suggestion), 
          });

        },DEBOUNCE_DELAY
      )

      }
      destroy(){
        if(debounceTimer !== null){
          clearTimeout(debounceTimer);
        }
      }

      
    }
  )
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

      if(isWaitingForSuggestion){
        return Decoration.none
      }

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

const acceptSuggestionKeyMap = keymap.of([
  {
    key:"Tab",
    run: (view) =>{
      const suggestion  =view.state.field(suggestionState);
      if(!suggestion){
        return false; // No suggestion let tab and change the normal things - indent

      }

      const cursor = view.state.selection.main.head;
      view.dispatch({
        changes: {from:cursor,insert:suggestion}, // insert the suggestion text
        selection:{anchor:cursor + suggestion.length}, //move cursor to end
        effects: setSuggestionEffect.of(null) // clear the suggestion
      })
      return true // we handled tab, don't indent
    }
  }
])
// update
export const suggestion = (fileName: string) => [suggestionState,createDebouncePlugin(fileName), renderPlugin,acceptSuggestionKeyMap];
