// この route.ts は、
// 「指定された rec_id の交換日記を、関連する画像・参加者・タグも含めて削除するDELETE API」

// 指定された一件の交換日記(record)を削除するためのAPI

// 特に大事：日記本体を削除する前にその日記に紐づいてる画像、参加者、タグWO先に削除している

// データベースを操作するための prisma を持ってくる
// prisma を使うことで、prisma.record.delete(...)のようにデータベースのデータを削除できます。
import { prisma } from '@/lib/prisma'

// APIから返事を返すための NextResponse を持ってくる
import { NextResponse } from 'next/server'

// DELETEというHTTPリクエストが来たときに、この処理を実行する
export async function DELETE(
    request: Request,

    // paramsを受け取る　渡されてきたオブジェクトから params を取り出す
    // 最終的に { rec_id: string } というデータになるPromise
    { params }: { params: Promise<{rec_id: string}>}
){
    const { rec_id } = await params

    // 消去の順番がめっちゃ大切
    // この日記に紐づいている画像を全部削除する
    await prisma.image.deleteMany({ where:{ rec_id }})

    // この日記に紐づいている参加者情報を全部削除
    await prisma.recpac.deleteMany({ where:{ rec_id }})

    // この日記に紐づいているタグ情報を全部削除
    await prisma.rec_tag.deleteMany({ where:{ rec_id }})

    // ここでようやく日記本体を削除します。
    await prisma.record.delete({ where: { rec_id } })

    // 「削除処理、成功したよ！」と画面側に伝えています。
    return NextResponse.json({ success: true })
}