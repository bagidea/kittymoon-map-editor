import {
    Box,
    Flex,
    Text,
    VStack
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
        game.setup()
        game.create()
        game.input()
        game.render()

        document.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault())
    })

    return (
        <Flex
            position="relative"
            w="100vw"
            h="100vh"
            userSelect="none"
        >
            <canvas ref={ canvas } />

            <Flex
                position="absolute"
                w="200px"
                bottom="240px"
                left="30px"
                fontSize="14px"
            >
                <VStack
                    spacing="0px"
                    w="full"
                >
                    <Text>Move - up, down, left, right</Text>
                    <Text>Move fast - hold shift</Text>
                    <Text>Grid show/hide - g</Text>
                </VStack>
            </Flex>

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
                    border="3px solid"
                    borderColor="white"
                />
            </Flex>
        </Flex>
    )
}

export default Index