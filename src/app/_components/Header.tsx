import { Button } from '@/components/ui/button'
import {
  OrganizationSwitcher,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/nextjs'

export function Header() {
  return (
    <div className="border-b bg-gray-50">
      <div className="container max-w-[1400px] mx-auto flex items-center justify-between py-4">
        <div>
          <p>RSFDrive</p>
        </div>
        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton mode="modal">
              <Button> Entrar</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  )
}
