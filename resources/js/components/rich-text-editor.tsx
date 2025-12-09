import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
    id: string;
    name: string;
    defaultValue?: string;
    placeholder?: string;
    className?: string;
}

export function RichTextEditor({
    id,
    name,
    defaultValue = '',
    placeholder = '',
    className = '',
}: RichTextEditorProps) {
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const editorRef = useRef<any>(null);

    useEffect(() => {
        // Update hidden input on form submit
        if (hiddenInputRef.current) {
            const form = hiddenInputRef.current.closest('form');
            if (form) {
                const handleSubmit = () => {
                    if (hiddenInputRef.current && editorRef.current) {
                        hiddenInputRef.current.value = editorRef.current.getData();
                    }
                };
                form.addEventListener('submit', handleSubmit);
                return () => {
                    form.removeEventListener('submit', handleSubmit);
                };
            }
        }
    }, []);

    return (
        <div className={`rounded-md border border-input bg-transparent overflow-hidden ${className}`}>
            <CKEditor
                editor={ClassicEditor}
                data={defaultValue || ''}
                config={{
                    placeholder: placeholder || 'Enter description...',
                    toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'outdent',
                        'indent',
                        '|',
                        'undo',
                        'redo',
                    ],
                }}
                onReady={(editor) => {
                    editorRef.current = editor;
                    if (hiddenInputRef.current) {
                        hiddenInputRef.current.value = editor.getData();
                    }
                }}
                onChange={(event, editor) => {
                    if (hiddenInputRef.current) {
                        const data = editor.getData();
                        hiddenInputRef.current.value = data;
                        // Trigger change event to update parent state
                        hiddenInputRef.current.dispatchEvent(
                            new Event('change', { bubbles: true })
                        );
                    }
                }}
            />
            <input
                ref={hiddenInputRef}
                type="hidden"
                id={id}
                name={name}
                defaultValue={defaultValue || ''}
            />
        </div>
    );
}
