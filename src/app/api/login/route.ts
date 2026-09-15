// さっき作ったDB操作の道具箱を持ってくる
import { prisma } from '@/lib/prisma'

// サーバーからの返事を作るための道具を持ってくる
import { NextResponse } from 'next/server'

// クッキーを扱うための道具　クッキーはプラウざに小さなデータを保存しておく仕組み　今回はログイン済みかどうかを覚えておくために使う
import { cookies } from 'next/headers'

import bcrypt from 'bcryptjs'
import { error } from 'console'

// 関数を定義しています。POSTという名前にすることで、Next.jsが自動的に「このファイルへのPOSTリクエスト(データを送る形のアクセス)が来たら、この関数を実行する」と認識してくれます。asyncは「この関数の中でawait(後述)が使えます」という宣言、request: Requestは「送られてきたデータ(引数)」
export async function POST(request: Request) {
    // request という名前でリクエストを受け取ります。そのデータは Request 型です

    // 送られてきたJSONデータの中から、login_idとpasswordという名前の項目だけを、それぞれ変数として取り出す    
    const { login_id, password } = await request.json()
    // request(送られてきたデータ全部)の中身を、JSON形式として読み取るという処理です。awaitがついているのは、データを読み込むのに少し時間がかかるため

    // Userテーブルから、「login_idとpasswordが、さっき受け取った値と一致する人」を1人探しています。findFirstは「条件に合う最初の1件を探す」という意味のメソッドです。where: { login_id, password }はwhere: { login_id: login_id, password: password }の省略形
    // 「DBのUserテーブルから、送られてきたログインIDとパスワードが一致するユーザーを探して、そのユーザーを user に入れる」
    const user = await prisma.user.findFirst({
        where:{login_id},
    })

    // DBを探してユーザーが見つからなかったら、ログイン失敗の返事をして処理を終了する
    if (!user) {
        return NextResponse.json(
            { error: 'ログインIDまたはパスワードが違います'},
            { status: 401 }
        )
    }

    // 見つかったユーザーの、DBに保存されているハッシュ化済みのパスワード(user.password)と、今入力された平文のパスワード(password)を、bcrypt.compareで比較しています。一致していればtrueが返ってきます
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid){
        return NextResponse.json(
            { error: 'ログインIDまたはパスワードが違います' },
            { status: 401 }
        )
    }

    const cookieStore = await cookies()
    // クッキーを操作するための道具を取り出しています。

    cookieStore.set('user_id', user.user_id, { httpOnly: true })
    // 「ログインに成功したユーザーのIDを user_id という名前のCookieに保存する。ただし、JavaScriptから直接読めないようにする」

    // httpOnly: trueとは何か
    return NextResponse.json({ user_id: user.user_id, name: user.name })
    // 最後に、ログインに成功したことをブラウザに伝えるため、user_idとnameを返して関数を終了します。}
}