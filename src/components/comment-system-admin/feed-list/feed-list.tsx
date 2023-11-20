import Table from "react-bootstrap/Table";
import { Feed } from "../../../model/feed.model";
import { Button } from "react-bootstrap";
import { shortenString } from "../../../utils/string";

export interface FeedListProps {
  feeds: Feed[];
  onAssign: (feed: Feed) => void;
  onRemove: (feedId: string) => void;
  onOpen: (feed: Feed) => void;
}

export default function FeedList({
  feeds,
  onAssign,
  onRemove,
  onOpen,
}: FeedListProps) {
  return (
    <Table striped bordered hover width="100%">
      <thead>
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>Date</th>
          <th>Assigned to</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {feeds.map((feed, index) => (
          <tr key={feed.id}>
            <td>{index + 1}.</td>
            <td>{shortenString(feed.id, 15, 8)}</td>
            <td>{new Date(feed.date).toLocaleDateString()}</td>
            <td>
              {!feed.identifier ? (
                <Button onClick={() => onAssign(feed)}>Assign</Button>
              ) : (
                <Button variant="success" onClick={() => onOpen(feed)}>
                  See comments
                </Button>
              )}
            </td>
            <td>
              <Button variant="danger" onClick={() => onRemove(feed.id)}>
                Remove
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
