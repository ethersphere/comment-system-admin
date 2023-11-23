import { Comment, CommentNode } from "@ethersphere/comment-system";
import { Button } from "react-bootstrap";
import styles from "./comment-with-replies.module.scss";

export interface CommentWithRepliesProps {
  commentNode: CommentNode;
  loading: boolean;
  isApproved: (id: string) => boolean;
  onApprove: (comment: Comment[]) => void;
}

export default function CommentWithReplies({
  commentNode,
  loading,
  isApproved,
  onApprove,
}: CommentWithRepliesProps) {
  const { comment, replies } = commentNode;

  const onSubnodeApprove = (comment: Comment, comments: Comment[]) => {
    comments.push(comment);

    onApprove(comments);
  };

  return (
    <div
      className={`${styles["comment-node"]} ${
        isApproved(comment.id) ? styles["approved"] : styles["not-approved"]
      }`}
    >
      <div className={styles["comment"]}>
        <div>
          <span>
            <b>{comment.user}</b>,{" "}
            {new Date(comment.timestamp).toLocaleDateString()}
          </span>
          <p>{comment.data}</p>
        </div>
        {!isApproved(comment.id) && (
          <Button
            variant="outline-success"
            size="sm"
            disabled={loading}
            onClick={() => onApprove([comment])}
          >
            Approve
          </Button>
        )}
      </div>

      {replies?.map((node) => (
        <div className={styles["replies"]} key={node.comment.id}>
          <CommentWithReplies
            commentNode={node}
            loading={loading}
            isApproved={isApproved}
            onApprove={(comments) => onSubnodeApprove(comment, comments)}
          />
        </div>
      ))}
    </div>
  );
}
