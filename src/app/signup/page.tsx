// 「このページはブラウザ側で動くコンポーネントですよ」

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function SignupPage(){
    // 入力されるたび、その値を覚えておく
    const [name, setName] = useState('')
    const [loginId, setLoginId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // nextjsの機能で、ページの遷移を操るやつ的な
    const router = useRouter()

    // 「フォームが送信されたら、通常の送信を止めて、エラーをリセットする」
    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        setError('')

        // 「新規登録のデータをサーバーに送る」
        // /api/signup にPOSTで、名前・ログインID・パスワードをJSON形式で送って、サーバーからの返事を待ち、その返事を res に入れる
        const res = await fetch ('/api/signup',{
            method: 'POST',
            headers:{ 'Content-Type': 'application/json'},
            body:JSON.stringify({ name, login_id: loginId, password }),
        })

        // 登録に失敗した場合の処理
        if(!res.ok){
            const data = await res.json()
            setError(data.error)
            return
        }

        // ログインページに移動する
        router.push('/login')
    }

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>新規登録</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <label htmlFor="name" className={styles.label}>名前</label>
                    <input
                        id='name'
                        type='text'
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="loginId" className={styles.label}>ログインID</label>
                    <input
                        id='loginId'
                        type='text'
                        className={styles.input}
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor='password' className={styles.label}>パスワード</label>
                    <input
                        id='password'
                        type='password'
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type='submit' className={styles.button}>登録する</button>
            </form>
        </main>
    )
}