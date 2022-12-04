export interface CreateUser {
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  pdf?: PDFKit.PDFDocument;
}

export interface SaveUserPdf {
  email: string;
  pdf: PDFKit.PDFDocument;
}

export interface PatchUser {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
}
