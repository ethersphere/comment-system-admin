import { Button } from "react-bootstrap";
import { useFeeds } from "../../hooks/feeds.hook";
import FeedList from "./feed-list/feed-list";
import { useState } from "react";
import { Feed } from "../../model/feed.model";
import AssignFeedModal from "./assign-feed-modal/assign-feed-modal";
import FeedComments from "./feed-comments/feed-comments";
import styles from "./comment-system-admin.module.scss";

export interface SwarmCommentModerationProps {
  stamp?: string;
  beeApiUrl?: string;
  beeDebugApiUrl?: string;
}

export default function SwarmCommentAdmin(
  props: SwarmCommentModerationProps
) {
  const { feeds, addFeed, removeFeed, updateFeed } = useFeeds();
  const [assigningFeed, setAssigningFeed] = useState<Feed | null>(null);
  const [openedFeed, setOpenedFeed] = useState<Feed | null>(null);

  const onCreateFeed = () => {
    addFeed();
  };

  const onRemoveFeed = (feedHash: string) => {
    removeFeed(feedHash);
  };

  const onAssign = (identifier: string, moderationIdentifier: string) => {
    updateFeed({ ...assigningFeed, identifier, moderationIdentifier } as Feed);
    setAssigningFeed(null);
  };

  return (
    <div className={styles["swarm-comment-system-moderation"]}>
      {openedFeed ? (
        <>
          <Button onClick={() => setOpenedFeed(null)}>Back</Button>
          <FeedComments feed={openedFeed} {...props} />
        </>
      ) : (
        <>
          <FeedList
            feeds={feeds}
            onAssign={setAssigningFeed}
            onRemove={onRemoveFeed}
            onOpen={setOpenedFeed}
          />
          <Button onClick={onCreateFeed}>Create Feed</Button>
          <AssignFeedModal
            show={Boolean(assigningFeed)}
            onSubmit={onAssign}
            onClose={() => setAssigningFeed(null)}
          />
        </>
      )}
    </div>
  );
}
