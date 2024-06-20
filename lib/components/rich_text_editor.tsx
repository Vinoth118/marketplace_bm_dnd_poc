import React, { useEffect, useRef } from 'react';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";

type RichTextEditorProps = {
    initialData?: string,
    onChange: (data: string) => void
}

const editorConfiguration = {
    toolbar: [
        'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'imageUpload', 'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo',
        'sourceEditing'
    ]
};

function RichTextEditor({ initialData = '', onChange }: RichTextEditorProps) {

    useWindowResize(() => {
        const overrideToolbarCSS = () => {
            const elements = document.getElementsByClassName('ck-toolbar_grouping');
            const element = elements[0];
            if(element) {
                let root = document.querySelector(':root') as any;
                root.style.setProperty("--ck-dropdown-max-width", `${element.clientWidth - 5}px`, 'important');
                root.style.setProperty("--ck-toolbar-dropdown-max-width", `${element.clientWidth - 5}px`, 'important');
            }
        }
        const elements = document.getElementsByClassName('ck-toolbar_grouping');
        if(elements[0] == undefined) {
            setTimeout(() => overrideToolbarCSS(), 1000)
        } else {
            overrideToolbarCSS();
        }
    });

    return (
        <CKEditor
            editor={Editor}
            config={{ removePlugins: ['Title'] }}
            data={initialData}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
                //console.log( { event, editor, data } );
            }}
            onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                // console.log("Editor is ready to use!", editor);
                editor.editing.view.change((writer) => {
                    writer.setStyle(
                        "height",
                        "400px",
                        editor.editing.view.document.getRoot()!
                    );
                });
            }}
        />
    )
}

export default RichTextEditor;


const useWindowResize = (callback: () => void, delay: number = 300) => {
    const callbackRef = useRef(callback);
  
    // Update the ref each render so it always has the latest callback
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
  
    useEffect(() => {
        // Handler to call on window resize with throttling
        const handleResize = throttle(() => {
            callbackRef.current();
        }, delay);
    
        // Add event listener
        window.addEventListener('resize', handleResize);

        handleResize();
    
        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [delay]); // Re-run the effect if delay changes
};

// Custom throttle function
const throttle = (func: () => void, delay: number) => {
    let lastCall = 0;
    return () => {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        func();
    };
};