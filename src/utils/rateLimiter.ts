export class RateLimiter {
  private queue: any[] = [];
  private processing = false;
  private requestsPerMinute: number;
  private processCallback: (item: any) => Promise<void>;

  constructor(requestsPerMinute: number, processCallback: (item: any) => Promise<void>) {
    this.requestsPerMinute = requestsPerMinute;
    this.processCallback = processCallback;
  }

  addToQueue(items: any[]) {
    this.queue.push(...items);
    if (!this.processing) {
      this.processQueue(); // Start processing if not already processing
    }
  }

  // Make getNextRow public
  public getNextRow(): any | undefined {
    return this.queue.shift(); // Get the next row from the queue
  }

  private async processQueue() {
    this.processing = true;
    const batchSize = this.requestsPerMinute;
    
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, batchSize);
      const startTime = Date.now();

      // Process batch items concurrently while respecting rate limit
      await Promise.all(
        batch.map(item => this.processCallback(item))
      );

      // Calculate time spent and wait if needed
      const timeSpent = Date.now() - startTime;
      const timeToWait = Math.max(60000 - timeSpent, 0);
      
      if (this.queue.length > 0 && timeToWait > 0) {
        await new Promise(resolve => setTimeout(resolve, timeToWait));
      }
    }

    this.processing = false;
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}
