import { Color } from "./FontImageBuilder";

export class Palette {
    public c0: Color
    public c1: Color
    public c2: Color
    public c3: Color

    public constructor(c0: Color, c1: Color, c2: Color, c3: Color) {
        this.c0 = c0
        this.c1 = c1
        this.c2 = c2
        this.c3 = c3
    }

    public equals(other: Palette): boolean {
        return this.c0.equals(other.c0) && this.c1.equals(other.c1) && this.c2.equals(other.c2) && this.c3.equals(other.c3)
    }
}

export const DEFAULT_PALETTE: Palette = new Palette(
    new Color(0, 0, 0),
    new Color(89, 85, 88),
    new Color(171, 161, 158),
    new Color(225, 220, 215)
)
export const RED_PALETTE: Palette = new Palette(
    new Color(0, 0, 0),
    new Color(99, 0, 27),
    new Color(198, 0, 27),
    new Color(255, 42, 42)
)