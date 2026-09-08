'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [loginId, setLoginId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        const res = await fetch('/api/login',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ login_id: loginId, password }),
        })
        
        if (!res.ok){
            const data = await res.json()
            setError(data.error)
            return
        }

        router.push('/')
    }

    return(
        <main>
            <h1>ログイン</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="loginId">ログインID</label>
                    <input
                    id='loginId'
                    type='text'
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label htmlFor='password'>パスワード</label>
                    <input
                    id='password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>
                {error && <p>{error}</p>}
                <button type='submit'>ログイン</button>
            </form>
        </main>
    )
}