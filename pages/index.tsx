import {
    Box,
    Flex,
    HStack,
    Image,
    Text,
    useBoolean,
    VStack
} from "@chakra-ui/react"

import {
    MutableRefObject,
    useEffect,
    useRef,
    useState
} from "react"

import MapEditor from "../src/map_editor/map_editor"

const view_style = {
    w: "20px",
    h: "20px",
    bgColor: "white",
    color: "black",
    alignItems: "center",
    justifyContent: "center",
    rounded: "full"
}

const Index = () => {
    const canvas: MutableRefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null)
    const frame: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
    const stats: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

    const [is_open_menu, setOpenMenu] = useBoolean(false)
    const [is_mode, setMode] = useState<string>("land")

    useEffect(() => {
        const game: MapEditor = new MapEditor(canvas.current, frame.current, stats.current)

        game.init()
        game.setup()
        game.create()
        game.input()
        game.render()

        document.addEventListener('contextmenu', (e: MouseEvent) => e.preventDefault())
    }, [])

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
                pointerEvents="none"
            >
                <HStack>
                    <Flex>
                        <Text
                            fontSize="22px"
                            fontWeight="600"
                            textShadow="1px 1px 2px #909090"
                            color="white"
                        >View :</Text>
                    </Flex>

                    <HStack
                        fontSize="18px"
                        fontWeight="600"
                    >
                        <Flex
                            id="v_1"
                            { ...view_style }
                        ><Text>1</Text></Flex>

                        <Flex
                            id="v_2"
                            { ...view_style }
                        ><Text>2</Text></Flex>

                        <Flex
                            id="v_3"
                            { ...view_style }
                        ><Text>3</Text></Flex>
                    </HStack>
                </HStack>
            </Flex>

            <Flex
                position="absolute"
                top="90px"
                left="60px"
                padding="10px"
                backdropFilter="blur(4px)"
                alignItems="center"
                justifyContent="center"
                bgColor="red"
                w="80px"
                h="40px"
                cursor="pointer"
                userSelect="auto"
                zIndex="99"
            >
                <Flex
                    ref={ stats }
                />
            </Flex>

            <Flex
                position="absolute"
                top="20px"
                right="20px"
                pointerEvents="none"
            >
                <VStack
                    spacing="0px"
                    color="white"
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
                top="170px"
                left={ is_open_menu ? "0px" : "-190px" }
                alignItems="center"
                zIndex="5"
                transition="left 0.6s"
            >
                <Flex
                    position="absolute"
                    w="100px"
                    left="150px"
                    bgColor="white"
                    roundedTop="10px"
                    alignItems="center"
                    justifyContent="center"
                    transform="rotate(90deg)"
                    cursor="pointer"

                    onClick={ setOpenMenu.toggle }
                >
                    <Text
                        fontWeight="800"
                        color="rgb(150, 150, 255)"
                    >MENU</Text>
                </Flex>

                <VStack
                    spacing="15px"
                    alignItems="start"
                >
                    <Flex
                        w="180px"
                        h="50px"
                        pl="15px"
                        bgColor={ is_mode == "land" ? "rgba(50, 50, 200, 0.5)" : "" }
                        border="2px solid"
                        borderColor="white"
                        borderLeft="0px"
                        backdropFilter="blur(5px)"
                        alignItems="center"
                        cursor="pointer"
                        roundedRight="5px"

                        onClick={ () => { setMode("land") } }
                    >
                        <Text
                            fontSize="24px"
                            fontWeight="800"
                            color="white"
                            textShadow="2px 2px 2px black"
                        >Land editor</Text>
                    </Flex>

                    <Flex
                        w="180px"
                        h="50px"
                        pl="15px"
                        bgColor={ is_mode == "objects" ? "rgba(50, 50, 200, 0.5)" : "" }
                        border="2px solid"
                        borderColor="white"
                        borderLeft="0px"
                        backdropFilter="blur(5px)"
                        alignItems="center"
                        cursor="pointer"
                        roundedRight="5px"

                        onClick={ () => { setMode("objects") } }
                    >
                        <Text
                            fontSize="24px"
                            fontWeight="800"
                            color="white"
                            textShadow="2px 2px 2px black"
                        >Objects</Text>
                    </Flex>

                    <Flex
                        w="180px"
                        h="50px"
                        pl="15px"
                        bgColor={ is_mode == "houses" ? "rgba(50, 50, 200, 0.5)" : "" }
                        border="2px solid"
                        borderColor="white"
                        borderLeft="0px"
                        backdropFilter="blur(5px)"
                        alignItems="center"
                        cursor="pointer"
                        roundedRight="5px"

                        onClick={ () => { setMode("houses") } }
                    >
                        <Text
                            fontSize="24px"
                            fontWeight="800"
                            color="white"
                            textShadow="2px 2px 2px black"
                        >Houses</Text>
                    </Flex>

                    <Flex
                        w="180px"
                        h="50px"
                        pl="15px"
                        bgColor={ is_mode == "collision" ? "rgba(50, 50, 200, 0.5)" : "" }
                        border="2px solid"
                        borderColor="white"
                        borderLeft="0px"
                        backdropFilter="blur(5px)"
                        alignItems="center"
                        cursor="pointer"
                        roundedRight="5px"
                        
                        onClick={ () => { setMode("collision") } }
                    >
                        <Text
                            fontSize="24px"
                            fontWeight="800"
                            color="white"
                            textShadow="2px 2px 2px black"
                        >Collisions</Text>
                    </Flex>
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
                pointerEvents="none"
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