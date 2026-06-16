// utils/throttle.ts

export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    delay: number = 100
): (...args: Parameters<T>) => void {
    let lastCall = 0;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        const now = Date.now();
        const remaining = delay - (now - lastCall);

        if (remaining <= 0) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            lastCall = now;
            fn.apply(this, args);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                lastCall = Date.now();
                timeout = null;
                fn.apply(this, args);
            }, remaining);
        }
    };
}