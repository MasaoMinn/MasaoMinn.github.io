"use client";
import i18n from "@/app/i18n";
import { useState } from "react";
import { Modal } from "react-bootstrap";
const URL = 'https://kinotsuki.vercel.app/'
export default function Warning() {
  const [show, setShow] = useState(true);
  return (
    <div
      className="modal show"
      style={{ display: show ? 'block' : 'none', position: 'initial' }}
    >
      <Modal.Dialog>
        <Modal.Header closeButton onClick={() => setShow(false)} style={{ backgroundColor: '#efdc89ff', color: 'red' }}>
          <Modal.Title>👀👀👀</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#efdc89ff', color: 'red' }}>
          <p>{i18n.t('mainpage.warning')} <a href={URL}>{URL}</a></p>
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
}