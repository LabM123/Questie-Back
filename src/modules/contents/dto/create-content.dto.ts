import { IsNotEmpty, IsString, IsUUID, IsEnum } from 'class-validator';

enum ContentType {
  Title = 'title',
  Subtitle = 'subtitle',
  Text = 'text',
  Image = 'image',
  Video = 'video',
}

export class CreateContentDto {
  @IsNotEmpty()
  @IsEnum(ContentType)
  type: ContentType;

  @IsNotEmpty()
  content: JSON;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  lesson_id: string;
}