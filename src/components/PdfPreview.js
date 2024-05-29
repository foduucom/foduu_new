import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const PdfPreview = ({ pageNumber, numPages, setNumPages }) => {
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }
  
  useEffect(() => {
    const url = './bankpdf/adity-birala-new.pdf'
    pdfjs.getDocument(url).promise.then(onDocumentLoadSuccess)
  }, [])

  return (
    <>
      <div>
        <Document file={'./bankpdf/adity-birala-new.pdf'} onLoadSuccess={onDocumentLoadSuccess}>
          {numPages > 0 && (
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              scale={1.7}
              renderAnnotationLayer={false}
            />
          )}
        </Document>
      </div>
    </>
  )
}

export default PdfPreview
