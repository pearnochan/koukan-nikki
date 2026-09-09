// サーバーからの返事を作るための道具です。ログインAPI・記録作成APIでも毎回使っていた、おなじみのもの
import { NextResponse } from "next/server";

// クッキーを操作するための道具です。今回は削除するために使います。
import { cookies } from 'next/headers'


// POSTという名前の関数を定義しています。前回詳しく説明した通り、この名前にすることで「method: 'POST'で来たリクエストの時に、この関数が実行される」というNext.jsのルールが働きます。
export async function POST (){
    const cookieStore = await cookies()

    // delete(...)は「指定した名前のクッキーを削除する」メソッド
    cookieStore.delete('user_id')

    return NextResponse.json({ success: true })
}