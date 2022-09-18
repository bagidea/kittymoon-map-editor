import { ChakraProvider } from "@chakra-ui/react"
import Head from "next/head"
import theme from "../src/theme"

const App = ({ Component, pageProps }) => (
    <ChakraProvider
        theme={ theme }
    >
        <Head>
            <link rel="icon" type="image/png" href="/icon.png" />
        </Head>

        <Component
            { ...pageProps }
        />
    </ChakraProvider>
)

export default App