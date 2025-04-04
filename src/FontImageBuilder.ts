import { Jimp, JimpInstance, rgbaToInt } from "jimp"
import { Palette } from "./Palette"

export class Color {
    public r: number
    public g: number
    public b: number

    public constructor(r: number, g: number, b: number) {
        this.r = r
        this.g = g
        this.b = b
    }

    public equals(other: Color): boolean {
        return this.r === other.r && this.g === other.g && this.b === other.b
    }
}

export async function buildFontImage(palette: {c0: Color, c1: Color, c2: Color, c3: Color} | Palette): Promise<JimpInstance> {
    let image: JimpInstance = await Jimp.read("./font.png") as JimpInstance

    const c0 = new Color(0, 0, 0)
    const c1 = new Color(89, 85, 88)
    const c2 = new Color(171, 161, 158)
    const c3 = new Color(225, 220, 215)

    image = await replaceColor(image, c0, palette.c0)
    image = await replaceColor(image, c1, palette.c1)
    image = await replaceColor(image, c2, palette.c2)
    image = await replaceColor(image, c3, palette.c3)

    return image
}

async function replaceColor(image: JimpInstance, targetColor: Color, replaceColor: Color): Promise<JimpInstance> {
    const targetRgb = rgbaToInt(targetColor.r, targetColor.g, targetColor.b, 255);
    const replaceRgb = rgbaToInt(replaceColor.r, replaceColor.g, replaceColor.b, 255);

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x: number, y: number, _: number) => {
        const currentColor = image.getPixelColor(x, y);

        if (currentColor === targetRgb) {
            image.setPixelColor(replaceRgb, x, y);
        }
    });

    return image;
}