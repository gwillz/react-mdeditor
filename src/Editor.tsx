
import React, { useRef } from 'react';
import { Toolbar } from './Toolbar';
import { Preview } from './Preview';
import { useActions } from './useAction';
import { useKeys } from './useKeys';

type Props = {
    value: string;
    onValue: (value: string) => void;
}

/**
 * 
 */
export function Editor(props: Props) {
    const element = useRef<HTMLTextAreaElement | null>(null);
    
    const onAction = useActions({
        textarea: element.current,
        value: props.value,
        onValue: props.onValue,
    });
    
    const onKey = useKeys(onAction);
    
    function onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const { value } = event.currentTarget;
        props.onValue(value);
    }
    
    return (
        <div className="remark-editor">
            <Toolbar
                className="remark-editor-toolbar"
                onAction={onAction}
            />
            <textarea
                className="remark-editor-input"
                placeholder="Type here"
                ref={element}
                value={props.value}
                onChange={onChange}
                onKeyDown={onKey}
            />
            <Preview
                className="remark-editor-preview markdown"
                value={props.value}
                plugins={[links({dead: false})]}
            />
        </div>
    )
}

import { Node } from 'unist';
import { VFile } from 'vfile';
import visit from 'unist-util-visit';


type LinkProps = {
    dead?: boolean;
}

type Next = (error: Error | null, tree: Node, file: VFile) => void;

function links(props: LinkProps) {
    return () => plugin;
    
    function plugin(tree: Node, type: VFile) {
        return new Promise<Node>((resolve, reject) => {
            visit(tree, "link", node => {
                node.
            })
            resolve();
        })
    }
}
