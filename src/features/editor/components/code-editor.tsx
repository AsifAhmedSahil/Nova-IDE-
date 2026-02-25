import React, { useEffect, useMemo, useRef } from 'react'

import {basicSetup} from "codemirror"
import { EditorView } from '@codemirror/view'
import {indentWithTab} from "@codemirror/commands"
import {oneDark} from "@codemirror/theme-one-dark"
import { customTheme } from '../extensions/theme'
import { getLanguageExtension } from '../extensions/language-extension'
import { keymap } from '@codemirror/view'
import { minimap } from '../extensions/minimap'


interface Props{
    filename:string
}

const CodeEditor = ({filename}:Props) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null)

    const languageExtension  = useMemo(()=>{ return getLanguageExtension(filename)},[filename])

    useEffect(()=>{
        if(!editorRef.current) return;

        const view = new EditorView({
            doc:"Start document",
            parent:editorRef.current,
            extensions:[
                oneDark,
                customTheme,
                basicSetup,
                languageExtension,
                keymap.of([indentWithTab]),
                minimap()
               
            ],
        })

        viewRef.current = view;

        return () =>{
            view.destroy()
        }

    },[])
  return (
    <div ref={editorRef} className='size-full pl-4 bg-background'>
        
    </div>
  )
}

export default CodeEditor