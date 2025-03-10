import { ConvexError, v } from 'convex/values'
import { internalMutation, MutationCtx, QueryCtx } from './_generated/server'

export async function getUser(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
) {
  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) =>
      q.eq('tokenIdentifier', tokenIdentifier),
    )
    .first()

  // Handle case where user is not found
  if (!user) {
    throw new ConvexError('User not found')
  }

  return user
}

export const createUser = internalMutation({
  args: { tokenIdentifier: v.string() },
  async handler(ctx, args) {
    await ctx.db.insert('users', {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
    })
  },
})

export const orgIdToUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgIds: v.string() },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier)
    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, args.orgIds],
    })
  },
})
