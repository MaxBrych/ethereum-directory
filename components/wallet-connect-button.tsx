"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Wallet } from "lucide-react"

export default function WalletConnectButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null)

  const handleConnect = async (walletType: string) => {
    setIsConnecting(true)

    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock address for demo purposes
      const mockAddress = "0x" + Math.random().toString(16).substring(2, 42)
      setConnectedAddress(mockAddress)

      // Close modal after successful connection
      setTimeout(() => setIsOpen(false), 500)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setConnectedAddress(null)
  }

  return (
    <>
      <Button
        id="wallet-connect-button"
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
        disabled={isConnecting}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {connectedAddress
          ? `${connectedAddress.substring(0, 6)}...${connectedAddress.substring(38)}`
          : "Connect Wallet"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-800">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>Choose your preferred wallet to connect to Ethereum Directory</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {connectedAddress ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-green-400">
                  Connected: {connectedAddress.substring(0, 6)}...{connectedAddress.substring(38)}
                </p>
                <Button onClick={handleDisconnect} variant="destructive">
                  Disconnect
                </Button>
              </div>
            ) : (
              <>
                <Button
                  className="flex items-center justify-between p-4 h-auto bg-neutral-800 hover:bg-neutral-700"
                  onClick={() => handleConnect("metamask")}
                  disabled={isConnecting}
                >
                  <span>MetaMask</span>
                  <img src="/metamask-fox-logo.png" alt="MetaMask" className="h-6 w-6" />
                </Button>

                <Button
                  className="flex items-center justify-between p-4 h-auto bg-neutral-800 hover:bg-neutral-700"
                  onClick={() => handleConnect("coinbase")}
                  disabled={isConnecting}
                >
                  <span>Coinbase Wallet</span>
                  <img src="/abstract-crypto-wallet.png" alt="Coinbase Wallet" className="h-6 w-6" />
                </Button>

                <Button
                  className="flex items-center justify-between p-4 h-auto bg-neutral-800 hover:bg-neutral-700"
                  onClick={() => handleConnect("walletconnect")}
                  disabled={isConnecting}
                >
                  <span>WalletConnect</span>
                  <img src="/walletconnect-icon.png" alt="WalletConnect" className="h-6 w-6" />
                </Button>

                <Button
                  className="flex items-center justify-between p-4 h-auto bg-neutral-800 hover:bg-neutral-700"
                  onClick={() => handleConnect("email")}
                  disabled={isConnecting}
                >
                  <span>Email Login</span>
                  <img src="/simple-email-icon.png" alt="Email" className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
