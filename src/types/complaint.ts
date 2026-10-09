export interface ComplaintSection {
  id: string;
  title: string;
  content: string;
  editable: boolean;
  placeholders?: string[];
}

export interface ComplaintDraft {
  id: string;
  title: string;
  sections: ComplaintSection[];
  generatedAt: string;
  lastEditedAt: string;
  isEdited: boolean;
  disclaimer: string;
}

export interface AttachmentRef {
  refId: string;
  filename: string;
  description: string;
}
