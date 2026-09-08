import { prisma } from '@/lib/prisma'
import RecordForm from '@/components/Recordform'

export default async function NewRecordPage(){
    const users = await prisma.user.findMany({
        select: { user_id: true, name:true},
    })

    return (
        <main className="record-container">
            <h1 className="record-title">記録をつける</h1>
            <RecordForm users={users}/>
        </main>
    )
}