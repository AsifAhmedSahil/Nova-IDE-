import React, { useEffect, useMemo, useRef } from 'react'

import {basicSetup} from "codemirror"
import { EditorView } from '@codemirror/view'
import {indentWithTab} from "@codemirror/commands"
import {oneDark} from "@codemirror/theme-one-dark"
import { customTheme } from '../extensions/theme'
import { getLanguageExtension } from '../extensions/language-extension'
import { keymap } from '@codemirror/view'
import { minimap } from '../extensions/minimap'
import {indentationMarkers} from "@replit/codemirror-indentation-markers"
import { customSetup } from '../extensions/custom-setup'


interface Props{
    filename:string;
    initialValue?:string;
    onChange:(value:string)=> void;
}

const CodeEditor = ({filename,initialValue="",onChange}:Props) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null)

    const languageExtension  = useMemo(()=>{ return getLanguageExtension(filename)},[filename])

    useEffect(()=>{
        if(!editorRef.current) return;

        const view = new EditorView({
            doc:initialValue,
            parent:editorRef.current,
            extensions:[
                oneDark,
                customTheme,
                customSetup,
                languageExtension,
                keymap.of([indentWithTab]),
                minimap(),
                indentationMarkers(),
                EditorView.updateListener.of((update)=>{
                    if(update.docChanged){
                        onChange(update.state.doc.toString());
                    }
                })
               
            ],
        })
        // update

        viewRef.current = view;

        return () =>{
            view.destroy()
        }

    },[languageExtension])
  return (
    <div ref={editorRef} className='size-full pl-4 bg-background'>
        
    </div>
  )
}

export default CodeEditor