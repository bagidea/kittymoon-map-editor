import {
    Box,
    Flex,
    HStack,
    Image,
    Text,
    VStack
} from "@chakra-ui/react"

import {
    MutableRefObject,
    useEffect,
    useRef,
    useState
} from "react"

import MapEditor from "../src/map_editor/map_editor"

const Index = () => {
    const canvas: MutableRefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null)
    const frame: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

    const [is_view, setView] = useState<number>(1)

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
                top="20px"
                left="20px"
                padding="10px"
                backdropFilter="blur(4px)"
                rounded="full"
                alignItems="center"
                justifyContent="center"
            >
                <HStack>
                    <Flex>
                        <Text
                            fontSize="22px"
                            fontWeight="600"
                            textShadow="1px 1px 2px #909090"
                        >View :</Text>
                    </Flex>

                    <HStack
                        fontSize="18px"
                        fontWeight="600"
                    >
                        <Flex
                            w="20px"
                            h="20px"
                            bgColor={ is_view == 1 ? "black" : "white" }
                            color={ is_view == 1 ? "white" : "black" }
                            alignItems="center"
                            justifyContent="center"
                            rounded="full"
                        >
                            <Text>1</Text>
                        </Flex>

                        <Flex
                            w="20px"
                            h="20px"
                            bgColor={ is_view == 2 ? "black" : "white" }
                            color={ is_view == 2 ? "white" : "black" }
                            alignItems="center"
                            justifyContent="center"
                            rounded="full"
                        >
                            <Text>2</Text>
                        </Flex>

                        <Flex
                            w="20px"
                            h="20px"
                            bgColor={ is_view == 3 ? "black" : "white" }
                            color={ is_view == 3 ? "white" : "black" }
                            alignItems="center"
                            justifyContent="center"
                            rounded="full"
                        >
                            <Text>3</Text>
                        </Flex>
                    </HStack>
                </HStack>
            </Flex>

            <Flex
                position="absolute"
                top="20px"
                right="20px"
            >
                <VStack
                    spacing="0px"
                >
                    <Flex
                        h="70px"
                    >
                        <Image
                            src="/logo.png"
                            w="150px"
                            objectFit="cover"
                        />
                    </Flex>

                    <Text
                        fontSize="22px"
                        fontWeight="600"
                        textShadow="1px 1px 2px #909090"
                    >Map Editor</Text>

                    <Text
                        fontSize="14px"
                        fontWeight="600"
                        textShadow="1px 1px 2px #909090"
                    >version 1.0.0</Text>
                </VStack>
            </Flex>

            <Flex
                position="absolute"
                w="200px"
                bottom="250px"
                left="30px"
                fontSize="14px"
                fontWeight="600"
                color="white"
                textShadow="1px 1px 2px #909090"
            >
                <VStack
                    spacing="5px"
                    w="full"
                >
                    <Text>Move - up, down, left, right</Text>
                    <Text>Move fast - hold shift down</Text>
                    <Text>Grid show/hide - g</Text>
                    <Text>Change view - 1, 2, 3</Text>
                    <Text>Select layer 0 - ctrl up</Text>
                    <Text>Select layer 1 - hold ctrl down</Text>
                    <Text>Draw - left click</Text>
                    <Text>Erase - right click</Text>
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