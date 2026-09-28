// 記録一覧にある「削除」ボタンの部品
// DeleteButton.tsx(Client Component)ここでのポイントは、「削除」ボタンをクリックするという、利用者の操作が発生する
// クリックなどの操作に反応するのは、プラウざだけ

'use client'

// ページを操作・更新するための機能
import { useRouter } from "next/navigation"

//部品は「どの記録を削除するか」を示すrecIdを、呼び出し元(records/page.tsx)から受け取ります。
// recId 　削除したい記録のID
export default function DeleteButton({ recId }: { recId: string }) {
    const router = useRouter()

    // 削除処理の関数を作る
    async function handleDelete(){

        // confirm(...)は、ブラウザ標準の確認ダイアログを出す関数です。
        // 「OK」か「キャンセル」を選べるポップアップが出て、「OK」ならtrue、「キャンセル」ならfalseが返ってきます。誤操作で消してしまわないよう、ワンクッション確認を入れています。if (!confirmed) returnで、「キャンセルされたら、ここで処理を終了する」としています。
        // 確認ダイアログを出す
        const confirmed = confirm('この記録を削除しますか?')

        // キャンセルなら終了
        if(!confirmed)return

        // APIに削除をお願いする
        await fetch (`/api/records/${recId}`,{ method: `DELETE` })

        // router.refresh()は「今いるページのデータを、もう一度取得し直す」
        router.refresh()
    }

    return(
        <button onClick={handleDelete}>
            削除
        </button>
    )
}