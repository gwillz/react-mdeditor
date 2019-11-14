
import { Node } from 'unist';
import { Parent, Root, Content } from 'mdast';
import find from 'unist-util-find';

type NodeType = Content['type'];

export type Bounds = {
    start: number;
    end: number;
}

/**
 * 
 */
export function getNodeBounds(node: Node): Bounds | null {
    const start = node.position?.start?.offset;
    const end = node.position?.end?.offset;
    
    return (
        typeof start === "number" &&
        typeof end === "number"
        ? { start, end }
        : null
    );
}

/**
 * 
 */
export function withinBounds(bounds: Bounds, cursor: number): boolean {
    return bounds.start <= cursor && cursor <= bounds.end;
}

/**
 * 
 */
export function findAnyAt(root: Node, cursor: number, ...types: NodeType[]): Node | undefined {
    return find(root, node => {
        const bounds = getNodeBounds(node);
        
        if (!bounds) return false;
        
        return (
            types.includes(node.type as NodeType) &&
            withinBounds(bounds, cursor)
        )
    });
}

/**
 * 
 */
export function findOneAt(root: Node, cursor: number, type: NodeType): Node | undefined {
    return find(root, node => {
        const bounds = getNodeBounds(node);
        
        if (!bounds) return false;
        
        return (
            type === node.type &&
            withinBounds(bounds, cursor)
        )
    });
}

/**
 * 
 */
export function findStaticContent(tree: Node, cursor: number) {
    return findAnyAt(tree, cursor,
        "text", "emphasis", "strong", "delete", "inlineCode"
    );
}

/**
 * 
 */
export function findLeaf(tree: Node, cursor: number) {
    return findAnyAt(tree, cursor,
        "text", "inlineCode", "code", "yaml", "html", "image");
}

/**
 * 
 */
export function findLiteral(tree: Node, cursor: number) {
    return findAnyAt(tree, cursor,
        "text", "inlineCode", "code", "yaml", "html");
}

/**
 * 
 */
export function findChildren(tree: Parent, type: string): Node[] {
    return tree.children.filter(node => node.type === type);
}

/**
 * 
 */
export function findDefinitionIndex(tree: Root, identifier: string): number {
    let index = 0;
    for (let node of tree.children) {
        if (node.type === "definition" &&
            node.identifier === identifier) {
            return index;
        }
        index++;
    }
    return -1;
}


/**
 * 
 */
export function indexOfChild(node: Parent, cursor: number): number {
    if (cursor === 0) return 0;
    
    let index = 0;
    
    for (let child of node.children) {
        const bounds = getNodeBounds(child);
        
        // Found it.
        if (bounds &&withinBounds(bounds, cursor)) {
            return index;
        }
        index++;
    }
    
    return -1;
}

/**
 * 
 */
export function unwrapNode(node: Node) {
    const children = node.children as Node[];
    
    if (children.length === 1) {
        const child = children[0];
        Object.assign(node, child);
    }
}

