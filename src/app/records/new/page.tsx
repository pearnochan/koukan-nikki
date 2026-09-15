// 「新しく交換日記を書く画面」を作っているファイル

// データベースを操作するための prisma を持ってくる
import { prisma } from '@/lib/prisma'
// 別のファイルに作ってある RecordForm という部品を持ってくる
import RecordForm from '@/components/Recordform'

import style from './page.module.css'

// このファイルの外から、この関数を使えるように公開している
export default async function NewRecordPage(){
    // データベースを見に行っているところ
    // Userテーブルから、user_idとnameを複数取得する
    const users = await prisma.user.findMany({
        // ユーザーの情報のうち、何を取得するか
        // true は「その項目を取得する」 という意味
        select: { user_id: true, name:true},
    })

    return (
        <main className={style.container}>
            <h1 className={style.title}>記録をつける</h1>
            <RecordForm users={users}/>
        </main>
    )
}