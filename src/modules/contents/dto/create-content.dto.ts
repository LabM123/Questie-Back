import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

enum ContentType {
  Title = 'title',
  Subtitle = 'subtitle',
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Questie = 'questie',
}

export class CreateContentDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  lesson_id: string;

  @IsNotEmpty()
  contents: {
    type: ContentType;
    content: JSON;
  };
}
