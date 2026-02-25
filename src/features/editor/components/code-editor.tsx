import React, { useEffect, useRef } from 'react'

import {basicSetup,EditorView} from "codemirror"
import {javascript} from "@codemirror/lang-javascript"
import {oneDark} from "@codemirror/theme-one-dark"
import { customTheme } from '../extensions/theme'

const CodeEditor = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null)

    useEffect(()=>{
        if(!editorRef.current) return;

        const view = new EditorView({
            doc:"Start document",
            parent:editorRef.current,
            extensions:[
                oneDark,
                customTheme,
                basicSetup,
                javascript({typescript:true})
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