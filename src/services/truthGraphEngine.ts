import { TruthGraph, GraphNode, GraphEdge } from '../types/graph';
import { ConsumerCaseInput } from '../types';
import { EvidenceFact } from '../types/evidence';

/**
 * Builds a deterministic Transaction Truth Graph from the case data and verified facts.
 * This function contains no AI/LLM calls — it maps structured case fields to nodes and edges.
 */
export function buildTruthGraph(
  caseData: ConsumerCaseInput,
  facts: EvidenceFact[]
): TruthGraph {

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  let edgeCounter = 0;
  const makeEdgeId = () => `edge-${++edgeCounter}`;

  // --- Helper to find a fact value ---
  const findFact = (keyword: string): EvidenceFact | undefined =>
    facts.find(f => f.fact.toLowerCase().includes(keyword.toLowerCase()));

  // --- Node: Consumer ---
  nodes.push({
    id: 'n-consumer',
    label: 'Demo Consumer',
    type: 'Consumer',
    subtitle: 'Complainant',
    knownFacts: [
      'Initiated the purchase',
      `Requested remedy: ${caseData.remedies.join(', ') || 'Refund'}`,
      'Reported product defect',
    ],
    evidenceSources: ['seller_chat.png', 'Consumer Intake Narrative'],
    status: 'Consumer reported',
    x: 80,
    y: 300,
  });

  // --- Node: Order ---
  const orderFact = findFact('Order Reference');
  nodes.push({
    id: 'n-order',
    label: caseData.orderId || orderFact?.value || 'ORD-78291',
    type: 'Order',
    subtitle: 'Purchase Order',
    knownFacts: [
      `Order ID: ${caseData.orderId || 'ORD-78291'}`,
      `Date: ${caseData.purchaseDate || '12 Sep 2026'}`,
      `Amount: ₹${caseData.amount || '54,999'}`,
    ],
    evidenceSources: ['order_confirmation.pdf', 'invoice.pdf'],
    status: 'Document supported',
    x: 280,
    y: 300,
  });

  // --- Node: Seller ---
  nodes.push({
    id: 'n-seller',
    label: caseData.parties.seller || caseData.seller || 'TechWorld Store',
    type: 'Seller',
    subtitle: 'Merchant of Record',
    knownFacts: [
      'Listed on marketplace',
      'Fulfilled the order',
      'Received complaint',
      'Refund not confirmed',
    ],
    evidenceSources: ['invoice.pdf', 'seller_chat.png'],
    status: 'Document supported',
    x: 480,
    y: 150,
  });

  // --- Node: Marketplace ---
  nodes.push({
    id: 'n-marketplace',
    label: caseData.parties.marketplace || caseData.platform || 'ExampleMart',
    type: 'Marketplace',
    subtitle: 'E-commerce Platform',
    knownFacts: [
      'Hosted the listing',
      'Processed the transaction',
      'Provided order confirmation',
    ],
    evidenceSources: ['order_confirmation.pdf', 'invoice.pdf'],
    status: 'Document supported',
    x: 480,
    y: 450,
  });

  // --- Node: Payment ---
  const payFact = findFact('Payment Provider');
  nodes.push({
    id: 'n-payment',
    label: caseData.parties.paymentProvider || 'ExamplePay',
    type: 'PaymentProvider',
    subtitle: payFact?.value || 'UPI Ref: EP-998231',
    knownFacts: [
      'Payment authorised',
      `Reference: ${payFact?.value || 'UPI Ref: EP-998231'}`,
    ],
    evidenceSources: ['payment_receipt.png'],
    status: 'Document supported',
    x: 280,
    y: 520,
  });

  // --- Node: Logistics ---
  nodes.push({
    id: 'n-logistics',
    label: caseData.parties.logistics || 'FastShip',
    type: 'Logistics',
    subtitle: 'Fulfilment Courier',
    knownFacts: [
      'Dispatched the product',
      'Delivered with visible packaging damage',
    ],
    evidenceSources: ['delivery_photo.jpg'],
    status: 'Document supported',
    x: 680,
    y: 300,
  });

  // --- Node: Product ---
  const productFact = findFact('Product Model');
  nodes.push({
    id: 'n-product',
    label: productFact?.value || 'Dell Inspiron 15',
    type: 'Product',
    subtitle: 'Item in Dispute',
    knownFacts: [
      productFact?.value || 'Dell Inspiron 15 (Core i5, 16GB RAM)',
      'Visible outer packaging damage & display casing fracture',
    ],
    evidenceSources: ['invoice.pdf', 'delivery_photo.jpg'],
    status: 'Document supported',
    x: 680,
    y: 150,
  });

  // --- Node: Complaint ---
  nodes.push({
    id: 'n-complaint',
    label: 'Complaint Filed',
    type: 'Complaint',
    subtitle: 'Consumer complaint via app',
    knownFacts: [
      'Defect reported on arrival date',
      'Requested refund via in-app chat',
    ],
    evidenceSources: ['seller_chat.png'],
    status: 'Document supported',
    x: 280,
    y: 100,
  });

  // --- Node: Refund ---
  nodes.push({
    id: 'n-refund',
    label: 'Refund Requested',
    type: 'Refund',
    subtitle: 'Status: Unconfirmed',
    knownFacts: [
      'Refund requested via in-app chat',
      'No confirmation or credit received',
    ],
    evidenceSources: ['seller_chat.png'],
    status: 'Disputed',
    x: 480,
    y: 550,
  });

  // --- EDGES ---

  // Consumer → placed → Order
  edges.push({
    id: makeEdgeId(),
    fromId: 'n-consumer',
    toId: 'n-order',
    label: 'placed',
    factId: 'fact-5',
    evidenceId: 'doc-3',
    date: caseData.purchaseDate || '12 Sep 2026',
    status: 'Document supported',
  });

  // Consumer → paid → PaymentProvider
  edges.push({
    id: makeEdgeId(),
    fromId: 'n-consumer',
    toId: 'n-payment',
    label: 'paid via',
    factId: 'fact-4',
    evidenceId: 'doc-2',
    status: 'Document supported',
  });

  // Consumer → complained to → Seller
  edges.push({
    id: makeEdgeId(),
    fromId: 'n-consumer',
    toId: 'n-complaint',
    label: 'reported defect',
    factId: 'fact-9',
    evidenceId: 'doc-5',
    status: 'Document supported',
  });

  // Consumer → requested → Refund
  edges.push({
    id: makeEdgeId(),
    fromId: 'n-consumer',
    toId: 'n-refund',
    label: 'requested',
    factId: 'fact-9',
    evidenceId: 'doc-5',
    status: 'Document supported',
  });

  // Order → purchased from → Seller
  edges.push({
    id: makeEdgeId(),
    fromId: 'n-order',
    toId: 'n-seller',
    label: 'purchased from',
    factId: 'fact-3',
    evidenceId: 'doc-1',
    status: 'Document supported',
  });

  // Order → listed on → Marketplace
  edges.push({
    id: makeEdgeId(),
    fromId: 'n-order',
    toId: 'n-marketplace',
    label: 'listed on',
    factId: 'fact-2',
    evidenceId: 'doc-1',
    status: 'Document supported',
  });

  // Seller → shipped → Product
  edges.push({
    id: makeEdgeId(),
    fromId: 'n-seller',
    toId: 'n-product',
    label: 'supplied',
    factId: 'fact-6',
    evidenceId: 'doc-1',
    status: 'Document supported',
  });

  // Logistics → delivered → Product
  edges.push({
    id: makeEdgeId(),
    fromId: 'n-logistics',
    toId: 'n-product',
    label: 'delivered',
    factId: 'fact-7',
    evidenceId: 'doc-4',
    status: 'Document supported',
  });

  // Seller → fulfilled via → Logistics
  edges.push({
    id: makeEdgeId(),
    fromId: 'n-seller',
    toId: 'n-logistics',
    label: 'shipped via',
    factId: 'fact-7',
    evidenceId: 'doc-4',
    status: 'Document supported',
  });

  // Seller → responded to → Complaint
  edges.push({
    id: makeEdgeId(),
    fromId: 'n-seller',
    toId: 'n-complaint',
    label: 'responded to',
    factId: 'fact-10',
    evidenceId: 'doc-5',
    status: 'Disputed',
  });

  // Refund → unresolved at → Seller
  edges.push({
    id: makeEdgeId(),
    fromId: 'n-refund',
    toId: 'n-seller',
    label: 'unresolved with',
    factId: 'fact-10',
    evidenceId: 'doc-5',
    status: 'Disputed',
  });

  return {
    nodes,
    edges,
    generatedAt: new Date().toISOString(),
  };
}
