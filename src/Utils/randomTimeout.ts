const randomTimeout = (maxTimeMs: number = 20) =>
    new Promise(resolve => {
        const timer = Math.random() * maxTimeMs;
        setTimeout(() => resolve(timer), timer);
    });

export default randomTimeout;
