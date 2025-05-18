export const generateId = (): string => {
    return (Math.random() * 1e16).toString(36); // Simple random string generator
};