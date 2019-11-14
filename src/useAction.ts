
import { Node } from 'unist';
import { useRef } from 'react';
import { useDebounce } from './useDebounce';
import remark from 'remark';
import { Action, doAction } from './actions';
import { Root } from 'mdast';

export type Props = {
    textarea: HTMLTextAreaElement | null;
    value: string;
    onValue: (value: string) => void;
    debounce?: number;
}

/**
 * 
 */
export function useActions(props: Props) {
    
    const tree = useRef<Root>();
    const restore = useRef(-1);
    
    // 
    useDebounce(() => {
        tree.current = remark().parse(props.value) as Root;
        
        // @ts-ignore
        window.tree = tree.current;
        
        // Restore the cursor after a remark operation.
        const cursor = restore.current;
        if (props.textarea && cursor >= 0) {
            props.textarea.setSelectionRange(cursor, cursor);
            restore.current = -1;
            props.textarea.focus();
        }
    }, props.debounce ?? 500, [props.value]);
    
    // 
    function onAction(action: Action) {
        if (!props.textarea || !tree.current) return;
        
        const { selectionStart, selectionEnd } = props.textarea;
        
        const cursor = doAction(action, tree.current, selectionStart, selectionEnd);
        
        // Restore cursor.
        if (tree.current && cursor >= 0) {
            const md = remark().stringify(tree.current);
            props.onValue(md);
            restore.current = cursor;
        }
    }
    
    return onAction;
}
