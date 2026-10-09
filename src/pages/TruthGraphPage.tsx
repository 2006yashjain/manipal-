import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Info, CheckCircle, AlertTriangle, HelpCircle, FileText } from 'lucide-react';
import { TruthGraph, GraphNode, GraphEdge } from '../types/graph';
import { SecondaryButton } from '../components/SecondaryButton';
import { ProgressStepper } from '../components/ProgressStepper';

interface TruthGraphPageProps {
  graph: TruthGraph;
  onContinueToTimeline: () => void;
  onBackToSummary: () => void;
}

const nodeColors: Record<string, string> = {
  Consumer: 'bg-indigo-100 border-indigo-300 text-indigo-800',
  Seller: 'bg-amber-50 border-amber-300 text-amber-800',
  Marketplace: 'bg-sky-50 border-sky-300 text-sky-800',
  PaymentProvider: 'bg-emerald-50 border-emerald-300 text-emerald-800',
  Logistics: 'bg-violet-50 border-violet-300 text-violet-800',
  Product: 'bg-rose-50 border-rose-300 text-rose-800',
  Order: 'bg-slate-100 border-slate-300 text-slate-700',
  Payment: 'bg-teal-50 border-teal-300 text-teal-800',
  Delivery: 'bg-orange-50 border-orange-300 text-orange-800',
  Complaint: 'bg-red-50 border-red-300 text-red-800',
  Refund: 'bg-yellow-50 border-yellow-300 text-yellow-800',
  Evidence: 'bg-purple-50 border-purple-300 text-purple-800',
};

const nodeIcons: Record<string, string> = {
  Consumer: '👤',
  Seller: '🏪',
  Marketplace: '🛒',
  PaymentProvider: '💳',
  Logistics: '📦',
  Product: '💻',
  Order: '📋',
  Payment: '✅',
  Delivery: '🚚',
  Complaint: '⚠️',
  Refund: '🔄',
  Evidence: '📄',
};

const statusBadge = (status: string) => {
  switch (status) {
    case 'Document supported':
      return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5"><CheckCircle className="w-2.5 h-2.5" />Document supported</span>;
    case 'Consumer reported':
      return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full px-2 py-0.5"><Info className="w-2.5 h-2.5" />Consumer reported</span>;
    case 'Disputed':
      return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5"><AlertTriangle className="w-2.5 h-2.5" />Disputed</span>;
    case 'Inferred':
      return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5"><HelpCircle className="w-2.5 h-2.5" />Inferred</span>;
    default:
      return <span className="text-[10px] text-slate-400">Unknown</span>;
  }
};

const edgeStatusColor = (status: string) => {
  switch (status) {
    case 'Document supported': return 'border-emerald-300 text-emerald-700';
    case 'Disputed': return 'border-red-300 text-red-700';
    case 'Inferred': return 'border-amber-300 text-amber-700';
    default: return 'border-indigo-200 text-indigo-600';
  }
};

