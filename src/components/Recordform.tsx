'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

type User = { user_id: string; name: string}

// RecordFormという部品(コンポーネント)を定義しています。 { users }: { users: User[] }は、この部品を呼び出す側(page.tsx)から**受け取る材料(props)**の指定です。「usersという名前で、User型(user_idとnameを持つオブジェクト)の配列を受け取りますよ」という意味です。page.tsx側で<RecordForm users={users} />のように渡されたデータが、ここに入ってきます。
export default function RecordForm({ users }: { users: User[]}) {
    // 「タイトル」の入力欄の中身を管理する変数です。最初は空文字''。titleが今の値、setTitleがそれを変更する関数です(前に説明したuseStateの仕組みです)。
    // 値が変わったことをReactに伝えて、画面を自動更新してもらう」**という特別な仕組みがuseStateにはついている、というのが決定的な違いです。だからフォームの入力欄のような「ユーザーの操作に応じて画面が変わるもの」には、useStateが必須になります。
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    // 「一緒にいた人」として選ばれた利用者のID一覧を管理する変数です。1人だけでなく複数人選べるので、文字列ではなく配列(<string[]>は「文字列の配列を扱いますよ」という型の指定)で管理しています。最初は誰も選ばれていないので空の配列[]です。
    const [participantIds, setParticipantIds] = useState<string[]>([])
    const [error, setError] = useState('')

    // ページ移動をするための道具を取り出しています。あとで「記録が成功したら、トップページに移動する」ときにrouter.push('/')という形で使います。
    const router = useRouter()

    // toggleParticipantという名前の関数を定義しています。toggleは「切り替える」という意味で、その名の通り「選択されていれば外す、選択されていなければ追加する」というオンオフの切り替えをする関数です。引数userIdには、クリックされたチェックボックスの利用者のIDが入ってきます
    function toggleParticipant(userId: string){
      
      // participantIds(選ばれた参加者のID一覧)を更新しています。ここでsetParticipantIds(新しい値)という直接的な書き方ではなく、(prev) => ...という関数の形で渡しているのがポイントです。prevは「更新される前の、今の配列」を表します。「今の値をもとに、新しい値を計算したい時」は、この関数形式を使うのがReactの推奨されたやり方です(直前の状態を正確に参照できるためです)。
        setParticipantIds((prev) =>
          prev.includes(userId)
            ? prev.filter((id)=> id !== userId)
            :[...prev, userId]
        )
    }

    async function handleSubmit(e : React.FormEvent){
        e.preventDefault()
        setError('')

        const res = await fetch('/api/records', {
            method: 'POST',
            headers:{ 'Content-Type': 'application/json'},
            body: JSON.stringify({ title, content, participantIds }),
        })

        if (!res.ok){
            const data = await res.json()
            setError(data.error)
            return
        }

        router.push('/')
    }

return(
     <form onSubmit={handleSubmit}>
      <div className="record-field">
        <label className="record-label">タイトル</label>
        <input
          type="text"
          className="record-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="record-field">
        <label className="record-label">本文</label>
        <textarea
          className="record-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div className="record-field">
        <label className="record-label">一緒にいた人</label>
        {users.map((user) => (
          <label key={user.user_id} className="record-checkbox-label">
            <input
              type="checkbox"
              checked={participantIds.includes(user.user_id)}
              onChange={() => toggleParticipant(user.user_id)}
            />
            {user.name}
          </label>
        ))}
      </div>
      {error && <p className="record-error">{error}</p>}
      <button type="submit" className="record-button">記録する</button>
    </form>
  )

}
