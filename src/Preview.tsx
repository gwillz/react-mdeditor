
import React, { createElement, useState, useRef, useEffect } from 'react';
import { useDebounce } from './useDebounce';

type PluginName =
    | "target-link"
    // | "router-link"
    // | "dead-link"
    // | "hold-image"
    // | "highlight-code"
;

type Props = {
    className?: string;
    value: string;
    debounce?: number;
    plugins?: Plugin[];
}

export function Preview(props: Props) {
    const compiler = useRemarkHtml(props.plugins);
    const [contents, setContents] = useState<JSX.Element>();
    const [error, setError] = useState<Error>();
    
    useDebounce(compile, props.debounce ?? 300, [props.value]);
        
    function compile() {
        compiler.process(props.value)
        .then(html => setContents(html.contents as any))
        .catch(setError);
    }
    
    if (error) throw error;
    
    return (
        <div
            className={props.className}
            children={contents}
        />
    )
}

import { Node } from 'unist';
import { Processor, Plugin } from 'unified';
import unified from 'unified';
import remark, { RemarkOptions } from 'remark';
import remarkHtml from 'remark-html';
import remarkReact from 'remark-react';

import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeReact from 'rehype-react';

export function useRemarkHtml(plugins: Plugin[] = []) {
    const [compiler, setCompiler] = useState(init);
    
    useEffect(
        () => setCompiler(init()),
        [plugins.map(p => p.name || p.toString()).toString()],
    );
    
    function init() {
        const compiler = unified();
        compiler.use(remarkParse);
        compiler.use(plugins);
        compiler.use(remarkRehype);
        compiler.use(rehypeReact, { createElement });
        return compiler;
    }
    
    return compiler;
}



// const PLUGINS: Record<PluginName, MdPlugin> = {
//     "target-link": {
//         component: (props) => (
//             <a href={props.node.url as string}></a>
//         )
//     }
// }

// type Aych = (node: Node, tagNode: string, props?: any, children?: Node[]) => Node;

// interface MdPlugin {
//     filter: Plugin<any>;
//     transform: (h: Aych, node: Node) => Node;
//     component: (props: { node: Node }) => JSX.Element;
// }
