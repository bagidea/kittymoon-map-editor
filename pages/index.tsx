import { Flex } from "@chakra-ui/react"

import {
    MutableRefObject,
    useEffect,
    useRef
} from "react"

import CoreEngine from "../src/core3d/core_engine"

const Index = () => {
    const canvas: MutableRefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const game: CoreEngine = new CoreEngine(canvas.current)
        game.init()
        game.create()
        game.input()
        game.render()
    })

    return (
        <Flex
            w="100vw"
            h="100vh"
        >
            <canvas ref={ canvas } />
        </Flex>
    )
}

export default Index