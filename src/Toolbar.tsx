
import React from 'react';
import { Action } from './actions';

type Props = {
    className?: string;
    onAction: (action: Action) => void;
}

/**
 * 
 */
export function Toolbar(props: Props) {
    
    function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        const { name } = event.currentTarget;
        props.onAction(name as Action);
    }
    
    return (
        <div className={props.className}>
            <button
                type="button"
                name="strong"
                title="Bold - Ctrl+B"
                onClick={onClick}>
                B
            </button>
            <button
                type="button"
                name="emphasis"
                title="Italic - Ctrl+I"
                onClick={onClick}>
                I
            </button>
            <span className="spacer" />
            <button
                type="button"
                name="link"
                title="Hyperlink - Ctrl+L"
                onClick={onClick}>
                L
            </button>
            <button
                type="button"
                name="blockquote"
                title="Blockquote - Ctrl+T"
                onClick={onClick}>
                T
            </button>
            <button
                type="button"
                name="inline-code"
                title="Code - Ctrl+K"
                onClick={onClick}>
                K
            </button>
            <button
                type="button"
                name="image"
                title="Image - Ctrl+G"
                onClick={onClick}>
                G
            </button>
            <span className="spacer" />
            <button
                type="button"
                name="heading"
                title="Heading - Ctrl+H"
                onClick={onClick}>
                H
            </button>
            <button
                type="button"
                name="list-ol"
                title="Numbered List - Ctrl+O"
                onClick={onClick}>
                O
            </button>
            <button
                type="button"
                name="list-ul"
                title="Bulleted List - Ctrl+U"
                onClick={onClick}>
                U
            </button>
            <button
                type="button"
                name="separator"
                title="Horizontal Rule - Ctrl+R"
                onClick={onClick}>
                R
            </button>
            <span className="spacer" />
            <button
                type="button"
                name="undo"
                title="Undo - Ctrl+Z"
                onClick={onClick}>
                Z
            </button>
            <button
                type="button"
                name="redo"
                title="Redo - Ctrl+Shift+Z"
                onClick={onClick}>
                X
            </button>
        </div>
    )
}