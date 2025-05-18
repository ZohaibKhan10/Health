
export interface DocumentNote {
  id: string;
  title: string;
  content: string;
  page: number;
  dateAdded: string;
}

export interface DocumentBookmark {
  id: string;
  page: number;
  title?: string;
  dateAdded: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  content?: string;
  dateAdded: string;
  currentPage: number;
  totalPages: number;
  bookmarks: DocumentBookmark[];
  notes: DocumentNote[];
}
