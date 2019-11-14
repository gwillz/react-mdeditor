
import React from 'react';
import { Action, resolveActionKey } from './actions';

type ActionFn = (action: Action) => void;

/**
 * 
 */
export function useKeys(onAction: ActionFn) {
    
    function onKey(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        const modifier = event.ctrlKey || event.metaKey;
        
        if (!modifier && !event.shiftKey) return;
        
        // Shift-Enter: list items.
        if (event.key === "Enter") {
            event.preventDefault();
            onAction("auto-enter");
        }
        // Ctrl+(Shift)+Z: undo/redo.
        else if (modifier && event.key === "z") {
            event.preventDefault();
            onAction(event.shiftKey ? "redo" : "undo");
        }
        // Ctrl+?: everything else.
        else if (modifier) {
            const action = resolveActionKey(event.key);
            if (action) {
                event.preventDefault();
                onAction(action);
            }
        }
    }
    
    return onKey;
}
