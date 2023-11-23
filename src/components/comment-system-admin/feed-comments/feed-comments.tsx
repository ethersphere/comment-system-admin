import { useEffect, useMemo, useState } from "react";
import {
  Comment,
  CommentNode,
  readComments,
  readCommentsAsTree,
  writeComment,
} from "@ethersphere/comment-system";
import { Wallet } from "ethers";
import { Feed } from "../../../model/feed.model";
import { Button, ListGroup, Spinner } from "react-bootstrap";
import styles from "./feed-comments.module.scss";
import CommentWithReplies from "./comment-with-replies/comment-with-replies";

export interface FeedCommentsProps {
  feed: Feed;
  stamp?: string;
  beeApiUrl?: string;
  beeDebugApiUrl?: string;
}

export default function FeedComments(props: FeedCommentsProps) {
  const { feed } = props;
  const [loading, setLoading] = useState(true);
  const [allComments, setAllComments] = useState<CommentNode[] | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [approvedIds, setApprovedIds] = useState<Record<string, boolean>>({});

  const feedAddress = useMemo(
    () => new Wallet(feed.privateKey as string).address,
    [feed]
  );

  const loadComments = async () => {
    try {
      setLoading(true);

      const [allComments, approvedComments] = await Promise.all([
        readCommentsAsTree({
          ...props,
          identifier: feed.identifier,
        }),
        readComments({
          ...props,
          identifier: feed.id,
          approvedFeedAddress: feedAddress,
        }),
      ]);

      setAllComments(allComments);
      setApprovedIds(
        approvedComments?.reduce<Record<string, boolean>>((map, comment) => {
          map[comment.id] = true;

          return map;
        }, {})
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (comments: Comment[]) => {
    try {
      setLoading(true);

      await comments.reverse().reduce(async (prevRequest, comment) => {
        await prevRequest;

        if (approvedIds[comment.id]) {
          return;
        }

        await writeComment(comment, {
          ...props,
          identifier: feed.id,
          privateKey: feed.privateKey,
        });
      }, Promise.resolve());

      setApprovedIds({
        ...approvedIds,
        ...comments.reduce((map, { id }) => {
          map[id] = true;

          return map;
        }, {} as Record<string, boolean>),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  if (!allComments && loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <div className={styles["swarm-comment-system-comments"]}>
      <div className={styles["identifier"]}>Identifier: {feed.identifier}</div>
      <div className={styles["identifier"]}>Feed ID: {feed.id}</div>
      <div className={styles["identifier"]}>Feed Address: {feedAddress}</div>
      <Button onClick={() => setShowPrivateKey(!showPrivateKey)} size="sm">
        Show feed private key
      </Button>
      {showPrivateKey && (
        <div className={styles["identifier"]}>
          Feed Private Key: {feed.privateKey}
        </div>
      )}
      {allComments ? (
        allComments.length === 0 ? (
          <div>There are no comments!</div>
        ) : (
          <ListGroup>
            {allComments.map((node) => (
              <ListGroup.Item key={node.comment.id}>
                <CommentWithReplies
                  commentNode={node}
                  loading={loading}
                  isApproved={(id) => approvedIds[id]}
                  onApprove={approveComment}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        )
      ) : (
        <div>Couldn't load comments</div>
      )}
    </div>
  );
}
