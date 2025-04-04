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
    let images: JimpInstance[] = (await Promise.all([
        Jimp.read("/0.png"),
        Jimp.read("/1.png"),
        Jimp.read("/2.png"),
        Jimp.read("/3.png")
    ])) as JimpInstance[]

    const black = new Color(0, 0, 0)

    let processedImages: JimpInstance[] = await Promise.all([
        replaceColor(images[0], black, palette.c0),
        replaceColor(images[1], black, palette.c1),
        replaceColor(images[2], black, palette.c2),
        replaceColor(images[3], black, palette.c3)
    ])

    let combinedImage: JimpInstance = new Jimp({ width: images[0].bitmap.width, height: images[0].bitmap.height })
    combinedImage.composite(processedImages[0], 0, 0)
    combinedImage.composite(processedImages[1], 0, 0)
    combinedImage.composite(processedImages[2], 0, 0)
    combinedImage.composite(processedImages[3], 0, 0)

    return combinedImage
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