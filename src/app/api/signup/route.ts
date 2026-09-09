import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST (request: Request){
    const { name, login_id, password } = await request.json()

    const existingUser = await prisma.user.findFirst({
        where: { login_id },
    })

    if(existingUser){
        return NextResponse.json({ error: 'このログインIDはすでに使われています'},{status:400})
    }

    const user = await prisma.user.create({
        data: {
            user_id: crypto.randomUUID(),
            name,
            login_id,
            password,
        },
    })

    return NextResponse.json({ user_id: user.user_id })
}