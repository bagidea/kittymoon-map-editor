import { ChakraProvider } from "@chakra-ui/react"
import theme from "../src/theme"

const App = ({ Component, pageProps }) => (
    <ChakraProvider
        theme={ theme }
    >
        <Component
            { ...pageProps }
        />
    </ChakraProvider>
)

export default App