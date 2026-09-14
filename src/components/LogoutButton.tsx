// ログアウトボタンが押されたときに、ログアウト処理をしてログイン画面へ移動するための部品

// このファイルをClient Componentとして扱ってください
'use client'

// ページを移動するための useRouter をNext.jsから持ってくる
import { useRouter } from 'next/navigation'

// LogoutButtonというReactコンポーネントを作って、他のファイルから使えるようにする
export default function LogoutButton() {
    // ページ移動に使う router を用意する
    const router = useRouter()

    // ログアウトボタンが押されたときに実行する関数
    async function handleLogout() {
        // APIにログアウトをお願いする
        await fetch('/api/logout', { method: 'POST' })
        // ログイン画面に移動する
        router.push('/login')
    }

    return (
        
        <button 
        onClick={handleLogout} // このボタンがクリックされたら handleLogout を実行する
        className="app-nav-link app-logout-button">
            ログアウト
        </button>
    )
}
