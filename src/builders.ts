
import {
    Text, 
    LinkReference, 
    ThematicBreak, 
    Definition, 
    ImageReference, 
    StaticPhrasingContent,
} from 'mdast';

export * from 'mdast-builder';

export function thematicBreak(): ThematicBreak {
    return { type: 'thematicBreak' }
}

export function linkReference(identifier: string, children: StaticPhrasingContent[]): LinkReference {
    return {
        type: "linkReference",
        referenceType: "full",
        identifier,
        children,
    }
}

export function imageReference(identifier: string, alt: string): ImageReference {
    return {
        type: "imageReference",
        referenceType: "full",
        children: [],
        identifier,
        alt,
    }
}

export function definition(identifier: string, url: string): Definition {
    return {
        type: "definition",
        label: identifier,
        identifier,
        url,
    }
}
