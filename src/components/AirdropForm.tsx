"use client"


import InputField from "@/components/ui/InputField"
import {useMemo, useState,useEffect} from "react"
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
    const [tokenName, setTokenName] = useState<string>("-")
    const [tokenDecimals, setTokenDecimals] = useState<number>(18)



useEffect(() => {
  const fetchTokenDetails = async () => {
    if (!tokenAddress || !tokenAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setTokenName("-")
      setTokenDecimals(18)
      return
    }

    try {
      // Fetch token name
      const name = await readContract(config, {
        address: tokenAddress as `0x${string}`,
        abi: [
          {
            name: 'name',
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ type: 'string' }],
          },
        ],
        functionName: 'name',
      })
      setTokenName(name as string)

      // Fetch token decimals
      const decimals = await readContract(config, {
        address: tokenAddress as `0x${string}`,
        abi: [
          {
            name: 'decimals',
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ type: 'uint8' }],
          },
        ],
        functionName: 'decimals',
      })
      setTokenDecimals(decimals as number)
    } catch (error) {
      console.error("Error fetching token details:", error)
      setTokenName("Invalid Token")
      setTokenDecimals(18)
    }
  }

  fetchTokenDetails()
}, [tokenAddress, config])

// Calculate total amount - amounts input is in wei, convert to tokens
const totalWei = CalculateTotal(amounts)
const totalTokens = totalWei / Math.pow(10, tokenDecimals)










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
<br />
        {/* Right column - Transaction Details */}
<div className="bg-black p-6 rounded-lg border border-gray-200">
  <h3 className="text-lg font-semibold text-white-800 mb-4">Transaction Details</h3>
  
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-white-600">Token Name:</span>
      <span className="font-medium text-white-800">{tokenName}</span>
    </div>
    
    <div className="flex justify-between items-center">
      <span className="text-white-600">Total Amount (wei):</span>
      <span className="font-medium text-white-800">
        {totalWei.toLocaleString()} wei
      </span>
    </div>
    
    <div className="flex justify-between items-center">
      <span className="text-white-600">Total Tokens:</span>
      <span className="font-medium text-white-800">
        {totalTokens}
      </span>
    </div>
    

  </div>
</div>


            <br />

        <button 
  onClick={handleSubmit}
  className="w-half bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
>
  Send Tokens
</button>
        </div>
    )



}