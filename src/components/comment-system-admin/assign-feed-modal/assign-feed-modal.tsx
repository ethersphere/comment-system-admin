import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface AssignFeedModalProps {
  show: boolean;
  onSubmit: (identifier: string, moderationIdentifier: string) => void;
  onClose: () => void;
}

export default function AssignFeedModal({
  show,
  onSubmit,
  onClose,
}: AssignFeedModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [moderationIdentifier, setModerationIdentifier] = useState("");

  const submit = () => {
    if (!identifier || !moderationIdentifier) {
      return;
    }

    onSubmit(identifier, moderationIdentifier);
  };
  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Assign Feed Identifiers
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label htmlFor="comment-system-assign-feed">Identifier</Form.Label>
        <Form.Control
          id="comment-system-assign-feed"
          aria-describedby="comment-system-assign-feed-help"
          value={identifier}
          required
          onChange={(event) => setIdentifier(event.target.value)}
        />
        <Form.Text id="comment-system-assign-feed-help" muted>
          Set identifier of your blog that you want to assign this feed to. With
          this feed you can remove unappropriate comments. For example:
          hash/c/2023/development-updates/July.html
        </Form.Text>
        <Form.Label htmlFor="comment-system-assign-moderation-feed">
          Moderation Feed Identifier
        </Form.Label>
        <Form.Control
          id="comment-system-assign-moderation-feed"
          aria-describedby="comment-system-assign-moderation-feed-help"
          value={moderationIdentifier}
          required
          onChange={(event) => setModerationIdentifier(event.target.value)}
        />
        <Form.Text id="comment-system-assign-moderation-feed-help" muted>
          Set identifier of your moderation feed. You will use this ID in your
          blog to filter comments.
        </Form.Text>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={submit}>
          Assign
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
