import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIssueDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
