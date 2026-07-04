import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PositionHeader = ({ title }) => (
  <>
    <Button as={Link} to="/positions" variant="outline-secondary" className="mb-4">
      ← Volver
    </Button>
    <h2 className="mb-4">{title || 'Detalle de la posición'}</h2>
  </>
);

export default PositionHeader;
