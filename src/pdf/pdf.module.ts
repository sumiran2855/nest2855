import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';

@Module({
  imports: [TypeOrmModule.forFeature(), forwardRef(() => UserModule)],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PDFModule {}
