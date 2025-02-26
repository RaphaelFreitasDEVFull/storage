'use client'

import { Button } from '@/components/ui/button'
import { useOrganization, useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'O título deve ter pelo menos 1 caractere' })
    .max(200, { message: 'O título deve ter no máximo 200 caracteres' }),
  file: z
    .custom<FileList>(
      (val) => val instanceof FileList,
      'Arquivo deve ser um arquivo válido',
    )
    .refine((files) => files.length > 0, {
      message: 'Você deve escolher um arquivo',
    }),
})

export function UploadButton() {
  const organization = useOrganization()
  const user = useUser()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      file: undefined,
    },
  })

  const [dialogOpen, setDialogOpen] = useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) {
      return
    }
    const postUrl = await generateUploadUrl()

    const result = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': values.file[0].type,
      },
      body: values.file[0],
    })

    const { storageId } = await result.json()

    try {
      await createFile({
        name: values.title,
        orgId,
        fileId: storageId,
      })
    } catch (error) {
      toast.error('Erro ao enviar arquivo', {
        duration: 3000,
        description: 'Ocorreu um erro ao enviar o arquivo.',
        className: 'toast-error',
      })
    }

    form.reset()
    setDialogOpen(false)

    toast.success('Arquivo Enviado', {
      duration: 3000,
      description: 'Arquivo enviado com sucesso!',
      className: 'toast-success',
    })
  }

  let orgId: string | undefined = undefined

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const createFile = useMutation(api.files.createFile)

  const fileRef = form.register('file')

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(isOpen) => {
        setDialogOpen(isOpen)
        form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button>Enviar Arquivo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-6">
            Faça aqui o envio de seus arquivos
          </DialogTitle>
          <div className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Título
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Arquivo
                      </FormLabel>
                      <FormControl>
                        <Input type="file" {...fileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex gap-1"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Enviar
                </Button>
              </form>
            </Form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
