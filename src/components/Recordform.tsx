'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

type User = { user_id: string; name: string}

// RecordFormという部品(コンポーネント)を定義しています。 { users }: { users: User[] }は、この部品を呼び出す側(page.tsx)から**受け取る材料(props)**の指定です。「usersという名前で、User型(user_idとnameを持つオブジェクト)の配列を受け取りますよ」という意味です。page.tsx側で<RecordForm users={users} />のように渡されたデータが、ここに入ってきます。
export default function RecordForm({ users }: { users: User[]}) {
    // 「タイトル」の入力欄の中身を管理する変数です。最初は空文字''。titleが今の値、setTitleがそれを変更する関数です(前に説明したuseStateの仕組みです)。
    // 値が変わったことをReactに伝えて、画面を自動更新してもらう」という特別な仕組みがuseStateにはついている、というのが決定的な違いです。だからフォームの入力欄のような「ユーザーの操作に応じて画面が変わるもの」には、useStateが必須になります。
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    // 「一緒にいた人」として選ばれた利用者のID一覧を管理する変数です。1人だけでなく複数人選べるので、文字列ではなく配列(<string[]>は「文字列の配列を扱いますよ」という型の指定)で管理しています。最初は誰も選ばれていないので空の配列[]です。
    const [participantIds, setParticipantIds] = useState<string[]>([])

    // 選択された画像ファイルの一覧を管理する変数です。FileListは「ファイル選択欄で選んだファイルたちの集まり」を表す型で、まだ何も選んでいない状態を表すためにnullを初期値にしています。
    const [images, setImages] = useState<FileList | null>(null)
    const [error, setError] = useState('')

    // ページ移動をするための道具を取り出しています。あとで「記録が成功したら、トップページに移動する」ときにrouter.push('/')という形で使います。
    const router = useRouter()

    // toggleParticipantという名前の関数を定義しています。toggleは「切り替える」という意味で、その名の通り「選択されていれば外す、選択されていなければ追加する」というオンオフの切り替えをする関数です。引数userIdには、クリックされたチェックボックスの利用者のIDが入ってきます
    function toggleParticipant(userId: string){

      // participantIds(選ばれた参加者のID一覧)を更新しています。ここでsetParticipantIds(新しい値)という直接的な書き方ではなく、(prev) => ...という関数の形で渡しているのがポイントです。prevは「更新される前の、今の配列」を表します。「今の値をもとに、新しい値を計算したい時」は、この関数形式を使うのがReactの推奨されたやり方です(直前の状態を正確に参照できるためです)。
        setParticipantIds((prev) =>
          // 「今の配列(prev)の中に、このユーザーのID(userId)がすでに含まれているか」を調べています。includes(...)は「含まれていればtrue、いなければfalse」を返すメソッドです。
          prev.includes(userId)
          // 三項演算子(条件 ? Aの場合 : Bの場合という書き方)の「Aの場合」の部分です。もし既に含まれていたら(=もう選択済みだったら)、prev.filter(...)で「そのユーザーのIDだけを取り除いた、新しい配列」を作ります。filterは「条件に合う要素だけを残す」メソッドで、ここでは「idがuserIdと一致しない(!==)ものだけ残す」→結果的に、そのユーザーだけが除外
            ? prev.filter((id)=> id !== userId)
            :[...prev, userId]
        )
    }

    // 「フォームが送信されたら、ページの通常の送信処理を止めて、前回のエラー表示を消して、このあと自分でAPIにデータを送る準備をする」
    // フォームが送信されたときに実行する handleSubmit という関数
    async function handleSubmit(e : React.FormEvent){
        e.preventDefault()
        // エラーメッセージを空にする
        setError('')

        // FormDataは、テキストだけでなくファイルも一緒に送れる、特殊な入れ物です。JSON.stringifyでは画像データを送れないため、ここから形式を変更しています。
        const formData = new FormData()
        // .append(名前, 値) で、送るデータを1つずつ追加していきます。名前は、サーバー側でformData.get('title')のように取り出すときに使うキーです。
        formData.append('title', title)
        formData.append('content', content)
        // participantIdsは配列なので、そのままだと送れません。JSON.stringifyで一旦文字列に変換してから送り、サーバー側でJSON.parseして元の配列に戻します。
        formData.append('participantIds', JSON.stringify(participantIds))

        // 画像が選択されていれば、1枚ずつformDataに追加します。同じ名前('images')で複数回appendすると、サーバー側でまとめて配列として受け取れます。
        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i])
            }
        }

        const res = await fetch('/api/records', {
            method: 'POST',
            // FormDataを送るときはheadersを指定しません。ブラウザが自動的に適切な形式を設定してくれるためです。
            body: formData,
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
        <label className="record-label">写真</label>
        {/* type="file"で画像選択ボタンになります。accept="image/*"は画像ファイルだけ選べるように制限、multipleは複数枚選択を許可する指定です。 */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(e.target.files)}
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