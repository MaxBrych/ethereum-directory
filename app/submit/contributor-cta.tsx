"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function ContributorCTA() {
  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="text-white" />
          Contributor Access Required
        </CardTitle>
        <CardDescription>You need to mint a Contributor NFT to submit listings</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-300 mb-4">
          To maintain quality and prevent spam, only contributors can submit new listings to the Ethereum Directory.
          Becoming a contributor is easy - just mint our Contributor NFT.
        </p>
        <p className="text-neutral-300">The Contributor NFT gives you:</p>
        <ul className="list-disc list-inside text-neutral-300 mt-2 space-y-1">
          <li>Ability to submit new listings</li>
          <li>Voting power on submissions</li>
          <li>Recognition in the community</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-white hover:bg-neutral-100">Mint Contributor NFT</Button>
      </CardFooter>
    </Card>
  )
}
