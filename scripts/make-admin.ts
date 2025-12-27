#!/usr/bin/env tsx
import "dotenv/config"
import { prisma } from "@/lib/prisma"

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error("Usage: pnpm run make-admin <email>")
    process.exit(1)
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (!existing) {
      console.error(`No user found with email: ${email}`)
      process.exit(2)
    }

    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" }
    })

    console.log(`User updated to ADMIN: ${user.email} (id=${user.id})`)
  } catch (err: any) {
    console.error("Failed to update user role:", err?.message || err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
.catch((e) => {
  console.error(e)
  process.exit(1)
})
