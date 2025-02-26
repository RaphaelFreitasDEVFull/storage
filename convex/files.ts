import { ConvexError, v } from 'convex/values'
import { mutation, MutationCtx, query, QueryCtx } from './_generated/server'
import { getUser } from './users'

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new ConvexError('User is not authenticated')
  }
  return await ctx.storage.generateUploadUrl()
})

async function hasAcessToOrg(
  tokenIdentifier: string,
  orgId: string,
  ctx: QueryCtx | MutationCtx,
) {
  const user = await getUser(ctx, tokenIdentifier)

  const hasAcess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId)

  return hasAcess
}

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
    fileId: v.id('_storage'),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new ConvexError('User is not authenticated')
    }

    const hasAcess = await hasAcessToOrg(
      identity.tokenIdentifier,
      args.orgId,
      ctx,
    )

    if (!hasAcess) {
      throw new ConvexError('User does not have access to this organization')
    }
    await ctx.db.insert('files', {
      name: args.name,
      orgID: args.orgId,
      fileId: args.fileId,
    })
  },
})

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      return []
    }

    const hasAcess = await hasAcessToOrg(
      identity.tokenIdentifier,
      args.orgId,
      ctx,
    )

    if (!hasAcess) {
      return []
    }
    return await ctx.db
      .query('files')
      .withIndex('by_orgID', (q) => q.eq('orgID', args.orgId))
      .collect()
  },
})

export const deleteFile = mutation({
  args: { fileId: v.id('files') },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      return []
    }

    const file = await ctx.db.get(args.fileId)

    if (!file) {
      throw new ConvexError('This file not exists')
    }

    const hasAcess = await hasAcessToOrg(
      identity.tokenIdentifier,
      file.orgID,
      ctx,
    )
    if (!hasAcess) {
      throw new ConvexError('User does not have access to this file')
    }

    await ctx.db.delete(args.fileId)
  },
})
