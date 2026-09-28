// このファイルだけでは「ログイン認証」は完成してない
// このファイルはあくまで、「ログイン画面を表示して、入力された情報をAPIに渡す」
// 「このログインIDとパスワードは正しいのか？」 を判断しているのは、 /api/login

// このファイルはブラウザ側で動かします
// このファイルでは useState や onChange を使って、ユーザーの入力に応じて画面の状態を変える必要があるため、
// クライアントコンポーネントとして動かすために 'use client' を付けている
'use client'

import styles from './page.module.css'

// 画面上の値を覚えておくためのもの。
// 今回だと、// ログインIDパスワードエラーメッセージを覚えるために使ってる。
import React, { useState } from 'react'

// ログイン成功後に別のページへ移動する
import { useRouter } from 'next/navigation'

// LoginPageという画面を作っている
// ログインページというReactコンポーネントを作ります
export default function LoginPage() {

    // 入力内容を保存する場所を作る
    // useState → 入力値を覚える
    // ユーザーが入力した値をReactの状態として管理し、その値を後の処理で利用するため
    const [loginId, setLoginId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // ログイン成功後に自動的にトップページへ移動したいから useRouter を使っている
    const router = useRouter()

    // ログインボタンを押したときの処理
    // ログインフォームを送信したときに、この関数が実行される。
    async function handleSubmit(e: React.FormEvent) {

        // まずページの通常送信を止める
        // 今回は自分で fetch を使ってAPIに送るので、ブラウザに勝手にページを再読み込みさせない
        e.preventDefault()

        // エラーを一旦消す 前回ログインに失敗して、パスワードが違いますと表示されていたとしても、もう一度ログインするときには一旦消す。
        setError('')


        // /api/login にログイン情報を送る
        const res = await fetch('/api/login',{
            method: 'POST',
            // 「送るデータはJSON形式ですよ」
            headers: { 'Content-Type': 'application/json'},
            // 実際のログインIDとパスワードを送っている。
            body: JSON.stringify({ login_id: loginId, password }),
        })
        
        // /api/login から返事をもらう
        // APIから返ってきた結果が成功だったか？を確認
        if (!res.ok){
            // ログイン失敗ならエラーを表示
            const data = await res.json()
            setError(data.error)
            return
        }

        // ログイン成功ならトップページへ
        router.push('/')
        router.refresh()
    }


    // 実際の画面部分
    return(
    <main className={styles.container}>
        <h1 className={styles.title}>ログイン</h1>
        <form onSubmit={handleSubmit}>
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
            <button type='submit' className={styles.button}>送信</button>
        </form>
    </main>
    )
}