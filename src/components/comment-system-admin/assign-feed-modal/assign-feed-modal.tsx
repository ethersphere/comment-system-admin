import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { isPrivateKey } from "../../../utils/string";
import { Wallet } from "ethers";

interface AssignFeedModalProps {
  show: boolean;
  onSubmit: (identifier: string, privateKey: string) => void;
  onClose: () => void;
}

export default function AssignFeedModal({
  show,
  onSubmit,
  onClose,
}: AssignFeedModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [privateKey, setPrivateKey] = useState(
    Wallet.createRandom().privateKey
  );

  const submit = () => {
    if (!identifier || !privateKey || !isPrivateKey(privateKey)) {
      return;
    }

    onSubmit(identifier, privateKey);
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
          id="comment-system-assign-private-key"
          aria-describedby="comment-system-assign-private-key-help"
          value={privateKey}
          required
          onChange={(event) => setPrivateKey(event.target.value)}
        />
        <Form.Text id="comment-system-assign-private-key-help" muted>
          Set private key of your moderation feed. You will use this private key
          to approve comments.
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
