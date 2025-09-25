"use client"

import { ReactNode } from "react"
import config from "./rainbowKitConfig"
import {WagmiProvider} from "wagmi"
import {RainbowKitProvider,ConnectButton} from "@rainbow-me/rainbowkit"
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"
import {useState} from "react"
import "@rainbow-me/rainbowkit/styles.css"

export function Providers(props: {children: ReactNode}){
const [queryclient] = useState(() => new QueryClient())
    return(

        <WagmiProvider config={config}>
        <QueryClientProvider client= {queryclient}>
            <RainbowKitProvider>
                {props.children}
            </RainbowKitProvider>
        </QueryClientProvider>

        </WagmiProvider>
    )


}



