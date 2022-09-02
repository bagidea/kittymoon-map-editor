import {
    Box,
    Flex
} from "@chakra-ui/react"

import {
    MutableRefObject,
    useEffect,
    useRef
} from "react"

import MapEditor from "../src/map_editor/map_editor"

const Index = () => {
    const canvas: MutableRefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null)
    const frame: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const game: MapEditor = new MapEditor(canvas.current, frame.current)
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
                w="200px"
                h="200px"
                padding="0px"
                left="30px"
                bottom="30px"
                border="5px dashed"
                borderColor="white"
            >
                <Box
                    ref={ frame }
                    position="absolute"
                    //w="50px"
                    //h="50px"
                    border="3px solid"
                    borderColor="white"
                />
            </Flex>
        </Flex>
    )
}

export default Index