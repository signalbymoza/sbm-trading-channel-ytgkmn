import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Readable } from 'stream';
import PDFDocument from 'pdfkit';
import { eq } from 'drizzle-orm';
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  // POST /api/profit-plans/upload - Upload a profit plan PDF file
  fastify.post('/api/profit-plans/upload', async (request: FastifyRequest, reply: FastifyReply) => {
    app.logger.info({}, 'Uploading profit plan file');

    try {
      const parts = request.parts();

      let fileData: { filename: string; buffer: Buffer } | null = null;
      let planAmount: string | null = null;
      let description: string | null = null;

      // Iterate through the multipart form data
      for await (const part of parts) {
        if (part.type === 'file') {
          const buffer = await part.toBuffer();
          fileData = {
            filename: part.filename,
            buffer,
          };
        } else if (part.type === 'field') {
          if (part.fieldname === 'plan_amount') {
            planAmount = part.value as string;
          } else if (part.fieldname === 'description') {
            description = part.value as string;
          }
        }
      }

      if (!fileData) {
        app.logger.warn({}, 'No file provided in profit plan upload');
        return reply.status(400).send({ error: 'No file provided' });
      }

      if (!planAmount) {
        app.logger.warn({}, 'No plan_amount provided in profit plan upload');
        return reply.status(400).send({ error: 'plan_amount is required' });
      }

      const key = `profit-plans/${planAmount}/${Date.now()}-${fileData.filename}`;

      // Upload the file to storage
      const uploadedKey = await app.storage.upload(key, fileData.buffer);

      // Generate a signed URL for the file
      const { url: fileUrl } = await app.storage.getSignedUrl(uploadedKey);

      // Store the file reference in the database
      const planFile = await app.db.insert(schema.profit_plan_files).values({
        plan_amount: planAmount,
        file_url: fileUrl,
        file_name: fileData.filename,
        description: description || undefined,
      }).returning();

      app.logger.info({ planAmount, fileId: planFile[0].id }, 'Profit plan file uploaded successfully');

      reply.status(201);
      return {
        id: planFile[0].id,
        plan_amount: planFile[0].plan_amount,
        file_url: planFile[0].file_url,
        file_name: planFile[0].file_name,
        created_at: planFile[0].created_at?.toISOString(),
      };
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to upload profit plan file');
      return reply.status(500).send({ error: 'Failed to upload profit plan file' });
    }
  });

  // GET /api/profit-plans/download-file - Download profit plan document
  fastify.get('/api/profit-plans/download-file', {
    schema: {
      description: 'Download profit plan document by plan amount',
      tags: ['profit-plans'],
      querystring: {
        type: 'object',
        properties: {
          plan_amount: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'string',
          format: 'binary',
          description: 'PDF file or redirect to file URL',
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { plan_amount?: string };
    const planAmount = query.plan_amount;

    app.logger.info({ planAmount }, 'Downloading profit plan document');

    try {
      // If plan_amount is provided, look up the file from the database
      if (planAmount) {
        const planFile = await app.db.query.profit_plan_files.findFirst({
          where: eq(schema.profit_plan_files.plan_amount, planAmount),
        });

        if (!planFile) {
          app.logger.warn({ planAmount }, 'No file found for plan amount');
          return reply.status(404).send({ error: 'No file found for this plan amount' });
        }

        app.logger.info({ planAmount, fileUrl: planFile.file_url }, 'Redirecting to profit plan file');

        // Redirect to the file URL
        return reply.redirect(planFile.file_url);
      }

      // If no plan_amount provided, generate a default PDF
      app.logger.info({}, 'Generating default profit plan PDF document');

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
      const docId = generateDocumentId();
      doc.fontSize(9).font('Helvetica').fillColor('#666');
      doc.text(`Generated on: ${new Date().toISOString().split('T')[0]}`);
      doc.text(`Document ID: ${docId}`);

      // Finalize the PDF
      doc.end();

      app.logger.info({ documentId: docId }, 'Default profit plan PDF generated successfully');

      return stream;
    } catch (error) {
      app.logger.error({ err: error, planAmount }, 'Failed to download profit plan document');
      return reply.status(500).send({ error: 'Failed to download profit plan document' });
    }
  });
}

// Helper function to generate a unique document ID
function generateDocumentId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PP-${timestamp}-${random}`;
}
