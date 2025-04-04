import { ChangeEvent, ReactNode, useState } from 'react'
import './App.css'
import { BLUE_PALETTE, CYAN_PALETTE, DEFAULT_PALETTE, GREEN_PALETTE, Palette, PINK_PALETTE, RED_PALETTE, YELLOW_PALETTE } from './Palette'
import { buildText } from './TextBuilder'
import { Jimp, JimpInstance, ResizeStrategy } from 'jimp'
import { FontCache } from './FontCache'

function App() {
    return (
        <>
            <div>
                <LineGroup />
            </div>
        </>
    )
}

const LINE_COLORS: Palette[] = [
    DEFAULT_PALETTE,
    RED_PALETTE,
    GREEN_PALETTE,
    BLUE_PALETTE,
    YELLOW_PALETTE,
    CYAN_PALETTE,
    PINK_PALETTE
]

function LineGroup(): ReactNode {
    const [lines, setLines] = useState<{id: number, line: string, colorId: number }[]>([{ id: 0, line: '', colorId: 0 }])
    const [image, setImage] = useState<string>('')

    function addLine(after?: number): void {
        let newLines = [...lines]
        if (after !== undefined) {
            newLines.splice(after + 1, 0, {id: newLines.length, line: '', colorId: 0 })
        } else {
            newLines.push({id: newLines.length, line: '', colorId: 0 })
        }
        setLines(newLines)

        regenerate(newLines)
    }

    function lineNextColor(index: number): void {
        let newLines = [...lines]
        let line = newLines[index]
        line.colorId = (line.colorId + 1) % LINE_COLORS.length
        setLines(newLines)

        regenerate(newLines)
    }

    function deleteLine(index: number): void {
        let newLines = [...lines]
        newLines.splice(index, 1)
        setLines(newLines)

        regenerate(newLines)
    }

    function regenerate(lines: {id: number, line: string, colorId: number}[]): void {
        let lineData = lines.map((line) => ({ palette: LINE_COLORS[line.colorId], text: line.line }))
        getLines(lineData).then((image) => {
            image.resize({ w: 4 * image.bitmap.width, mode: ResizeStrategy.NEAREST_NEIGHBOR })
            image.getBase64("image/png").then((base64) => {
                setImage(base64)
            })
        })
    }

    function onChanged(index: number, line: string): void {
        let newLines = [...lines]
        newLines[index].line = line
        setLines(newLines)

        regenerate(newLines)
    }

    return (
        <>
            <div className="line-group">
                <ul>
                    {lines.map(({id}, index) => (
                        <li key={id}>
                            <LineBuilder index={index} onChanged={onChanged} addLine={addLine} deleteLine={deleteLine} lineNextColor={lineNextColor} />
                        </li>
                    ))}
                </ul>
                <br />
                <button onClick={() => {addLine()}}>Add Line</button>
                <br />
                <br />
                <img src={image} alt="Generated" />
            </div>
        </>
    )
}

function LineBuilder({ index, onChanged, addLine, deleteLine, lineNextColor }: { index: number, onChanged: (index: number, line: string) => void, addLine: (after?: number) => void, deleteLine: (index: number) => void, lineNextColor: (index: number) => void }): ReactNode {
    function updateParent(e: ChangeEvent<HTMLInputElement>): void {
        let text = e.target.value
        onChanged(index, text)
    }

    return (
        <>
            <div className="line">
                <input autoFocus type="text" width="400" onChange={updateParent} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        addLine(index)
                    }
                }}></input>
                <button onClick={() => {deleteLine(index)}}>X</button>
                <button onClick={() => {lineNextColor(index)}}>C</button>
            </div>
        </>)
}

async function getLines(lines: { palette: Palette, text: string }[]): Promise<JimpInstance> {
    let images: JimpInstance[] = await Promise.all(lines.map(async (line) => {
        let font: JimpInstance = await FontCache.INSTANCE.getFont(line.palette)
        return buildText(font, line.text)
    }))

    // get widest image
    let maxWidth: number = Math.max(...images.map(image => image.bitmap.width))

    let lineHeight = images[0].bitmap.height
    let combinedImage: JimpInstance = new Jimp({ width: maxWidth, height: lineHeight * lines.length })
    images.forEach((image, index) => {
        let width = image.bitmap.width
        let x= Math.floor((maxWidth - width) / 2)
        combinedImage.composite(image, x, index * lineHeight)
    })

    return combinedImage
}

export default App
