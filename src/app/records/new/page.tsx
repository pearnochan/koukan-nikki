import { prisma } from '@/lib/prisma'
import RecordForm from '@/components/Recordform'
import style from './page.module.css'

export default async function NewRecordPage(){
    const users = await prisma.user.findMany({
        select: { user_id: true, name:true},
    })

    return (
        <main className={style.container}>
            <h1 className={style.title}>記録をつける</h1>
            <RecordForm users={users}/>
        </main>
    )
}