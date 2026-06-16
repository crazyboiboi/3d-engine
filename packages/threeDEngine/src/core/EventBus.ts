export class EventBus<TEvents extends Record<string, any>> {
    private listeners = new Map<keyof TEvents, Array<(payload: any) => void>>();

    on<K extends keyof TEvents>(event: K, cb: (payload: TEvents[K]) => void) {
        const arr = this.listeners.get(event) || [];
        arr.push(cb as any);
        this.listeners.set(event, arr);
    }

    off<K extends keyof TEvents>(event: K, cb: (payload: TEvents[K]) => void) {
        const arr = this.listeners.get(event) || [];
        this.listeners.set(
            event,
            arr.filter(f => f !== cb)
        );
    }

    emit<K extends keyof TEvents>(event: K, payload: TEvents[K]) {
        const arr = this.listeners.get(event);
        if (!arr) return;

        for (const fn of arr) {
            try {
                fn(payload);
            } catch (e) {
                console.error(e);
            }
        }
    }
}