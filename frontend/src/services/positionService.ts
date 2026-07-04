const API_BASE_URL = 'http://localhost:3010';

const requestJson = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = typeof data?.message === 'string' ? data.message : 'Request failed';
    throw new Error(message);
  }

  return data as T;
};

export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

export interface PositionSummary {
  id: number;
  title: string;
  manager: string;
  deadline: string;
  status: string;
}

export interface PositionInterviewFlowPayload {
  positionName: string;
  interviewFlow: {
    id: number;
    description?: string | null;
    interviewSteps: InterviewStep[];
  };
}

export interface PositionInterviewFlowResponse {
  interviewFlow: PositionInterviewFlowPayload;
}

export interface PositionCandidate {
  id: number;
  applicationId: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
}

export interface UpdateCandidateStagePayload {
  applicationId: number;
  currentInterviewStep: number;
}

export interface UpdateCandidateStageResponse {
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    currentInterviewStep: number;
  };
}

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const getPositions = async (): Promise<PositionSummary[]> => {
  try {
    return await requestJson<PositionSummary[]>('/position');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected request error';
    throw new ApiError(message);
  }
};

export const getPositionInterviewFlow = async (
  positionId: string | number
): Promise<PositionInterviewFlowPayload> => {
  try {
    const data = await requestJson<PositionInterviewFlowResponse>(`/position/${positionId}/interviewflow`);
    return data.interviewFlow;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected request error';
    throw new ApiError(message);
  }
};

export const getPositionCandidates = async (
  positionId: string | number
): Promise<PositionCandidate[]> => {
  try {
    return await requestJson<PositionCandidate[]>(`/position/${positionId}/candidates`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected request error';
    throw new ApiError(message);
  }
};

export const updateCandidateStage = async (
  candidateId: string | number,
  payload: UpdateCandidateStagePayload
): Promise<UpdateCandidateStageResponse> => {
  try {
    return await requestJson<UpdateCandidateStageResponse>(`/candidates/${candidateId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected request error';
    throw new ApiError(message);
  }
};
