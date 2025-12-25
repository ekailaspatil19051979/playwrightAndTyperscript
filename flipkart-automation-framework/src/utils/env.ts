export const getEnvVariable = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (value === undefined && defaultValue === undefined) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value || defaultValue!;
};

export const loadEnvConfig = (envFilePath: string): void => {
    const fs = require('fs');
    const path = require('path');
    const envConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, envFilePath), 'utf-8'));
    
    for (const key in envConfig) {
        process.env[key] = envConfig[key];
    }
};