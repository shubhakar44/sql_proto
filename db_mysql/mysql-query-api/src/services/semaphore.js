const semaphores = new Map();
function getSemaphore(key) {
    if (!semaphores.has(key)) {
        semaphores.set(key, { count: 0, queue: [] });
    }
    return semaphores.get(key);
}

function acquire(key) {
    const semaphore = getSemaphore(key);
    return new Promise((resolve) => {
        if (semaphore.count < 1) {
            semaphore.count++;
            resolve();
        } else {
            semaphore.queue.push(resolve);
        }
    });
}
function release(key) {
    const semaphore = getSemaphore(key);
    return new Promise((resolve) => {
        if (semaphore.count > 0) {
            semaphore.count--;
            resolve();
        } else {
            const next = semaphore.queue.shift();
            if (next) {
                next();
            }
        }
    });
}
module.exports = { acquire, release };