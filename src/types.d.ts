
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
