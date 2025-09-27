"use client"


import InputField from "@/components/ui/InputField"
import {useMemo, useState} from "react"
import { tsenderAbi,erc20Abi,chainsToTSender } from "@/constants"
import {useChainId,useConfig,useAccount,useWriteContract} from "wagmi"
import {readContract,waitForTransactionReceipt} from "@wagmi/core"
import CalculateTotal from "./utils/CalculateTotal/CalculateTotal"

export default function AirdropForm(){

    const [tokenAddress,setTokenAddress] = useState("")
    const [Recipients,setRecipients] = useState("")
    const [amounts,setAmounts] = useState("")
    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()
    const TotalAmount = useMemo(() => CalculateTotal(amounts),[amounts])
    const {data: hash,isPending,writeContractAsync} = useWriteContract()

    async function getApprovedAmount(tsenderAddress:string | null): Promise<number>{
        if(!tsenderAddress){
            alert("No Address Found,Please Connect to a Supported Chain")
                return 0
        }

        const response = await readContract(config,{
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address,tsenderAddress as `0x${string}`]
        })
            return response as number

    }



    async function handleSubmit(){

        const tsenderAddress = chainsToTSender[chainId]["tsender"]
        const approvedAmount = await getApprovedAmount(tsenderAddress)

        if(approvedAmount < TotalAmount){

       const approvalHash = await writeContractAsync({
               abi: erc20Abi,
               address: tokenAddress as `0x${string}`,
               functionName: "approve",
               args: [tsenderAddress as `0x${string}`,BigInt(TotalAmount)],
            })

       const approvalReceipt = await waitForTransactionReceipt(config,{
        hash: approvalHash})

        console.log("Approval Confirmed",approvalReceipt)

        await writeContractAsync({
                abi: tsenderAbi,
                address: tsenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    Recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(TotalAmount),
                ],
            },)
       
        }

        else{
            await writeContractAsync({
                abi: tsenderAbi,
                address: tsenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    Recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(TotalAmount),
                ],
            },)
        }

    }


    return (
        <div>
        <InputField
        label = "Token Address"
        placeholder = "0x"
        value = {tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        />

        <InputField
        label = "Recipients"
        placeholder = "0x123,0x2456"
        value = {Recipients}
        onChange={(e) => setRecipients(e.target.value)}
        large = {true}
        />

                <InputField
        label = "Amounts"
        placeholder = "0x"
        value = {amounts}
        onChange={(e) => setAmounts(e.target.value)}
        large = {true}
        />

        <button 
  onClick={handleSubmit}
  className="w-half bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
>
  Send Tokens
</button>
        </div>
    )



}