import React, { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card } from 'react-bootstrap';
import CandidateCard from './CandidateCard';

const InterviewStageColumn = memo(({ stage, candidates, isActiveDropTarget }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.name,
    data: { stageName: stage.name },
  });

  const stageCandidates = candidates.filter((candidate) => candidate.currentInterviewStep === stage.name);
  const isDropHighlighted = isOver || isActiveDropTarget;

  return (
    <Card
      as="section"
      className={`h-100 shadow-sm ${isDropHighlighted ? 'border-primary' : ''}`}
      ref={setNodeRef}
      role="region"
      aria-labelledby={`stage-title-${stage.id}`}
    >
      <Card.Header id={`stage-title-${stage.id}`} className="fw-bold">
        {stage.name}
      </Card.Header>
      <Card.Body className="p-3 p-md-3">
        <div className="text-muted small mb-3">Etapa #{stage.orderIndex}</div>
        {stageCandidates.length === 0 ? (
          <div className="border rounded p-3 text-center text-muted">
            No hay candidatos en esta etapa todavía.
          </div>
        ) : (
          <div className="d-flex flex-column gap-2" role="list" aria-label={`Candidatos en ${stage.name}`}>
            {stageCandidates.map((candidate) => (
              <div key={candidate.id} role="listitem">
                <CandidateCard candidate={candidate} />
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
});

export default InterviewStageColumn;
