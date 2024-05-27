import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ConflictException,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { Assessment } from './entities/assessment.entity';

@ApiTags('Assessment') // Agrupa los endpoints bajo el tag "assessment" en la documentación Swagger
@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva evaluación' })
  @ApiBody({ type: CreateAssessmentDto })
  @ApiResponse({
    status: 201,
    description: 'La evaluación ha sido creada.',
    type: Assessment,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto al crear la evaluación.',
  })
  async createAssessment(
    @Body() createAssessmentDto: CreateAssessmentDto,
  ): Promise<Assessment> {
    try {
      return await this.assessmentService.createAssessment(createAssessmentDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Get(':courseId')
  @ApiOperation({ summary: 'Obtener evaluaciones por ID de curso' })
  @ApiParam({ name: 'courseId', description: 'ID del curso' })
  @ApiResponse({
    status: 200,
    description: 'Lista de evaluaciones',
    type: [Assessment],
  })
  async getAssessmentsForCourse(
    @Param('courseId') courseId: string,
  ): Promise<Assessment[]> {
    return this.assessmentService.getAssessmentsForCourse(courseId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las evaluaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las evaluaciones',
    type: [Assessment],
  })
  findAll() {
    return this.assessmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una evaluación por ID' })
  @ApiParam({ name: 'id', description: 'ID de la evaluación' })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la evaluación',
    type: Assessment,
  })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  findOne(@Param('id') id: string) {
    return this.assessmentService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una evaluación por ID' })
  @ApiParam({ name: 'id', description: 'ID de la evaluación' })
  @ApiBody({ type: UpdateAssessmentDto })
  @ApiResponse({
    status: 200,
    description: 'La evaluación ha sido actualizada.',
    type: Assessment,
  })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateAssessmentDto: UpdateAssessmentDto,
  ) {
    return this.assessmentService.update(+id, updateAssessmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una evaluación por ID' })
  @ApiParam({ name: 'id', description: 'ID de la evaluación' })
  @ApiResponse({ status: 200, description: 'La evaluación ha sido eliminada.' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  remove(@Param('id') id: string) {
    return this.assessmentService.remove(+id);
  }
}
