export type NodeType =
  | 'Consumer'
  | 'Seller'
  | 'Marketplace'
  | 'PaymentProvider'
  | 'Logistics'
  | 'Product'
  | 'Order'
  | 'Payment'
  | 'Delivery'
  | 'Complaint'
  | 'Refund'
  | 'Evidence';

export type FactStatus =
  | 'Document supported'
  | 'Consumer reported'
  | 'Inferred'
  | 'Disputed'
  | 'Unknown';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  subtitle?: string;
  knownFacts: string[];
  evidenceSources: string[];
  status: FactStatus;
  // Layout position (for deterministic layout)
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  fromId: string;
  toId: string;
  label: string;
  factId?: string;
  evidenceId?: string;
  date?: string;
  status: FactStatus;
}

export interface TruthGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  generatedAt: string;
}
