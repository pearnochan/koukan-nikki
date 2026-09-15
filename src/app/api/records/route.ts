// route.ts 自体が「API」というより、APIの具体的な処理を書くファイル

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// 「POSTという名前のAPI処理を定義して、リクエストを request として受け取る」
export async function POST(request: Request) {
    
    // ブラウザから送られてきたCookieを取得して、cookieStore に入れる
    const cookieStore = await cookies()

    // Cookieの中から user_id を探して、その値を userId に入れている
    const userId = cookieStore.get('user_id')?.value

    // 「もし userId がなかったら」
    if (!userId) {
        return NextResponse.json({ error: 'ログインしてください' }, { status: 401 })
    }

    // リクエストの中に入ってきたフォームの入力データを取り出して、formData に入れている
    const formData = await request.formData()

    // で取り出したフォームデータから、「title」という名前の入力欄の値を取り出している。
    const title = formData.get('title') as string

    // フォームから content という名前の入力値を取り出して、文字列として content という変数に入れている。
    const content = formData.get('content') as string

    // フォームから participantIds を取り出して、それをJSONから元のデータに戻し、participantIds という変数に入れる
    const participantIds = JSON.parse(formData.get('participantIds') as string)


    const files = formData.getAll('images') as File[]

    // データベースの record テーブルに何件の記録があるか数えて、その結果を recordCount という変数に保存する。
    const recordCount = await prisma.record.count()

    // 現在の記録数で到達できるステージの中から、一番上の（最も進んだ）ステージを取得している。
    const currentStage = await prisma.stage.findFirst({
        // 「required_count が recordCount 以下のデータを探して」
        where: { required_count: { lte: recordCount } },
        // 「required_count の大きい順に並べて」**という指定です。
        orderBy: { required_count: 'desc' },
    })

    // 現在のステージが見つからなかったら、エラーを返して処理を終了する
    if (!currentStage) {
        return NextResponse.json({ error: '進化段階が見つかりません' }, { status: 500 })
    }

    // 新しい「記録（record）」をデータベースに1件登録して、その登録した記録を record という変数に入れている
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

    // 「もし参加者IDが存在して、なおかつ1人以上いたら」という条件です。
    if (participantIds && participantIds.length > 0) {
        // recpac テーブルに複数のデータをまとめて登録します。
        await prisma.recpac.createMany({
            data: participantIds.map((pid: string) => ({
                // 今回作った記録のIDを入れます。
                rec_id: record.rec_id,
                // 参加者本人のユーザーIDを入れます。
                user_id: pid,
            })),
        })
    }

    // 画像を保存するためのフォルダを用意しているコード
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    // uploadDir に指定したフォルダを作ってね」という処理です。
    await mkdir(uploadDir, { recursive: true })

    // files の中に入っているファイルを、1個ずつ取り出して処理する
    for (const file of files) {

        // 「このファイルのサイズが0だったら」
        if (file.size === 0) continue

        // 「今の画像ファイルの中身をデータとして読み込んで、それを bytes に入れる」
        const bytes = await file.arrayBuffer()
        // ファイルとして保存しやすい形（Buffer）に変換している処理
        const buffer = Buffer.from(bytes)
        // アップロードされた画像に「かぶりにくい名前」をつけている処理
        const fileName = `${crypto.randomUUID()}-${file.name}`
        // 画像を保存する場所とファイル名をつなげて、実際に保存するファイルの場所を filePath に入れる
        const filePath = path.join(uploadDir, fileName)

        // buffer に入っている画像データを、filePath に指定した場所へファイルとして保存して、保存が終わるまで待つ
        // 画像ファイル本体
        await writeFile(filePath, buffer)

        // 画像ファイルを保存したあと、その画像の情報をデータベースにも登録する
        // DBに保存しているもの
        // DBのimageテーブルには、画像そのものではなく、「その画像がどこに保存されているか」という、パス(住所)の文字列だけを保存
        // 画像ファイルは、テキストデータに比べてサイズが大きいため、DBに直接入れてしまうと、DB自体が重く、扱いにくくなってしまいます。「大きいデータはファイルとして保存し、DBにはその場所の情報だけ持たせる」というのが、一般的なやり方
        await prisma.image.create({
            data: {
                image_id: crypto.randomUUID(),
                url: `/uploads/${fileName}`,
                rec_id: record.rec_id,
            },
        })
    }

    // APIで記録作成が成功したので、作成した記録のIDをJSONで画面側に返す
    return NextResponse.json({ rec_id: record.rec_id })
}
