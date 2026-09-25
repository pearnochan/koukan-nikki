import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import style from './page.module.css'

export default async function Home() {
  // recordテーブルの**行数(全部で何件あるか)**を数えています。count()は「数える」専用のメソッド
  const recordCount = await prisma.record.count()
  // 記録数を取得→required_count と比較　→ 例
  // 必要記録数が、今の記録数以下(lte = less than or equal)の進化段階」を、必要記録数が高い順(desc)に並べて、一番最初の1件を取得しています
  // 例えば記録数が7件なら、条件に合うのは「たまご(0件)」と「ひよこ(5件)」の2つですが、高い順に並べた時の最初は「ひよこ」なので、currentStageには「ひよこ」が入ります。これが「今の記録数に応じた進化段階を判定する」ロジック
  const currentStage = await prisma.stage.findFirst({
    // where で「条件に合うstage」を探す
    // lte は less than or equal
    where:{ required_count:{lte:recordCount}},
    // orderBy で一番大きいrequired_countを上にする
    orderBy:{ required_count: 'desc'},
  })
  

   return (
    // <main> というHTMLの箱を表示する。
    <main className={style.container}>
      {/* 画面に今日のアバターという見出しを表示 */}
      <h1 className={style.title}>今日のアバター</h1>
      {/* DBから選ばれた currentStage の画像を表示している。
      src → どの画像を表示するか
       currentStage?.image → 現在のステージの画像
      //  alt → 画像の説明
      // currentStage?.name → 現在のステージ名
      // className → CSSを適用*/}
      <img src={currentStage?.image} alt={currentStage?.name} className={style.image} />

      {/* 現在のステージ名を表示。 */}
      <p className={style.stagename}>{currentStage?.name}</p>

      {/* クリックすると /records に移動するリンク。 
      recordCount入っている記録数を表示する。*/}
      <Link href="/records" className={style.avatarcount}>
        記録数:{recordCount}件
      </Link>
      
      <br />
      {/* 記録をつけるページに移動 */}
      <Link href="/records/new" className={style.avatarnewrecordlink}>
        記録をつける
      </Link>
    </main>
  )
}