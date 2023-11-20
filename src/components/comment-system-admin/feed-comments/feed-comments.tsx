import { useEffect, useMemo, useState } from "react";
import {
  Comment,
  readComments,
  writeComment,
} from "@ethersphere/comment-system";
import { Feed } from "../../../model/feed.model";
import { Button, ListGroup, Spinner } from "react-bootstrap";
import styles from "./feed-comments.module.scss";
import { Wallet } from "ethers";

export interface FeedCommentsProps {
  feed: Feed;
  stamp?: string;
  beeApiUrl?: string;
  beeDebugApiUrl?: string;
}

export default function FeedComments(props: FeedCommentsProps) {
  const { feed } = props;
  const [loading, setLoading] = useState(true);
  const [allComments, setAllComments] = useState<Comment[] | null>(null);
  const [approvedComments, setApprovedComments] = useState<Comment[]>([]);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const feedAddress = useMemo(
    () => new Wallet(feed.privateKey as string).address,
    [feed]
  );

  const approvedIndices = useMemo(() => {
    if (!allComments || !approvedComments) {
      return {};
    }

    return allComments?.reduce<Record<number, boolean>>(
      (map, comment, index) => {
        if (
          approvedComments?.some(
            ({ timestamp }) => timestamp === comment.timestamp
          )
        ) {
          map[index] = true;
        }
        return map;
      },
      {}
    );
  }, [allComments, approvedComments]);

  const loadComments = async () => {
    try {
      setLoading(true);

      const [allComments, approvedComments] = await Promise.all([
        readComments({
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
      setApprovedComments(approvedComments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (comment: Comment) => {
    try {
      setLoading(true);

      await writeComment(comment, {
        ...props,
        identifier: feed.id,
        privateKey: feed.privateKey,
      });
      setApprovedComments([...approvedComments, comment]);
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
            {allComments.map((comment, index) => (
              <ListGroup.Item
                key={index}
                className={`${styles["comment"]} ${
                  approvedIndices[index] ? styles["approved"] : ""
                }`}
              >
                <p>{comment.data}</p>
                <span>
                  {comment.user},{" "}
                  {new Date(comment.timestamp).toLocaleDateString()}
                </span>
                {!approvedIndices[index] && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    disabled={loading}
                    onClick={() => approveComment(comment)}
                  >
                    Approve
                  </Button>
                )}
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
