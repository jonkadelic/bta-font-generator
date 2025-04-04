import { JimpInstance } from "jimp"
import { buildFontImage } from "./FontImageBuilder"
import { Palette } from "./Palette"

export class FontCache {
    public static INSTANCE: FontCache = new FontCache()

    private map: {palette: Palette, image: JimpInstance}[] = []

    private constructor() {
        // Singleton pattern
    }

    public async getFont(palette: Palette): Promise<JimpInstance> {
        let font = this.findFont(palette)
        if (font) {
            return font
        }
        const fontImage: JimpInstance = await buildFontImage(palette)

        this.map.push({ palette, image: fontImage })
        return fontImage
    }

    private findFont(palette: Palette): JimpInstance | undefined {
        const entry = this.map.find(entry => entry.palette.equals(palette))
        return entry ? entry.image : undefined
    }
}