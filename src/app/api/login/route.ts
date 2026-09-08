// さっき作ったDB操作の道具箱を持ってくる
import { prisma } from '@/lib/prisma'

// サーバーからの返事を作るための道具を持ってくる
import { NextResponse } from 'next/server'

// クッキーを扱うための道具　クッキーはプラウざに小さなデータを保存しておく仕組み　今回はログイン済みかどうかを覚えておくために使う
import { cookies } from 'next/headers'

// 関数を定義しています。POSTという名前にすることで、Next.jsが自動的に「このファイルへのPOSTリクエスト(データを送る形のアクセス)が来たら、この関数を実行する」と認識してくれます。asyncは「この関数の中でawait(後述)が使えます」という宣言、request: Requestは「送られてきたデータ(引数)」
export async function POST(request: Request) {

    // 送られてきたデータの中身を取り出しています。request.json()で「送られてきたデータをJSON形式として読み込む」処理をして、その中からlogin_idとpasswordという項目を取り出し、同じ名前の変数に入れています。awaitは「この処理が終わるまで待つ」という意味
    const { login_id, password } = await request.json()

    // Userテーブルから、「login_idとpasswordが、さっき受け取った値と一致する人」を1人探しています。findFirstは「条件に合う最初の1件を探す」という意味のメソッドです。where: { login_id, password }はwhere: { login_id: login_id, password: password }の省略形
    const user = await prisma.user.findFirst({
        where:{login_id, password},
    })

    if (!user) {
        return NextResponse.json(
            { error: 'ログインIDまたはパスワードが違います'},
            { status: 401 }
        )
    }

    const cookieStore = await cookies()
    // クッキーを操作するための道具を取り出しています。

    cookieStore.set('user_id', user.user_id, { httpOnly: true })

    return NextResponse.json({ user_id: user.user_id, name: user.name })
    // 最後に、ログインに成功したことをブラウザに伝えるため、user_idとnameを返して関数を終了します。}
}