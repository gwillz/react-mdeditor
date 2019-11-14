
import { useEffect, useRef } from "react";

export function useDebounce(cb: () => void, timeout: number, deps: any[]) {
    const timer = useRef(0);
    const last = useRef<() => void>();
    
    useEffect(() => {
        if (!timer.current) {
            // Fire off immediately.
            cb();
            
            // Block subsequent callbacks.
            timer.current = window.setTimeout(block, timeout);
        }
        else {
            // Still waiting.
            last.current = cb;
        }
    }, [timeout, ...deps]);
    
    useEffect(() => stop, []);
    
    function block() {
        // Unmounted.
        if (timer.current == 0) return;
        
        // Fire off the last one, block again.
        if (last.current) {
            last.current();
            last.current = undefined;
            block();
        }
        // No more blocking. Ready for a new immediate callback.
        else {
            timer.current = 0;
        }
    }
    
    function stop() {
        window.clearTimeout(timer.current);
        timer.current = 0;
    }
    
    return stop;
}
