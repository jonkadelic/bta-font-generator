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
export const GREEN_PALETTE: Palette = new Palette(
    new Color(0, 0, 0),
    new Color(0, 84, 40),
    new Color(0, 175, 51),
    new Color(0, 244, 4)
)
export const BLUE_PALETTE: Palette = new Palette(
    new Color(0, 0, 0),
    new Color(1, 10, 115),
    new Color(18, 112, 253),
    new Color(56, 171, 253)
)
export const YELLOW_PALETTE: Palette = new Palette(
    new Color(0, 0, 0),
    new Color(193, 90, 0),
    new Color(255, 163, 0),
    new Color(255, 216, 0)
)
export const CYAN_PALETTE: Palette = new Palette(
    new Color(0, 0, 0),
    new Color(8, 125, 105),
    new Color(13, 224, 185),
    new Color(96, 245, 220)
)
export const PINK_PALETTE: Palette = new Palette(
    new Color(0, 0, 0),
    new Color(138, 1, 71),
    new Color(254, 102, 158),
    new Color(254, 155, 192)
)