export const hsbToRgb = (h, s, b) => {
    s /= 100;
    b /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
};

export const rgbToHex = (r, g, b) => {
    const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const hexToRgb = (hex) => {
    // Remove the leading '#' if present
    hex = hex.replace(/^#/, '');

    // Parse r, g, b values
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return { r, g, b };
};

export const hsbaToHex = ({ hue, saturation, brightness, alpha } = {}) => {
    if (hue === undefined || saturation === undefined || brightness === undefined) {
        return '#000000'; // Default color if any property is missing
    }
    const [r, g, b] = hsbToRgb(hue, saturation * 100, brightness * 100);
    const hex = rgbToHex(r, g, b);

    if (alpha !== undefined) {
        const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
        return hex + alphaHex;
    }

    return hex;
};

export const darkenColor = (hex, amount) => {
    const { r, g, b } = hexToRgb(hex);

    const darken = (value) => Math.max(0, Math.min(255, value * (1 - amount)));

    return rgbToHex(darken(r), darken(g), darken(b));
};

export const lightenColor = (hex, amount) => {
    const { r, g, b } = hexToRgb(hex);

    const lighten = (value) => Math.max(0, Math.min(255, value + (255 - value) * amount));

    return rgbToHex(lighten(r), lighten(g), lighten(b));
};