import {
    Box,
    Flex
} from "@chakra-ui/react"

import {
    MutableRefObject,
    useEffect,
    useRef
} from "react"

import CoreEngine from "../src/core3d/core_engine"

const Index = () => {
    const canvas: MutableRefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null)
    const frame: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

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

            <Flex
                position="absolute"
                w="250px"
                h="250px"
                left="50px"
                bottom="50px"
                border="3px dashed"
                borderColor="white"
            >
                <Box
                    ref={ frame }
                    w="50px"
                    h="50px"
                    border="3px solid"
                    borderColor="white"
                />
            </Flex>
        </Flex>
    )
}

export default Index