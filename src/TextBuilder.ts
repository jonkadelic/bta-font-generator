import { Jimp, JimpInstance } from "jimp";

const LETTER_WIDTH: number = 10
const LETTER_HEIGHT: number = 12
const FONT_MAP: string[] = [
    " !\"#$%&'()*+,-./",
    "0123456789:;<=>?",
    "@ABCDEFGHIJKLMNO",
    "PQRSTUVWXYZ[\\]^_",
    "`{|}~            "
]
const FONT_WIDTHS: number[][] = [
    [10, 4, 9, 10, 10, 10, 10, 5, 5, 5, 10, 10, 5, 10, 4, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 4, 5, 7, 10, 7, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 5, 10, 5, 10, 10],
    [5, 6, 4, 6, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

export function buildText(fontImage: JimpInstance, text: string): JimpInstance {
    text = text.toUpperCase()

    let chars: {x: number, y: number}[] = []
    let textWidth: number = 0
    for (let i: number = 0; i < text.length; i++) {
        const character: string = text[i]
        const { x, y } = findCharacter(character)
        const charWidth: number = FONT_WIDTHS[y][x]
        textWidth += charWidth
        chars.push({ x, y })
    }
    textWidth -= text.length - 1 // Overlap characters

    const textHeight: number = LETTER_HEIGHT

    const textImage: JimpInstance = new Jimp({width: textWidth, height: textHeight})

    let cx: number = 0
    for (let i: number = 0; i < text.length; i++) {
        let { x, y } = chars[i]
        const charWidth: number = FONT_WIDTHS[y][x]

        const charY: number = 0
        const charHeight: number = LETTER_HEIGHT

        const charImage: JimpInstance = fontImage.clone().crop({ x: x * LETTER_WIDTH, y: y * LETTER_HEIGHT, w: charWidth, h: charHeight } ) as JimpInstance

        textImage.composite(charImage, cx, charY)
        cx += charWidth - 1 // Overlap characters
    }

    return textImage
}

function findCharacter(character: string): { x: number, y: number } {
    const index: number = FONT_MAP.findIndex((line) => line.includes(character))
    if (index === -1) {
        console.log("fallback")
        return { x: 0, y: 0 }
    }
    const x: number = FONT_MAP[index].indexOf(character)
    const y: number = index

    return { x, y }
}