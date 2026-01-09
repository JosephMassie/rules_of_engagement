export function toKey(str: string): string {
    return str.toLowerCase().replace(/\s+/g, '_');
}

export function fromKey(key: string): string {
    return key
        .split('_')
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');
}
