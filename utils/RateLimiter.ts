export class RateLimiter {
    private tokens: number;
    private lastRefill: number;
    private maxTokens: number;
    private refillRate: number; // Tokens per second

    constructor(maxTokens: number = 10, refillRate: number = 2) {
        this.maxTokens = maxTokens;
        this.refillRate = refillRate;
        this.tokens = maxTokens;
        this.lastRefill = Date.now();
    }

    private refill() {
        const now = Date.now();
        const timePassed = (now - this.lastRefill) / 1000;
        const newTokens = timePassed * this.refillRate;

        this.tokens = Math.min(this.maxTokens, this.tokens + newTokens);
        this.lastRefill = now;
    }

    tryAcquire(cost: number = 1): boolean {
        this.refill();
        if (this.tokens >= cost) {
            this.tokens -= cost;
            return true;
        }
        return false;
    }

    getRemainingTokens(): number {
        this.refill();
        return Math.floor(this.tokens);
    }
}
