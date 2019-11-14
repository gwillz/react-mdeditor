
# React-Remark-Editor



## TODO

+ wrapping actions
  + content (strong/em/code/strike)
  + no-line-break (image/anchor)
  + convert paragraph/line-break (lists/blockquote)
  + ignore and do toggles (header/auto-enter)
+ undo/redo manager
+ fix cursor restore
  + enter actions
+ fix void space separator
+ un-indent a list-item / break-apart
  + ...rejoin a list?
  + does the toggle have to toggle?
  + can it just increment the depth?
+ create a getOffsetIndex(tree, at, offset)
  + returns -1 when on first child
+ create a getIndexBefore(tree, at)
  + is this the same?
+ remark-html option types
+ svg icons for demo toolbar
