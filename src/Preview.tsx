
import React, { useState } from 'react';
import remark from 'remark';
import remarkHtml from 'remark-html';
import { useDebounce } from './useDebounce';

type Props = {
    className?: string;
    value: string;
    debounce?: number;
}

export function Preview(props: Props) {
    const [html, setHtml] = useState("");
    
    useDebounce(() => {
        remark()
        .use(remarkHtml)
        .process(props.value)
        .then(html => {
            setHtml(html.toString());
        })
    }, props.debounce ?? 300, [props.value]);
    
    return (
        <div
            className={props.className}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}
