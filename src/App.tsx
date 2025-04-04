import React, { ChangeEvent, ReactNode, useReducer, useState } from 'react'
import './App.css'
import { DEFAULT_PALETTE, Palette } from './Palette'
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

function LineGroup(): ReactNode {
    const [lines, setLines] = useState<{id: number, line: string}[]>([{id: 0, line: ''}])
    const [image, setImage] = useState<string>('')

    function addLine(after?: number): void {
        let newLines = [...lines]
        if (after !== undefined) {
            newLines.splice(after + 1, 0, {id: newLines.length, line: ''})
        } else {
            newLines.push({id: newLines.length, line: ''})
        }
        setLines(newLines)

        regenerate(newLines)
    }

    function deleteLine(index: number): void {
        let newLines = [...lines]
        newLines.splice(index, 1)
        setLines(newLines)

        regenerate(newLines)
    }

    function regenerate(lines: {id: number, line: string}[]): void {
        let palette: Palette = DEFAULT_PALETTE
        let lineData = lines.map((line) => ({ palette, text: line.line }))
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
                            <LineBuilder index={index} onChanged={onChanged} addLine={addLine} />
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

function LineBuilder({ index, onChanged, addLine }: { index: number, onChanged: (index: number, line: string) => void, addLine: (after?: number) => void }): ReactNode {
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
