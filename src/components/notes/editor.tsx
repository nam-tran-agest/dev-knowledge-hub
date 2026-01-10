'use client'

import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { useEffect, useRef } from "react"

interface EditorProps {
    initialContent?: string // Markdown string
    onChange?: (markdown: string) => void
    editable?: boolean
}

export default function Editor({ initialContent, onChange, editable = true }: EditorProps) {
    const editor = useCreateBlockNote()
    const isInitializedRef = useRef(false)
    const onChangeRef = useRef(onChange)

    // Keep onChange ref updated
    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    useEffect(() => {
        async function loadContent() {
            if (initialContent && !isInitializedRef.current) {
                try {
                    const blocks = await (editor as any).tryParseMarkdownToBlocks(initialContent)
                    ;(editor as any).replaceBlocks(editor.document, blocks)
                    isInitializedRef.current = true
                } catch (error) {
                    console.error('Failed to load content:', error)
                }
            }
        }
        loadContent()
    }, [editor, initialContent])

    const handleChange = async () => {
        if (onChangeRef.current && editor) {
            try {
                const markdown = await (editor as any).blocksToMarkdownLossy(editor.document)
                console.log('📄 Editor onChange:', markdown.substring(0, 100) + (markdown.length > 100 ? '...' : ''))
                onChangeRef.current(markdown)
            } catch (error) {
                console.error('Failed to convert to markdown:', error)
            }
        }
    }

    return (
        <BlockNoteView
            editor={editor}
            editable={editable}
            theme="dark"
            onChange={handleChange}
            className="min-h-[300px] md:min-h-[400px] w-full max-w-full overflow-x-auto"
        />
    )
}
