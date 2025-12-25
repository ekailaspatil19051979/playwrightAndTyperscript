export interface Metrics {
    executionTime: number;
    flakeRate: number;
    totalTests: number;
    passedTests: number;
    failedTests: number;
}

let metrics: Metrics = {
    executionTime: 0,
    flakeRate: 0,
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
};

export function startTimer() {
    metrics.executionTime = Date.now();
}

export function stopTimer() {
    metrics.executionTime = Date.now() - metrics.executionTime;
}

export function recordTestResult(passed: boolean) {
    metrics.totalTests++;
    if (passed) {
        metrics.passedTests++;
    } else {
        metrics.failedTests++;
    }
    updateFlakeRate();
}

function updateFlakeRate() {
    if (metrics.totalTests > 0) {
        metrics.flakeRate = (metrics.failedTests / metrics.totalTests) * 100;
    }
}

export function getMetrics(): Metrics {
    return metrics;
}

export function resetMetrics() {
    metrics = {
        executionTime: 0,
        flakeRate: 0,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
    };
}