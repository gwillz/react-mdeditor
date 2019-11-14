
import { Node } from 'unist';
import * as build from './builders';

import {
    Literal,
    Root,
    StaticPhrasingContent,
    Parent,
} from 'mdast';

import {
    unwrapNode,
    getNodeBounds,
    indexOfChild,
    findAnyAt,
    findStaticContent,
    findLeaf,
    findDefinitionIndex,
    findChildren,
    findOneAt,
} from './utils';

export type Action =
    | "emphasis" 
    | "strong" 
    | "anchor" 
    | "blockquote" 
    | "table" 
    | "inline-code"
    | "image"
    | "heading"
    | "list-ol"
    | "list-ul"
    | "separator"
    | "auto-enter"
    | "undo"
    | "redo"
;

/**
 * 
 */
export function resolveActionKey(key: string): Action | undefined {
    switch (key) {
        case "b": return "strong";
        case "i": return "emphasis";
        case "l": return "anchor";
        case "t": return "blockquote";
        case "k": return "inline-code";
        case "g": return "image";
        case "h": return "heading";
        case "o": return "list-ol";
        case "u": return "list-ul";
        case "r": return "separator";
    }
    return undefined;
}

/**
 * 
 */
export function doAction(action: Action, tree: Root, start: number, end: number): number {
    if (start === end) {
        console.log("toggle", action, start);
    
        switch (action) {
            case "auto-enter":
                return doActionEnter(tree, start);
            case "strong":
                return toggleStrong(tree, start);
            case "blockquote":
                return toggleQuote(tree, start);
            case "emphasis":
                return toggleEmphasis(tree, start);
            case "inline-code":
                return toggleCode(tree, start);
            case "heading":
                return toggleHeading(tree, start);
            case "anchor":
                return toggleAnchor(tree, start);
            case "image":
                return toggleImage(tree, start);
            case "separator":
                return insertSeparator(tree, start);
            case "list-ol":
                return toggleList(tree, start, "ordered");
            case "list-ul":
                return toggleList(tree, start, "unordered");
        }
        return -1;
    }
    else {
        console.log("wrap", action, start, end);
        
        // Ensure start/end are small/big.
        if (end > start) {
            let temp = start;
            start = end;
            end = temp;
        }
        
        // @todo
        //
        // Easy (relatively) wraps:
        // strong
        // emphasis
        // inline-code
        // strike?
        //
        // Wraps for content without line-beaks:
        // anchors
        // images
        //
        // Wraps that convert paragraphs and line-breaks:
        // lists
        // blockquote
        //
        // Ignore wraps and just do toggle:
        // header
        // auto-enter
        // 
        
        return -1;
    }
}


function doActionEnter(tree: Root, cursor: number): number {
    let node: Node | undefined;
    
    node = findAnyAt(tree, cursor, "blockquote");
    if (node) {
        // We found a quote, let's search inside that for a text node.
        let child = findAnyAt(node, cursor, "text", "inlineCode") as Literal;
        if (!child) return -1;
        
        const bounds = getNodeBounds(child);
        if (!bounds) return -1;
        
        // Append a line break.
        if (cursor === bounds.end) {
            // @todo Check if double \n\n and instead add a blockquote child.
            child.value += "\n ";
            return bounds.end + 3;
        }
        // Insert a line break.
        else {
            // @todo This only kinda works.
            // Recurring lines introduce offset for each line.
            // i.e. The text "abc\n123\n" is actually "> abc\n> 123\n".
            // So the cursor is at '2' is 11, but in text it's 6.
            // The 'append' method works great though.
            const pivot = cursor - bounds.start;
            child.value =
                child.value.slice(0, pivot) +
                "\n" +
                child.value.slice(pivot);
            
            return cursor + 3;
        }
    }
    
    node = findAnyAt(tree, cursor, "list");
    if (node) {
        
        const index = indexOfChild(node as Parent, cursor);
        const children = node.children as Node[];
        
        if (index >= 0) {
            children.splice(index + 1, 0, build.listItem([]));
            
            const bounds = getNodeBounds(children[index]);
            
            return !!bounds
                ? bounds.end + 2
                : cursor + 2;
        }
        else {
            children.push(build.listItem([]));
            return cursor + 2;
        }
    }
    
    return -1;
}


function toggleStrong(tree: Root, cursor: number): number {
    let node: Node | undefined;
    
    // Unwrap a strong.
    node = findAnyAt(tree, cursor, "strong");
    if (node) {
        unwrapNode(node);
        return Math.max(0, cursor - 2);
    }
    
    // Wrap a literal in an strong.
    node = findStaticContent(tree, cursor);
    if (node) {
        const copy = {...node};
        Object.assign(node, build.strong([copy]));
        return cursor + 2;
    }
    
    return -1;
}


function toggleEmphasis(tree: Root, cursor: number): number {
    let node: Node | undefined;
    
    // Unwrap an emphasis.
    node = findAnyAt(tree, cursor, "emphasis");
    if (node) {
        unwrapNode(node);
        return Math.max(0, cursor - 1);
    }
    
    // Wrap a literal in an emphasis.
    node = findStaticContent(tree, cursor);
    if (node) {
        const copy = {...node};
        Object.assign(node, build.emphasis([copy]));
        return cursor + 1;
    }
    
    return -1;
}

