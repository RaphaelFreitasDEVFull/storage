'use client'

import { Button } from '@/components/ui/button'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useSession,
} from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export default function Home() {
  const createFile = useMutation(api.files.createFile)
  const files = useQuery(api.files.getFiles)

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <SignedOut>
          <SignInButton mode="modal">
            <Button>Entrar</Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <SignOutButton>
            <Button>Sair</Button>
          </SignOutButton>
        </SignedIn>

        {files?.map((file) => {
          return <p key={file._id}>{file.name}</p>
        })}

        <Button
          onClick={() =>
            createFile({
              name: 'Hello Word',
            })
          }
        >
          Click Me
        </Button>
      </main>
    </div>
  )
}
