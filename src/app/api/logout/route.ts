// ログアウト用のAPIファイル
// 「ログアウトしてください」というPOSTリクエストが来たら、ログイン情報を保存しているCookieを削除する

// サーバーからの返事を作るための道具です。ログインAPI・記録作成APIでも毎回使っていた、おなじみのもの
import { NextResponse } from "next/server";

// クッキーを操作するための道具です。今回は削除するために使います。
import { cookies } from 'next/headers'

import { prisma } from '@/lib/prisma'


// POSTという名前の関数を定義しています。
// この名前にすることで「method: 'POST'で来たリクエストの時に、この関数が実行される」というNext.jsのルールが働きます。
export async function POST (){
    // Cookieを操作するための道具を取り出して、cookieStore という変数に入れている
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value

    if (sessionId) {
        await prisma.session.delete({ where: { session_id: sessionId } })
    }
    // delete(...)は「指定した名前のクッキーを削除する」メソッド
    // ここがログアウトの本体。
    // user_idという名前のCookieを削除してください
    cookieStore.delete('session_id')

    // 処理が成功したよ」という返事を、JSON形式でブラウザに返している
    return NextResponse.json({ success: true })
}