/**
 * Inline-code is a literal string. This is a simple as swapping the type field
 * from 'text' -> 'inlineCode' and back again.
 */
function toggleCode(tree: Root, cursor: number): number {
    let node: Node | undefined;
    
    // Swap code to text.
    node = findAnyAt(tree, cursor, "inlineCode");
    if (node) {
        node.type = "text";
        return Math.max(0, cursor - 1);
    }
    
    // Swap text to code.
    node = findAnyAt(tree, cursor, "text");
    if (node) {
        node.type = "inlineCode";
        return cursor + 1;
    }
    
    return -1;
}


function toggleQuote(tree: Root, cursor: number): number {
    let node: Node | undefined;
    
    // Unwrap a quote.
    node = findAnyAt(tree, cursor, "blockquote");
    if (node) {
        unwrapNode(node);
        return Math.max(0, cursor - 2);
    }
    
    // Wrap a literal in a quote.
    node = findStaticContent(tree, cursor);
    if (node) {
        const copy = {...node};
        Object.assign(node, build.blockquote([copy]));
        return cursor + 2;
    }
    
    return -1;
}


function toggleHeading(tree: Root, cursor: number): number {
    let node: Node | undefined;
    
    node = findOneAt(tree, cursor, "heading");
    if (node) {
        // Loop H6 back to H1.
        if ((node.depth as number) === 6) {
            unwrapNode(node);
            return Math.max(0, cursor - 7);
        }
        // Increment heading depth.
        else {
            (node.depth as number) += 1;
            return cursor + 1;
        }
    }
    
    // Wrap a literal in a heading.
    node = findStaticContent(tree, cursor);
    if (node) {
        const copy = {...node};
        Object.assign(node, build.heading(1, [copy]));
        return cursor + 2;
    }
    
    return -1;
}


function toggleAnchor(tree: Root, cursor: number): number {
    let node: Node | undefined;
    
    // Unwrapping a link.
    node = findOneAt(tree, cursor, "link");
    if (node) {
        unwrapNode(node);
        return Math.max(0, cursor - 1);
    }
    
    // Wrap a literal in a link.
    node = findLeaf(tree, cursor);
    if (node) {
        const copy = {...node};
        Object.assign(node, build.link("https://", undefined, [copy]));
        return cursor + 1;
    }
    
    return -1;
}


function toggleDefAnchor(tree: Root, cursor: number): number {
    let node: Node | undefined;
    
    // Removing a link.
    node = findAnyAt(tree, cursor, "linkReference");
    if (node) {
        // Remove definition.
        const index = findDefinitionIndex(tree, node.identifier as string);
        tree.children.splice(index, 1);
        
        // Unwrap link contents.
        unwrapNode(node);
        return -1;
    }
    
    // Adding a link.
    node = findLeaf(tree, cursor);
    if (node) {
        // Get the next def id.
        const defs = findChildren(tree, "definition");
        const identifier = defs.length + "";
        
        // Wrap the literal with a ref-link.
        const copy = {...node} as StaticPhrasingContent;
        Object.assign(node, build.linkReference(identifier, [copy]));
        
        // Append a matching definition.
        tree.children.push(build.definition(identifier, "https://"));
        return cursor + 1;
    }
    
    return -1;
}

/**
 * Images 'alt' text cannot contain rich text, it's just a literal string.
 * So the code here just swaps between 'text' and 'image'.
 */
function toggleImage(tree: Root, cursor: number): number {
    let node: Node | undefined;
    
    // Replace an image with a text node.
    node = findAnyAt(tree, cursor, "image");
    if (node) {
        Object.assign(node, build.text(node.alt as string));
        return cursor - 2;
    }
    
    // Replace a text node with an image.
    node = findAnyAt(tree, cursor, "text");
    if (node) {
        Object.assign(node, build.image("https://", undefined, node.value as string));
        return cursor + 2;
    }
    
    return -1;
}


function insertSeparator(tree: Root, cursor: number): number {
    
    // @todo This isn't quite the right search method.
    // We need to find the item immediately after this cursor point.
    // This method doesn't account for void space between nodes.
    const index = indexOfChild(tree, cursor);
    
    if (index >= 0) {
        tree.children.splice(index + 1, 0, build.thematicBreak());
        
        const bounds = getNodeBounds(tree.children[index]);
        
        return !!bounds
            ? bounds.start + 6
            : cursor + 6;
    }
    else {
        return -1;
    }
}


function toggleList(tree: Root, cursor: number, mode: "ordered" | "unordered"): number {
    const ordered = mode === "ordered";
    
    let node: Node | undefined;
    
    node = findAnyAt(tree, cursor, "list");
    if (node) {
        // Swap the ordering.
        if (node.ordered !== ordered) {
            node.ordered = ordered;
            return cursor;
        }
        // Un-indent a single item.
        else {
            console.log("stub", node);
            // Find list-item.
            // Split into two lists, insert middle text.
            // Like: [list] [text] [list]
            // Edge cases for first and last items, single item lists.
            // Ugh. hard.
            return -1;
        }
    }
    
    // Wrap node in a list and list-item.
    node = findStaticContent(tree, cursor);
    if (node) {
        const copy = {...node};
        Object.assign(node, build.list(mode, build.listItem([copy])));
        return cursor + 4;
    }
    
    return -1;
}

