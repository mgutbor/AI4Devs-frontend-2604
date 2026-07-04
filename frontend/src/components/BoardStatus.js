import React from 'react';
import { Alert, Spinner } from 'react-bootstrap';

export const LoadingState = ({ message }) => (
  <div className="text-center py-5">
    <Spinner animation="border" role="status" className="mb-3" />
    <p className="mb-0">{message}</p>
  </div>
);

export const ErrorState = ({ message }) => <Alert variant="danger">{message}</Alert>;

export const EmptyState = ({ message }) => <Alert variant="info">{message}</Alert>;
