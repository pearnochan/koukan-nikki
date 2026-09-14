// DeleteButton.tsx(Client Component)ここでのポイントは、「削除」ボタンをクリックするという、利用者の操作が発生する
// クリックなどの操作に反応するのは、プラウざだけ

'use client'

import { useRouter } from "next/navigation"

// RecordFormがusersを受け取ったのと同じ考え方で、この部品は**「どの記録を削除するか」を示すrecId**を、呼び出し元(records/page.tsx)から受け取ります。
export default function DeleteButton({ recId }: { recId: string }) {
    const router = useRouter()

    async function handleDelete(){

        // confirm(...)は、ブラウザ標準の確認ダイアログを出す関数です。
        // 「OK」か「キャンセル」を選べるポップアップが出て、「OK」ならtrue、「キャンセル」ならfalseが返ってきます。誤操作で消してしまわないよう、ワンクッション確認を入れています。if (!confirmed) returnで、「キャンセルされたら、ここで処理を終了する」としています。
        const confirmed = confirm('この記録を削除しますか?')
        if(!confirmed)return

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