import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function CustomModal({ show, modalId, headerProps, children, footerProps, ...props }: any) {
  const { primary, secondary } = footerProps;

  return (
    <Modal show={show} onHide={headerProps.onClose}>
      <Modal.Header closeButton>
        {headerProps.title}
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          variant={primary.variant || 'primary'}
          className={primary.classes}
          onClick={primary.callback}
        >
          {primary.label}
        </Button>
        <Button
          type="button"
          variant={secondary.variant || 'light'}
          className={!!secondary ? "" : 'display-none'}
          onClick={secondary.callback}
        >
          {secondary.label}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}