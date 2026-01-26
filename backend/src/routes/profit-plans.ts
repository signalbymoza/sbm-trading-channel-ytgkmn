import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Readable } from 'stream';
import PDFDocument from 'pdfkit';
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  // GET /api/profit-plans/download-file - Download profit plan document
  fastify.get('/api/profit-plans/download-file', {
    schema: {
      description: 'Download profit plan document as PDF',
      tags: ['profit-plans'],
      response: {
        200: {
          type: 'string',
          format: 'binary',
          description: 'PDF file',
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    app.logger.info({}, 'Generating profit plan PDF document');

    try {
      // Create a new PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      // Set response headers
      reply.type('application/pdf');
      reply.header('Content-Disposition', 'attachment; filename="profit-plan-document.pdf"');

      // Create a readable stream from the PDF document
      const stream = new Readable();
      let chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        stream.push(pdfBuffer);
        stream.push(null);
      });

      // Add content to the PDF
      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('PROFIT PLAN DOCUMENT', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text('SBM Trading Channels', { align: 'center' });
      doc.moveDown();

      // Add a line separator
      doc.strokeColor('#333').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Plan Details Section
      doc.fontSize(14).font('Helvetica-Bold').text('Plan Details', { underline: true });
      doc.moveDown(0.3);

      doc.fontSize(11).font('Helvetica');
      doc.text('Plan Type: Premium Trading Plan');
      doc.moveDown(0.2);
      doc.text('Duration: 1 Year (12 Months)');
      doc.moveDown(0.2);
      doc.text('Price: $250 USD');
      doc.moveDown(0.2);
      doc.text('Maximum Risk Per Trade: 25%');
      doc.moveDown();

      // Plan Features Section
      doc.fontSize(14).font('Helvetica-Bold').text('Plan Features', { underline: true });
      doc.moveDown(0.3);

      doc.fontSize(11).font('Helvetica');
      const features = [
        'Access to exclusive trading signals',
        'Live market analysis and updates',
        'Risk management guidance',
        'Portfolio tracking and monitoring',
        'Monthly performance reports',
        'Priority customer support',
        '24/7 access to trading platform',
      ];

      features.forEach(feature => {
        doc.text(`• ${feature}`);
        doc.moveDown(0.2);
      });

      doc.moveDown();

      // Risk Disclaimer Section
      doc.fontSize(14).font('Helvetica-Bold').text('Risk Disclaimer', { underline: true });
      doc.moveDown(0.3);

      doc.fontSize(10).font('Helvetica');
      doc.text(
        'This trading plan is provided for educational purposes only. Trading and investing involve substantial risk of loss. ' +
        'Past performance does not guarantee future results. The maximum risk of 25% per trade is a guideline and does not ' +
        'guarantee profitability or protect against losses. All trading decisions are made at your own risk and discretion. ' +
        'Please consult with a financial advisor before making any investment decisions.',
        {
          align: 'justify',
          width: 500,
        }
      );

      doc.moveDown();

      // Footer with date and document ID
      doc.fontSize(9).font('Helvetica').fillColor('#666');
      doc.text(`Generated on: ${new Date().toISOString().split('T')[0]}`);
      doc.text(`Document ID: ${generateDocumentId()}`);

      // Finalize the PDF
      doc.end();

      app.logger.info({ documentId: generateDocumentId() }, 'Profit plan PDF generated successfully');

      return stream;
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to generate profit plan PDF');
      return reply.status(500).send({ error: 'Failed to generate profit plan document' });
    }
  });
}

// Helper function to generate a unique document ID
function generateDocumentId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PP-${timestamp}-${random}`;
}
