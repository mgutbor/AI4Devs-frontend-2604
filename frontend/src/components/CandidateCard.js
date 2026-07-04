import React, { memo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Badge, Card } from 'react-bootstrap';

const CandidateCard = memo(({ candidate }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(candidate.id),
    data: { candidateId: candidate.id },
  });

  const averageScoreLabel = Number.isFinite(candidate.averageScore)
    ? candidate.averageScore.toFixed(1)
    : 'N/A';

  const averageScoreText = `Puntuación media ${averageScoreLabel}`;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.6 : 1,
      }}
      tabIndex={0}
      role="button"
      aria-label={`Candidato ${candidate.fullName}. ${averageScoreText}`}
      aria-roledescription="tarjeta arrastrable"
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
        }
      }}
      {...attributes}
      {...listeners}
    >
      <Card border="light" className="shadow-sm cursor-grab">
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <div className="flex-grow-1">
              <div className="fw-semibold">{candidate.fullName}</div>
              <div className="text-muted small">Aplicación #{candidate.applicationId}</div>
            </div>
            <Badge bg="primary" pill className="ms-2">
              {averageScoreLabel}
            </Badge>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
});

export default CandidateCard;
