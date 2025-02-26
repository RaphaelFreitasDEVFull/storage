'use client'

import { useOrganization, useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

import { UploadButton } from './_components/UploadButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FileCard } from './_components/FileCard'
export default function Home() {
  const organization = useOrganization()
  const user = useUser()

  let orgId: string | undefined = undefined

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip')

  return (
    <main className="container max-w-[1400px] mx-auto pt-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Seus arquivos</h1>
        <UploadButton />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {files?.map((file) => <FileCard key={file._id} file={file} />)}
      </div>
    </main>
  )
}
