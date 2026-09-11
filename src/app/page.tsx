import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import style from './page.module.css'

export default async function Home() {
  // recordテーブルの**行数(全部で何件あるか)**を数えています。count()は「数える」専用のメソッド
  const recordCount = await prisma.record.count()

  // 必要記録数が、今の記録数以下(lte = less than or equal)の進化段階」を、必要記録数が高い順(desc)に並べて、一番最初の1件を取得しています
  // 例えば記録数が7件なら、条件に合うのは「たまご(0件)」と「ひよこ(5件)」の2つですが、高い順に並べた時の最初は「ひよこ」なので、currentStageには「ひよこ」が入ります。これが「今の記録数に応じた進化段階を判定する」ロジック
  const currentStage = await prisma.stage.findFirst({
    where:{ required_count:{lte:recordCount}},
    orderBy:{ required_count: 'desc'},
  })
  

   return (
    <main className={style.container}>
      <h1 className={style.title}>今日のアバター</h1>
      <img src={currentStage?.image} alt={currentStage?.name} className={style.image} />
      <p className={style.stagename}>{currentStage?.name}</p>
      <Link href="/records" className={style.avatarcount}>
        記録数:{recordCount}件
      </Link>
      
      <br />

      <Link href="/records/new" className={style.avatarnewrecordlink}>
        記録をつける
      </Link>
    </main>
  )
}