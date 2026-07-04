import React, { useEffect, useMemo, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { useParams } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { getPositionCandidates, getPositionInterviewFlow, updateCandidateStage } from '../services/positionService';
import InterviewStageColumn from './InterviewStageColumn';
import PositionHeader from './PositionHeader';
import { EmptyState, ErrorState, LoadingState } from './BoardStatus';

const PositionDetailPage = () => {
  const { positionId } = useParams();
  const [positionName, setPositionName] = useState('');
  const [stages, setStages] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [activeCandidateId, setActiveCandidateId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);

  useEffect(() => {
    const loadPositionData = async () => {
      if (!positionId) {
        setLoadError('No se encontró el identificador de la posición.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError('');

        const [interviewFlowData, candidatesData] = await Promise.all([
          getPositionInterviewFlow(positionId),
          getPositionCandidates(positionId),
        ]);

        setPositionName(interviewFlowData.positionName || 'Posición');
        setStages(interviewFlowData.interviewFlow?.interviewSteps || []);
        setCandidates(candidatesData || []);
      } catch (err) {
        setLoadError(err.message || 'No se pudo cargar la información de la posición.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPositionData();
  }, [positionId]);

  const handleDragStart = (event) => {
    setActiveCandidateId(event.active?.data?.current?.candidateId ?? null);
  };

  const handleDragEnd = async (event) => {
    const destinationStage = event.over?.data?.current?.stageName;
    const destinationStageObject = stages.find((stage) => stage.name === destinationStage);

    if (isUpdatingStage || !activeCandidateId || !destinationStageObject) {
      setActiveCandidateId(null);
      return;
    }

    const candidateToMove = candidates.find((candidate) => candidate.id === activeCandidateId);

    if (!candidateToMove || candidateToMove.currentInterviewStep === destinationStageObject.name) {
      setActiveCandidateId(null);
      return;
    }

    const previousStageName = candidateToMove.currentInterviewStep;

    setCandidates((currentCandidates) =>
      currentCandidates.map((candidate) =>
        candidate.id === activeCandidateId
          ? { ...candidate, currentInterviewStep: destinationStageObject.name }
          : candidate
      )
    );
    setUpdateError('');
    setIsUpdatingStage(true);

    try {
      await updateCandidateStage(candidateToMove.id, {
        applicationId: candidateToMove.applicationId,
        currentInterviewStep: destinationStageObject.id,
      });
    } catch (err) {
      setCandidates((currentCandidates) =>
        currentCandidates.map((candidate) =>
          candidate.id === candidateToMove.id
            ? { ...candidate, currentInterviewStep: previousStageName }
            : candidate
        )
      );
      setUpdateError(err.message || 'No se pudo actualizar la etapa del candidato.');
    } finally {
      setIsUpdatingStage(false);
      setActiveCandidateId(null);
    }
  };

  const candidatesByStage = useMemo(() => {
    const groupedCandidates = stages.reduce((acc, stage) => {
      acc[stage.name] = [];
      return acc;
    }, {});

    candidates.forEach((candidate) => {
      if (groupedCandidates[candidate.currentInterviewStep]) {
        groupedCandidates[candidate.currentInterviewStep].push(candidate);
      }
    });

    return groupedCandidates;
  }, [candidates, stages]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState message="Cargando etapas del proceso..." />;
    }

    if (loadError) {
      return <ErrorState message={loadError} />;
    }

    if (!stages.length) {
      return <EmptyState message="No hay etapas de entrevista configuradas para esta posición." />;
    }

    return (
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="pb-2">
          <div className="d-flex flex-column flex-md-row flex-lg-row gap-3" style={{ minWidth: 0 }}>
            {stages.map((stage) => (
              <div key={stage.id} className="w-100" style={{ flex: '1 1 0', minWidth: 0 }}>
                <InterviewStageColumn
                  stage={stage}
                  candidates={candidatesByStage[stage.name] || []}
                  isActiveDropTarget={activeCandidateId !== null}
                />
              </div>
            ))}
          </div>
        </div>
      </DndContext>
    );
  };

  return (
    <Container className="mt-5">
      <PositionHeader title={positionName} />
      {updateError && <ErrorState message={updateError} />}
      {renderContent()}
    </Container>
  );
};

export default PositionDetailPage;
