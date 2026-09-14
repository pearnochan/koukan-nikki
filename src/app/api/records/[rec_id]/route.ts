import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{rec_id: string}>}
){
    const { rec_id } = await params

    await prisma.image.deleteMany({ where:{ rec_id }})
    await prisma.recpac.deleteMany({ where:{ rec_id }})
    await prisma.rec_tag.deleteMany({ where:{ rec_id }})

    await prisma.record.delete({ where: { rec_id } })

    return NextResponse.json({ success: true })
}