import React, { useEffect, useMemo, useState } from 'react';
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getPositions, type PositionSummary } from '../services/positionService';

const Positions: React.FC = () => {
    const [positions, setPositions] = useState<PositionSummary[]>([]);
    const [search, setSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedManager, setSelectedManager] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadPositions = async () => {
            try {
                setIsLoading(true);
                setError('');
                const data = await getPositions();
                setPositions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'No se pudieron cargar las posiciones.');
            } finally {
                setIsLoading(false);
            }
        };

        loadPositions();
    }, []);

    const filteredPositions = useMemo(() => {
        return positions.filter((position) => {
            const matchesSearch = position.title.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = !selectedStatus || position.status.toLowerCase() === selectedStatus.toLowerCase();
            const matchesManager = !selectedManager || position.manager.toLowerCase().includes(selectedManager.toLowerCase());
            return matchesSearch && matchesStatus && matchesManager;
        });
    }, [positions, search, selectedStatus, selectedManager]);

    const handleViewProcess = (positionId: number) => {
        navigate(`/positions/${positionId}`);
    };

    return (
        <Container className="mt-5">
            <div className="mb-4">
                <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/')}
                    className="mb-3"
                >
                    ← Volver
                </Button>
                <h2 className="text-center">Posiciones</h2>
            </div>
            <Row className="mb-4">
                <Col md={3}>
                    <Form.Control type="text" placeholder="Buscar por título" value={search} onChange={(event) => setSearch(event.target.value)} />
                </Col>
                <Col md={3}>
                    <Form.Control as="select" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                        <option value="">Estado</option>
                        <option value="Open">Abierto</option>
                        <option value="Filled">Contratado</option>
                        <option value="Closed">Cerrado</option>
                        <option value="Draft">Borrador</option>
                    </Form.Control>
                </Col>
                <Col md={3}>
                    <Form.Control as="select" value={selectedManager} onChange={(event) => setSelectedManager(event.target.value)}>
                        <option value="">Manager</option>
                        {Array.from(new Set(positions.map((position) => position.manager))).sort().map((manager) => (
                            <option key={manager} value={manager}>{manager}</option>
                        ))}
                    </Form.Control>
                </Col>
            </Row>
            {isLoading ? (
                <div className="text-center py-5">Cargando posiciones...</div>
            ) : error ? (
                <div className="text-center py-5 text-danger">{error}</div>
            ) : (
                <Row>
                    {filteredPositions.map((position) => (
                        <Col md={4} key={position.id} className="mb-4">
                            <Card className="shadow-sm h-100">
                                <Card.Body>
                                    <Card.Title>{position.title}</Card.Title>
                                    <Card.Text>
                                        <strong>Manager:</strong> {position.manager}<br />
                                        <strong>Deadline:</strong> {position.deadline}
                                    </Card.Text>
                                    <span className={`badge ${position.status === 'Open' ? 'bg-warning' : position.status === 'Filled' ? 'bg-success' : position.status === 'Draft' ? 'bg-secondary' : 'bg-warning'} text-white`}>
                                        {position.status === 'Open' ? 'Abierto' : position.status === 'Filled' ? 'Contratado' : position.status === 'Draft' ? 'Borrador' : position.status}
                                    </span>
                                    <div className="d-flex justify-content-between mt-3">
                                        <Button variant="primary" onClick={() => handleViewProcess(position.id)}>Ver proceso</Button>
                                        <Button variant="secondary">Editar</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Positions;