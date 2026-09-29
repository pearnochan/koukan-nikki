import { prisma } from '@/lib/prisma'
import { error } from 'console'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params : Promise<{ image_id: string}>}
){
    const { image_id } = await params

    const image = await prisma.image.findUnique({
        where: { image_id },
    })

    if (!image) {
        return NextResponse.json({ error: '画像が見つかりません' }, { status: 404 })
    }

    return new NextResponse(image.data, {
        headers:{
            'Content-Type': image.mime_type,
        },
    })
}