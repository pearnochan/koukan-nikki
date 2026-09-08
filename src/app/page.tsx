import { prisma } from '@/lib/prisma'

export default async function Home() {
  // recordテーブルの**行数(全部で何件あるか)**を数えています。count()は「数える」専用のメソッド
  const recordCount = await prisma.record.count()

  // 必要記録数が、今の記録数以下(lte = less than or equal)の進化段階」を、必要記録数が高い順(desc)に並べて、一番最初の1件を取得しています
  // 例えば記録数が7件なら、条件に合うのは「たまご(0件)」と「ひよこ(5件)」の2つですが、高い順に並べた時の最初は「ひよこ」なので、currentStageには「ひよこ」が入ります。これが「今の記録数に応じた進化段階を判定する」ロジック
  const currentStage = await prisma.stage.findFirst({
    where:{ required_count:{lte:recordCount}},
    orderBy:{ required_count: 'desc'},
  })
  

  return(
    <main className="avatar-container">
      <h1 className='avatar-title'>たまごっち</h1>
      <img src={currentStage?.image} alt={currentStage?.name} className="avatar-imge"/>
      <p className="avatar-stage-name">{currentStage?.name}</p>
      <p className="avatar-record-count">記録数:{recordCount}件</p>
    </main>
  )
}