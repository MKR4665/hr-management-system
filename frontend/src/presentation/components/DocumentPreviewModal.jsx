import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

export default function DocumentPreviewModal({ isOpen, onClose, html, title, onDownload }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <Card className="relative w-full max-w-5xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col h-[90vh] overflow-hidden border-none">
        <CardHeader className="border-b bg-white shrink-0 flex flex-row items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Live preview of the generated document.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            {onDownload && (
              <Button className="bg-brand-600 hover:bg-brand-700" onClick={onDownload}>
                Download PDF
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0 bg-slate-100/50 flex justify-center">
          <div className="bg-white my-8 shadow-2xl border border-slate-200 origin-top" style={{ width: '210mm', minHeight: '297mm' }}>
            <div 
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: html }} 
            />
          </div>
        </CardContent>
      </Card>
      
      <style jsx global>{`
        .preview-content .page {
          margin: 0 !important;
          box-shadow: none !important;
          width: 100% !important;
        }
        .preview-content .page:not(:first-child) {
          margin-top: 20px !important;
        }
      `}</style>
    </div>
  );
}
