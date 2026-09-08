// PostgreSQLと実際に通信するためのアダプター（接続変換器）を持ってきている
import { PrismaPg } from '@prisma/adapter-pg'

// PrismaClientとは何か
// 一言で言うと、**「TypeScriptのコードから、DBに命令を送るためのオブジェクト
import { PrismaClient } from '@/generated/prisma/client'

// globalThis(アプリ全体で共有されている保管場所)に、もしかしたらprismaという名前で何か入っているかもしれない箱として扱えるようにとTSに伝えている
// 入れ物を作っただけ
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient}

export const prisma =
    // ??は「左側が空っぽなら、右側を使う」という意味
    // もしglobalForPrisma.prismaにすでに何か入っていれば、それをそのまま使う
    globalForPrisma.prisma ??
    // 何も入っていなければ、new PrismaClient(...)で新しく道具箱を作る
    // (その時、PrismaPgのアダプターを使って、.envのDATABASE_URLのPostgreSQLに繋ぐよう設定する)
    new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL!}),
    })

// 「本番環境でなければ」、今作ったprismaをglobalForPrismaの箱にしまっておきます。これで次にこのファイルが実行された時、上の??の左側(globalForPrisma.prisma)がもう空っぽではなくなっているので、新しく作り直さずに使い回せる、という仕組み
if (process.env.NODE_ENV !== 'production')globalForPrisma.prisma = prisma