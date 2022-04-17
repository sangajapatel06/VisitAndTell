import React, { useState } from 'react';
import {Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase} from '@material-ui/core/'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import moment from 'moment'
import {useHistory} from 'react-router-dom'
import useStyles from './styles'
import {useDispatch} from 'react-redux'
import {deletePost,likePost} from '../../../actions/posts'
const Post = ({post,setCurrentId}) => {
const user = JSON.parse(localStorage.getItem('profile'))
const classes = useStyles()
const dispatch = useDispatch()
const history = useHistory()
const [likes,setLikes] = useState(post?.likes)
const hasLikedPost = likes.find((like) => like === (user?.result?.googleId || user?.result?._id))
const userId = user?.result.googleId || user?.result?._id;
const handleLike = async () =>{
     dispatch(likePost(post._id))
     if(hasLikedPost){
        setLikes(likes.filter((id) => id !== (user?.result.googleId || user?.result?._id)))
     }else{
        setLikes([...likes, userId])
     }
}


const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === (user?.result?.googleId || user?.result?._id))
        ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }

    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
  };

    const openPost = () => {
        history.push(`/posts/${post._id}`)
    }
    
    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase 
                className={classes.cardAction}
                onClick={openPost}
            >
            <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
            {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) &&(
                <div className={classes.overlay}>
                    <Typography variant="h6">{post.name}</Typography>
                    <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
                </div>
            )}
            <div className={classes.overlay2}>
                <Button 
                    style={{color: 'white'}} 
                    size="small" 
                    onClick={()=> setCurrentId(post._id)}>
                    <MoreHorizIcon fontSize="default" />
                </Button>
            </div>
            <div className={classes.details}>
                <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
            </div>
            <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
            <CardContent>
                <Typography  variant="body2" color="textSecondary" component="p">{post.message}</Typography>
            </CardContent>
        </ButtonBase> 
            <CardActions className={classes.cardActions}>
                <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
                    <Likes />
                </Button>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) &&(
                    <Button size="small" color="primary" onClick={() => dispatch(deletePost(post._id))}>
                        <DeleteIcon fontSize="small" />Delete
                    </Button>
                )}
            </CardActions>
            
        </Card>
    );
}

export default Post;