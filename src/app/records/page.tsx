// 記録一覧ページ

import { prisma } from '@/lib/prisma'
import style from './page.module.css'
import DeleteButton from '@/components/DeleteButton'

// RecordsPageという名前の**コンポーネント(画面)**を定義しています。export defaultは「このファイルの主役はこの関数です」という意味、asyncが付いているのは、この中でawait(DBからのデータ取得を待つ処理)を使うためです。これはServer Component(サーバー側で実行される画面)なので、直接DBにアクセスできます。
export default async function RecordsPage(){
    // recordテーブルから複数件のデータを取得する処理を開始する
    const records = await prisma.record.findMany({
        orderBy:{created_at: 'desc'},

        // 記録を取ってくるついでに、関連するテーブルの情報も一緒に取得する」という指定です。
        // recordテーブル単体だとuser_idのようなIDの値しか持っていませんが、author: trueとすることで「そのIDに対応するUserの中身(名前など)」も一緒に取れます。
        // rec_tagsやparticipantsは中間テーブルなので、さらにその先のtagやuserまでincludeでたどる必要があります(入れ子のinclude)
        include:{
            author: true,
            images: true,
            rec_tags:{include:{tag:true}},
            participants:{include:{user:true}},
        },
    })

    return (
    <main >
      <h1 className={style.recordstitle}>記録一覧</h1>
      {records.map((record) => (
        <div key={record.rec_id} className={style.recordcard}>
          <h2 className={style.recordcardtitle}>{record.title}</h2>
          <p className={style.recordcardcontent}>{record.content}</p>
          <p className={style.recordcardmeta}>
            投稿者: {record.author.name} / {record.created_at.toLocaleDateString()}
          </p>
          {/* 一緒にいた人が1人以上いる場合だけ表示する */}
          {record.participants.length > 0 && (
            <p className={style.recordcardparticipants}>
              一緒にいた人: {record.participants.map((p) => p.user.name).join('、')}
            </p>
          )}
          {record.rec_tags.length > 0 && (
            <p className={style.recordcardtags}>
              タグ: {record.rec_tags.map((rt) => rt.tag.tag_name).join('、')}
            </p>
          )}
          {record.images.length > 0 && (
            <div className={style.recordcardimages}>
              {record.images.map((image) => (
                // エラーではなく、Next.jsからの『画像は<Image />を使うと最適化できますよ』という警告
                <img key={image.image_id} src={image.url} alt="" className={style.recordcardimage}/>
              ))}
              </div>
          )}
          <DeleteButton recId={record.rec_id}/>
        </div>
      ))}
     </main>
  )
}




// Prismaを使ってDBから記録を複数取得し、投稿者・画像・タグ・参加者などの関連データも一緒に取得しています。その後、mapを使って記録を1件ずつカード形式で表示しています