
declare module 'unist-util-find' {
    import { Node } from 'unist';
    
    type TestFn = (node: Node) => boolean;
    type Condition = string | object | TestFn;
    
    const find: (parent: Node, condition: Condition) => Node | undefined;
    export = find;
}

declare module 'remark-html' {
    // @todo Fill this in.
    type Options = any;
    
    const plugin: (options?: Options) => void;
    export = plugin;
}

declare module 'remark-react' {
    // @todo Fill this in.
    type Options = any;
    
    const plugin: (options?: Options) => void;
    export = plugin;
}

declare module 'remark-rehype' {
    // @todo Fill this in.
    type Options = any;
    
    const plugin: (options?: Options) => void;
    export = plugin;
}

declare module 'rehype-stringify' {
    // @todo Fill this in.
    type Options = any;
    
    const plugin: (options?: Options) => void;
    export = plugin;
}

declare module 'rehype-react' {
    // @todo Fill this in.
    type Options = any;
    
    const plugin: (options?: Options) => void;
    export = plugin;
}

declare module 'unist-util-visit' {
    import { Node } from 'unist';
    
    type TransformFn = (node: Node) => void;
    
    const visit: (tree: Node, type: string, transform: TransformFn) => void;
    export = visit;
}
