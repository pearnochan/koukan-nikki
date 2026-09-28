// 「ログアウト」ボタンを表示して、押されたらログアウトAPIを呼び、その後ログイン画面に移動する部品
// ログアウトをクリック　handleLogout()↓/api/logout に POST↓ログイン情報のcookieを削除↓/loginへ移動

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

        // サーバーコンポーネントのデータを再取得して、メニューを更新する
        router.refresh()
    }

    return (
        
        <button 
        onClick={handleLogout} // このボタンがクリックされたら handleLogout を実行する
        className="app-nav-link app-logout-button">
            ログアウト
        </button>
    )
}
