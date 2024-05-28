import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ConflictException,
  Put,
  NotFoundException,
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

@ApiTags('Assessment')
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

  @Get('bycourse/:courseId')
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
    return this.assessmentService.findOne(id);
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
    return this.assessmentService.update(id, updateAssessmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una evaluación por ID' })
  @ApiParam({ name: 'id', description: 'ID de la evaluación' })
  @ApiResponse({ status: 200, description: 'La evaluación ha sido eliminada.' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  remove(@Param('id') id: string) {
    return this.assessmentService.remove(id);
  }

  @Get('/scores/:courseId')
  @ApiOperation({ summary: 'Obtener los scores de curso' })
  @ApiParam({ name: 'courseId', description: 'ID del curso' }) // Cambiado 'id' a 'courseId'
  @ApiResponse({
    status: 200,
    description: 'Detalles de la puntuación del curso',
    type: [Assessment], // Asegurarse de que el tipo sea un array de Assessment
  })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  async getScores(@Param('courseId') courseId: string): Promise<Assessment[]> {
    const scores = await this.assessmentService.getScores(courseId);
    if (!scores || scores.length === 0) {
      throw new NotFoundException(
        `Scores for course with ID ${courseId} not found`,
      );
    }
    return scores;
  }
}
