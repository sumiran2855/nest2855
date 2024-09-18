import { Controller, Get, Res, StreamableFile } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('generate')
  async generatePdf(@Res() res: Response) {
    const pdfBuffer = await this.pdfService.generatePdf();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=agreement.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
  @Get('loanPolicy')
  async loanPolicyPdf(@Res() res: Response) {
    const pdfBuffer = await this.pdfService.LoanPolicyPdf();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=agreement.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
