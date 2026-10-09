import React, { useState, useRef } from 'react';
import { 
  FileUp, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { EvidenceDocument, EvidenceCategory, FileFormat } from '../types/evidence';
import { syntheticDemoDocuments } from '../data/demoEvidence';
import { ProgressStepper } from '../components/ProgressStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';

interface EvidenceUploadProps {
  documents: EvidenceDocument[];
  onUpdateDocuments: (docs: EvidenceDocument[]) => void;
  onProceedToProcessing: () => void;
  onBackToIntake: () => void;
}

export const EvidenceUpload: React.FC<EvidenceUploadProps> = ({
  documents,
  onUpdateDocuments,
  onProceedToProcessing,
  onBackToIntake,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EvidenceCategory>('Invoice');
  const [dragOver, setDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: EvidenceCategory[] = [
    'Invoice',
    'Payment receipt',
    'Order confirmation',
    'Delivery record',
    'Product photo',
    'Chat / message',
    'Email',
    'Refund / cancellation record',
    'Other'
  ];

  // Load demo evidence
  const handleLoadDemoEvidence = () => {
    onUpdateDocuments([...syntheticDemoDocuments]);
  };

  // Add simulated uploaded file
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newDocs: EvidenceDocument[] = Array.from(files).map((file, idx) => {
      const ext = file.name.split('.').pop()?.toUpperCase() as FileFormat || 'PDF';
      const sizeKb = Math.round(file.size / 1024);
      const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

      return {
        id: `doc-${Date.now()}-${idx}`,
        filename: file.name,
        category: selectedCategory,
        fileType: (['PDF', 'PNG', 'JPG', 'JPEG'].includes(ext) ? ext : 'PDF') as FileFormat,
        fileSize: sizeStr || '350 KB',
        uploadStatus: 'uploaded',
        processingStatus: 'uploaded',
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
    });

    onUpdateDocuments([...documents, ...newDocs]);
  };

  const handleRemoveDoc = (id: string) => {
    onUpdateDocuments(documents.filter(d => d.id !== id));
  };

  const handleClearAll = () => {
    onUpdateDocuments([]);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'PNG' || fileType === 'JPG' || fileType === 'JPEG') {
      return <ImageIcon className="w-5 h-5 text-indigo-600" />;
    }
    return <FileText className="w-5 h-5 text-indigo-600" />;
  };

  return (
    <div className="py-8 md:py-12 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header & Back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToIntake}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Case Details
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Add Evidence Documents
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Stage 2: Upload documents to corroborate statements and extract structured facts.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadDemoEvidence}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-subtle"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Load Demo Evidence</span>
          </button>
          
          {documents.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1.5 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Progress Stepper - Step 02 Active */}
      <ProgressStepper currentStep={2} />

      {/* Upload Box Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-6">
        
        {/* Category selector for incoming uploads */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Select Category for Upload
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFileUpload(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-indigo-600 bg-indigo-50/50 scale-[1.005]'
              : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-subtle">
            <FileUp className="w-7 h-7" />
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Drag & drop your files here, or <span className="text-indigo-600 underline">browse files</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Supported formats: PDF, PNG, JPG, JPEG (Invoices, Receipts, Screenshots, Photos)
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            <Plus className="w-3 h-3" /> Categorized as: <strong className="text-slate-800 font-bold">{selectedCategory}</strong>
          </div>
        </div>

        {/* Uploaded Documents List */}
        {documents.length > 0 ? (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Uploaded Evidence Vault ({documents.length})
              </h4>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for AI Analysis
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/90 flex items-start justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate" title={doc.filename}>
                        {doc.filename}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                        <span className="font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                          {doc.category}
                        </span>
                        <span>•</span>
                        <span>{doc.fileSize}</span>
                        <span>•</span>
                        <span className="uppercase text-[10px]">{doc.fileType}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
            <AlertCircle className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            No documents uploaded yet. Upload files above or click <strong>"Load Demo Evidence"</strong> to proceed with synthetic data.
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <SecondaryButton size="md" onClick={onBackToIntake}>
            Back to Case Intake
          </SecondaryButton>

          <PrimaryButton
            size="lg"
            disabled={documents.length === 0}
            onClick={onProceedToProcessing}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 font-semibold"
          >
            Process & Extract Facts ({documents.length} Files)
          </PrimaryButton>
        </div>

      </div>

    </div>
  );
};