export const TruthGraphPage: React.FC<TruthGraphPageProps> = ({
  graph,
  onContinueToTimeline,
  onBackToSummary,
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Group nodes for a clean visual layout
  const entityNodes = graph.nodes.filter(n =>
    ['Consumer', 'Seller', 'Marketplace', 'PaymentProvider', 'Logistics'].includes(n.type)
  );
  const eventNodes = graph.nodes.filter(n =>
    ['Order', 'Product', 'Complaint', 'Refund', 'Payment', 'Delivery'].includes(n.type)
  );

  return (
    <div className="py-8 md:py-12 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Progress */}
      <ProgressStepper currentStep={3} />

      {/* Header */}
      <div className="mt-8 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
          Stage 3 — Case Reconstruction
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Transaction Truth Graph
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl leading-relaxed">
          The following entities and relationships are derived from your verified facts and uploaded evidence.
          Node colours indicate the evidence status of each entity. Select a node for details.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: 'Document supported', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: 'Consumer reported', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
          { label: 'Disputed', color: 'text-red-700 bg-red-50 border-red-200' },
          { label: 'Inferred', color: 'text-amber-700 bg-amber-50 border-amber-200' },
        ].map(l => (
          <span key={l.label} className={`text-[10px] font-semibold border rounded-full px-2.5 py-1 ${l.color}`}>
            {l.label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden">
          
          {/* Entities row */}
          <div className="mb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Parties</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
              {entityNodes.map(node => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node === selectedNode ? null : node)}
                  className={`group text-left rounded-xl border-2 p-3 transition-all cursor-pointer ${
                    selectedNode?.id === node.id
                      ? 'ring-2 ring-indigo-500 ring-offset-1 scale-[1.02]'
                      : 'hover:scale-[1.01] hover:shadow-md'
                  } ${nodeColors[node.type] || 'bg-slate-50 border-slate-200 text-slate-700'}`}
                >
                  <div className="text-lg mb-1">{nodeIcons[node.type] || '○'}</div>
                  <div className="text-[11px] font-bold leading-tight">{node.label}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{node.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider with arrow */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 border-t border-dashed border-slate-200" />
            <span className="text-slate-300 text-xs font-mono">↕ relationships</span>
            <div className="flex-1 border-t border-dashed border-slate-200" />
          </div>

          {/* Events / Objects row */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Events & Objects</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {eventNodes.map(node => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node === selectedNode ? null : node)}
                  className={`group text-left rounded-xl border-2 p-3 transition-all cursor-pointer ${
                    selectedNode?.id === node.id
                      ? 'ring-2 ring-indigo-500 ring-offset-1 scale-[1.02]'
                      : 'hover:scale-[1.01] hover:shadow-md'
                  } ${nodeColors[node.type] || 'bg-slate-50 border-slate-200 text-slate-700'}`}
                >
                  <div className="text-lg mb-1">{nodeIcons[node.type] || '○'}</div>
                  <div className="text-[11px] font-bold leading-tight">{node.label}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{node.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Relationship table */}
          <div className="mt-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Relationships</p>
            <div className="space-y-1.5">
              {graph.edges.map((edge: GraphEdge) => {
                const fromNode = graph.nodes.find(n => n.id === edge.fromId);
                const toNode = graph.nodes.find(n => n.id === edge.toId);
                return (
                  <div
                    key={edge.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${edgeStatusColor(edge.status)} bg-white/50`}
                  >
                    <span className="font-semibold text-slate-700 truncate max-w-[100px]">{fromNode?.label}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-medium italic">{edge.label}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[100px]">{toNode?.label}</span>
                    {edge.date && <span className="ml-auto text-slate-400 text-[10px] shrink-0">{edge.date}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="lg:col-span-1 space-y-4">
          {selectedNode ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className={`p-4 ${nodeColors[selectedNode.type] || 'bg-slate-50'}`}>
                <div className="text-2xl mb-1">{nodeIcons[selectedNode.type]}</div>
                <div className="font-bold text-sm">{selectedNode.label}</div>
                <div className="text-xs opacity-80 mt-0.5">{selectedNode.type} · {selectedNode.subtitle}</div>
                <div className="mt-2">{statusBadge(selectedNode.status)}</div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Known Facts</p>
                  <ul className="space-y-1">
                    {selectedNode.knownFacts.map((f, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span className="text-slate-300 mt-0.5">—</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Evidence Sources</p>
                  <ul className="space-y-1">
                    {selectedNode.evidenceSources.map((s, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Related edges */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Relationships</p>
                  <ul className="space-y-1">
                    {graph.edges
                      .filter(e => e.fromId === selectedNode.id || e.toId === selectedNode.id)
                      .map(e => {
                        const other = graph.nodes.find(n => n.id === (e.fromId === selectedNode.id ? e.toId : e.fromId));
                        const direction = e.fromId === selectedNode.id ? '→' : '←';
                        return (
                          <li key={e.id} className="text-xs text-slate-600">
                            <span className="text-slate-400">{direction}</span>{' '}
                            <em>{e.label}</em>{' '}
                            <span className="font-medium">{other?.label}</span>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-3">
                <Info className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">Select a node</p>
              <p className="text-xs text-slate-400 mt-1">Click any entity or object to see known facts and evidence sources.</p>
            </div>
          )}

          {/* Prototype note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Prototype Note</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              This graph is generated from structured case data using rule-based analysis, not AI. Relationships reflect document-supported and consumer-reported facts only.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <SecondaryButton
          onClick={onBackToSummary}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Evidence Summary
        </SecondaryButton>
        <button
          onClick={onContinueToTimeline}
          className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors"
        >
          Continue: Timeline Reconstruction
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
