import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const userId = cookieStore.get('user_id')?.value

    if (!userId) {
        return NextResponse.json({ error: 'ログインしてください' }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const participantIds = JSON.parse(formData.get('participantIds') as string)
    const files = formData.getAll('images') as File[]

    const recordCount = await prisma.record.count()
    const currentStage = await prisma.stage.findFirst({
        where: { required_count: { lte: recordCount } },
        orderBy: { required_count: 'desc' },
    })

    if (!currentStage) {
        return NextResponse.json({ error: '進化段階が見つかりません' }, { status: 500 })
    }

    const record = await prisma.record.create({
        data: {
            rec_id: crypto.randomUUID(),
            title,
            content,
            user_id: userId,
            stage_id: currentStage.stage_id,
            created_at: new Date(),
        },
    })

    if (participantIds && participantIds.length > 0) {
        await prisma.recpac.createMany({
            data: participantIds.map((pid: string) => ({
                rec_id: record.rec_id,
                user_id: pid,
            })),
        })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    for (const file of files) {
        if (file.size === 0) continue

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileName = `${crypto.randomUUID()}-${file.name}`
        const filePath = path.join(uploadDir, fileName)

        await writeFile(filePath, buffer)

        await prisma.image.create({
            data: {
                image_id: crypto.randomUUID(),
                url: `/uploads/${fileName}`,
                rec_id: record.rec_id,
            },
        })
    }

    return NextResponse.json({ rec_id: record.rec_id })
}
