import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

const AISummary = ({ geminiResponse }) => {
    if (!geminiResponse) {
        return (
            <Card className="ai-card mb-3">
                <Card.Body>
                    <Card.Title className="ai-title">AI Product Summary</Card.Title>
                    <Card.Text className="ai-empty">No AI summary available.</Card.Text>
                </Card.Body>
            </Card>
        );
    }

    const { product_name, product_description, pros, cons, rating } = geminiResponse;

    const safePros = Array.isArray(pros) ? pros : [];
    const safeCons = Array.isArray(cons) ? cons : [];

    return (
        <>
            <style>{`
                .ai-card {
                    border-radius: 14px;
                    padding: 5px;
                    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.12);
                    border: none;
                    background: #ffffff;
                }
                .ai-title { font-weight:700; font-size:1.25rem; margin-bottom:1rem; color:#222; }
                .ai-section { margin-bottom:1.2rem; }
                .ai-label { font-size:0.85rem; text-transform:uppercase; font-weight:600; color:#6c757d; margin-bottom:4px; }
                .ai-text { font-size:1rem; color:#333; margin:0; }
                .ai-empty { color:#999; font-size:0.95rem; }
                .ai-divider { margin:1rem 0; border-top:1px solid #e4e4e4; }
                .ai-list { margin-top:0.3rem; }
                .ai-list-item {
                    background:#f8f9fa;
                    border-radius:6px;
                    margin-bottom:6px;
                    border:none;
                    padding:10px 12px;
                    font-size:0.95rem;
                    color:#333;
                }
                .ai-rating {
                    background:#0d6efd;
                    font-size:0.9rem;
                    padding:6px 10px;
                    border-radius:6px;
                }
            `}</style>

            <Card className="ai-card mb-3">
                <Card.Body>
                    <Card.Title className="ai-title">AI Product Summary</Card.Title>

                    <section className="ai-section">
                        <p className="ai-label">Name</p>
                        <p className="ai-text">{product_name}</p>
                    </section>

                    <section className="ai-section">
                        <p className="ai-label">Description</p>
                        <p className="ai-text">{product_description || "—"}</p>
                    </section>

                    <hr className="ai-divider" />

                    <section className="ai-section">
                        <p className="ai-label">Pros</p>
                        {safePros.length === 0 ? (
                            <p className="ai-text">—</p>
                        ) : (
                            <ListGroup className="ai-list" variant="flush">
                                {safePros.map((p, i) => (
                                    <ListGroup.Item className="ai-list-item" key={i}>
                                        {p}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </section>

                    <section className="ai-section">
                        <p className="ai-label">Cons</p>
                        {safeCons.length === 0 ? (
                            <p className="ai-text">—</p>
                        ) : (
                            <ListGroup className="ai-list" variant="flush">
                                {safeCons.map((c, i) => (
                                    <ListGroup.Item className="ai-list-item" key={i}>
                                        {c}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </section>

                    <hr className="ai-divider" />

                    <section className="ai-section">
                        <p className="ai-label">Rating</p>
                        <Badge className="ai-rating">
                            {rating != null ? `${rating} / 5` : "N/A"}
                        </Badge>
                    </section>
                </Card.Body>
            </Card>
        </>
    );
};

export default AISummary;
