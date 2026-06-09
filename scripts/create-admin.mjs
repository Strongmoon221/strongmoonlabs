import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((res) => rl.question(q, res))

async function main() {
  console.log('\n=== Create Admin User ===\n')

  const email = await ask('Email: ')
  const password = await ask('Password: ')
  const name = await ask('Name (optional): ')

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    console.log('\n❌ User with this email already exists.')
    process.exit(1)
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.adminUser.create({
    data: { email, password: hashed, name: name || null },
  })

  console.log(`\n✅ Admin created: ${user.email} (id: ${user.id})\n`)
}

main()
  .catch(console.error)
  .finally(async () => {
    rl.close()
    await prisma.$disconnect()
  })
