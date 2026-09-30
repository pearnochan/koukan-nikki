// 新規ユーザー登録のAPI処理

import { prisma } from '@/lib/prisma'
// APIの返事を作るための NextResponse を持ってくる。
import { NextResponse } from 'next/server'

import bcrypt from 'bcryptjs'//パスワードハッシュ化するやつ

// POSTで送られてきたリクエストを処理する関数
export async function POST (request: Request){
    // リクエストで送られてきたJSONの中から name・login_id・password を取り出している行
    const { name, login_id, password } = await request.json()

    // 同じログインIDがないか調べる
    // Userテーブルから、今入力されたlogin_idと同じログインIDを持つユーザーを1人探して、その結果をexistingUserに入れる
    const existingUser = await prisma.user.findFirst({
        where: { login_id },
    })

    if(existingUser){
        return NextResponse.json({ error: 'このログインIDはすでに使われています'},{status:400})
    }

    const hashedPassword = await bcrypt.hash(password,10)

    // 新しいユーザーをデータベースに登録して、その登録されたユーザー情報を user に入れている処理
    const user = await prisma.user.create({
        data: {
            user_id: crypto.randomUUID(),
            name,
            login_id,
            password: hashedPassword,
        },
    })

    // 登録が成功したので、登録したユーザーのIDをAPIの返事として返す処理
    return NextResponse.json({ user_id: user.user_id })
}