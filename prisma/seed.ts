import { prisma } from '../src/lib/prisma'

async function main() {
    const users = [
        { name:'えり', login_id:'pearnochan', password:'1002' },
        { name:'こず', login_id:'piyochan', password:'0926' },
        { name:'れな', login_id:'renapi', password:'0322' },
        { name:'ゆうな', login_id:'news', password: '0520' },
    ]

    for ( const user of users ) {
        await prisma.user.upsert({
            where: { login_id:user.login_id },
            update:{},
            create:{
                user_id: crypto.randomUUID(),
                name: user.name,
                login_id: user.login_id,
                password: user.password
            },
        })
    }

    console.log('利用者データを登録しました')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })