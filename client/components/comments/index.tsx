import React from "react";

interface CommentData {
  id: string;
  comment: string;
  createdAt: string;
  userId: number;
  torrentId: string;
  repliesTo: string;
  replyCommentId: string;
  user: {
    username: string;
    profileImage: string;
  }
}

interface CommentContainerProps {
  userProfileImg?: string;
  comments: CommentData[];
}

export class CommentContainer extends React.Component<CommentContainerProps, {}> {
  constructor(props: CommentContainerProps) {
    super(props);
  }

  render() {
    return (
      <div className="comments-section">
        <CommentInput />

        {this.props.comments.map(comment => {
          return <Comment {...comment}/>
        })}
      </div>
    );
  }
}

export class CommentInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="comment-input">
        <div className="comment-input__av">
          <img src="src/assets/images/demo-av/2.png" alt="" />
        </div>
        <div className="comment-input__input">
          <textarea
            name="comment-content"
            rows={1}
            placeholder="Leave your comment here..."
          ></textarea>
          <button className="button button--border-green">Send</button>
        </div>
      </div>
    );
  }
}

export class Comment extends React.Component<CommentData, {}> {
  constructor(props: CommentData) {
    super(props);
  }

  render() {
    return (
      <div className="comment-item">
        <div className="comment-item__av">
          <img src={this.props.user.profileImage} alt="" />
        </div>
        <div className="comment-item__content">
          <div className="title">
            <a href="" className="user">
              {this.props.user.username}
            </a>
            <span className="desc">{this.props.createdAt}</span>
          </div>
          <div className="comment-text">
            {this.props.comment}
          </div>
        </div>
      </div>
    );
  }
}
