import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { join } from 'path';
import * as ejs from 'ejs';

@Injectable()
export class PdfService {
  async generatePdf(): Promise<Buffer> {
    const templatePath = join(
      process.cwd(),
      'src',
      'pdf',
      'EJS_Template',
      'financeAgreement.ejs',
    );
    const html = await ejs.renderFile(templatePath, {
      name: 'Sumiran',
      date: new Date(),
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A3' });
    await browser.close();

    return Buffer.from(pdfBuffer);
  }

  async LoanPolicyPdf(): Promise<Buffer> {
    const templatePath = join(
      process.cwd(),
      'src',
      'pdf',
      'EJS_Template',
      'loanPolicy.ejs',
    );
    const html = await ejs.renderFile(templatePath, {
      name: 'Sumiran',
      date: new Date(),
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A3' });
    await browser.close();

    return Buffer.from(pdfBuffer);
  }

}
