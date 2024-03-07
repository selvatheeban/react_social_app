import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const EditPost = ({posts,handleEdit,editedBody,setEditedBody,editedTitle, setEditedTitle}) => {
    const {id} = useParams();
    const post = posts.find(post => (post.id).toString()=== id);
    useEffect(()=>{
        if(post){
            setEditedTitle(post.title);
            setEditedBody(post.body);
        }
    },[posts,setEditedBody,setEditedTitle])
  return (
    <main className='NewPost'>
        {editedTitle && 
            <>
                <h2>Edit Post</h2>
                <form className='newPostForm' onSubmit={e=> e.preventDefault()} >
                    <label htmlFor='postTitle'>Title:</label>
                    <input 
                    id="postTitle"
                    type='text'
                    required
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <label htmlFor='postBody'>Post:</label>
                    <textarea 
                    id="postBody"
                    type='text'
                    required
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    />
                    <button type='submit' onClick={()=> handleEdit(post.id)}>Submit</button>                
                </form>
            </>
        }
        {!editedTitle && <>
        <h2>Post Not Found</h2></>}
    </main>
  )
}

export default EditPost