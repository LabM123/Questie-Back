import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module } from './entities/module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../courses/entities/course.entity';
import slugify from 'slugify';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module) private moduleRepository: Repository<Module>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}

  async createModule(createModuleDto: CreateModuleDto) {
    try {
      const { course_id } = createModuleDto;

      const foundCourse = await this.courseRepository.findOne({
        where: { id: course_id },
      });
      if (!foundCourse) {
        throw new NotFoundException('Course not found');
      }

      const slug = `${slugify(createModuleDto.title, {
        lower: true,
        replacement: '-',
        locale: 'en',
      })}-${new Date().getTime()}`;

      const savedModule = await this.moduleRepository.save(
        this.moduleRepository.create({
          ...createModuleDto,
          course: foundCourse,
          slug,
        }),
      );

      return await this.moduleRepository.findOne({
        where: { id: savedModule.id },
        loadRelationIds: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllModules(withDeleted: boolean = false) {
    return await this.moduleRepository.find({
      withDeleted,
      select: {
        lessons: {
          id: true,
          title: true,
        },
      },
      relations: ['lessons'],
    });
  }

  async getModulesById(id: string) {
    const moduleExists = await this.moduleRepository.findOne({
      where: { id },
      select: {
        lessons: {
          id: true,
          title: true,
        },
        course: {
          id: true,
        },
      },
      relations: ['lessons', 'course'],
    });
    if (!moduleExists) {
      throw new NotFoundException('Module not found');
    }

    return moduleExists;
  }

  async updateModule(id: string, updateModuleDto: UpdateModuleDto) {
    const foundModule = await this.moduleRepository.findOne({
      where: { id },
    });

    if (!foundModule) {
      throw new NotFoundException('Module not found');
    }

    if (updateModuleDto.title) {
      const slugTimestamp = foundModule.slug.split('-').pop();
      const slug = `${slugify(updateModuleDto.title, {
        lower: true,
        replacement: '-',
        locale: 'en',
      })}-${slugTimestamp}`;

      foundModule.slug = slug;
    }

    const updatedModule = await this.moduleRepository.update(id, {
      ...foundModule,
      ...updateModuleDto,
    });

    if (updatedModule.affected <= 0) {
      throw new InternalServerErrorException('Module not updated');
    }

    return await this.moduleRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }

  async removeModule(id: string) {
    const moduleExists = await this.moduleRepository.findOne({ where: { id } });
    if (!moduleExists) {
      throw new NotFoundException('Module not found');
    }

    const deletedModule = await this.moduleRepository.update(id, {
      deleted_at: new Date(),
    });

    if (deletedModule.affected <= 0) {
      throw new InternalServerErrorException('Module not deleted');
    }

    return { message: 'Resource succesfully deleted' };
  }

  /*   "id": "1dbe0b43-87ea-4955-8903-eb4600456659",
  "title": "Introducción a la Programación en Python",

  "id": "8cbccc55-7b06-42f2-8ea4-92530e900dcb",
  "title": "Desarrollo de Aplicaciones Móviles con React Native",

  "id": "b207a999-c284-458b-864b-2205e4adf392",
  "title": "Desarrollo Web con Node.js y Express",

  "id": "061a6535-7280-44b0-8b0b-e1ca864f52ec",
  "title": "Programación Avanzada en C++",

  "id": "713202c1-9db4-46e6-8447-7d997c757ace",
  "title": "Diseño Gráfico y Creatividad con Adobe Illustrator",

  "id": "1aedd40e-2949-437e-aa2e-f2d78a9e9c95",
  "title": "Aprendizaje Automático con Python y Scikit-Learn",

  "id": "71740632-cfd4-46b4-a202-65747becce06",
  "title": "Introducción al Desarrollo de Videojuegos con Unity",

  "id": "3461bdc2-7ad1-4035-a7a3-bbb0b451ea66",
  "title": "Introducción al Diseño de Interfaz de Usuario", */

  async seeder() {
    const modulos = [
      {
        title: 'Introducción a React Native',
        description:
          'En este módulo, los estudiantes recibirán una introducción completa a React Native como framework para el desarrollo de aplicaciones móviles. Se cubrirán los conceptos básicos, la arquitectura y la configuración del entorno de desarrollo.',
        image: 'https://placehold.co/600x400.png',
        slug: '',
        course_id: '01348522-e506-4230-b676-5a0de088a987',
      },
      {
        title: 'Introducción a React Native',
        description:
          'En este módulo, los estudiantes recibirán una introducción completa a React Native como framework para el desarrollo de aplicaciones móviles. Se cubrirán los conceptos básicos, la arquitectura y la configuración del entorno de desarrollo.',
        image: 'https://placehold.co/600x400.png',
        slug: '',
        course_id: '741d972a-8a71-48e0-85c1-7d1fb4e12c08',
      },
      {
        title: 'Introducción a React Native',
        description:
          'En este módulo, los estudiantes recibirán una introducción completa a React Native como framework para el desarrollo de aplicaciones móviles. Se cubrirán los conceptos básicos, la arquitectura y la configuración del entorno de desarrollo.',
        image: 'https://placehold.co/600x400.png',
        slug: '',
        course_id: '08f3e092-fb6a-43f9-a63a-1c1f6f4853bc',
      },
      {
        title: 'Introducción a React Native',
        description:
          'En este módulo, los estudiantes recibirán una introducción completa a React Native como framework para el desarrollo de aplicaciones móviles. Se cubrirán los conceptos básicos, la arquitectura y la configuración del entorno de desarrollo.',
        image: 'https://placehold.co/600x400.png',
        slug: '',
        course_id: '98199180-7541-4516-b75f-c0c956d14e49',
      },
      {
        title: 'Introducción a React Native',
        description:
          'En este módulo, los estudiantes recibirán una introducción completa a React Native como framework para el desarrollo de aplicaciones móviles. Se cubrirán los conceptos básicos, la arquitectura y la configuración del entorno de desarrollo.',
        image: 'https://placehold.co/600x400.png',
        slug: '',
        course_id: 'ca424ad1-3c3c-445f-baa3-98382701bc4e',
      },
      {
        title: 'Introducción a React Native',
        description:
          'En este módulo, los estudiantes recibirán una introducción completa a React Native como framework para el desarrollo de aplicaciones móviles. Se cubrirán los conceptos básicos, la arquitectura y la configuración del entorno de desarrollo.',
        image: 'https://placehold.co/600x400.png',
        slug: '',
        course_id: 'cf38f4ec-cb42-47ce-bb79-efb177f8221a',
      },
    ];

    try {
      const savedModules = await Promise.all(
        modulos.map(async (modulo) => {
          const { title } = modulo;
          const slug = `${slugify(title, {
            lower: true,
            replacement: '-',
            locale: 'en',
          })}-${new Date().getTime()}`;
          modulo.slug = slug;
          const {course_id, ...modul} = modulo
          const curs = await this.courseRepository.findOne({
            where: { id: course_id },
          });
          
          const newModule = this.moduleRepository.create(modul);
          newModule.course = curs;
          return await this.moduleRepository.save(newModule);
        }),
      );
      return savedModules;
      /* const ids = await Promise.all(
        savedModules.map(async (modulo) => {
          return await modulo.id;
        }),
      ); */

      /* const foundMod = await Promise.all(
        ids.map(async (id) => {
          console.log(id);
          const modul = await this.courseRepository.findOne({ where: { id:'b207a999-c284-458b-864b-2205e4adf392' } });
          return modul;
          
        }),
      ); */
      /*   const curs = await this.courseRepository.findOne({
        where: { id: 'b207a999-c284-458b-864b-2205e4adf392' },
      });

      console.log(curs);
      console.log(ids); */

      /*   const foundMod = await Promise.all(
        ids.map(async (id) => {
          console.log(id);
          const resultado = await this.moduleRepository.update(id, {course:curs})
          
          return resultado;
          
        }),
      );
      console.log(foundMod);
       
      return foundMod */

      /* modules.forEach((module) => {});

      await this.coursesRepository.update(id, {
        ...foundCourse,
        ...updateCourseDto,
      });

      return await this.coursesRepository.findOne({
        where: { id },
        loadRelationIds: true,
      }); */

      /* await Promise.all(
        savedModules.map(async (savedModule) => {
          const foundModules = await this.courseRepository.findOne({
            where: { id: savedModule.course },
          });
          if (course) {
            // Si se encuentra el curso correspondiente, agregamos el módulo guardado a su lista de módulos.
            course.modules.push(savedModule);
            await this.courseRepository.save(course);
          } else {
            // Manejar el caso en el que no se encuentre el curso correspondiente.
            console.error(
              `No se encontró un curso para el módulo con ID ${savedModule.course}`,
            );
          }
        }),
      ); */
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async updateMod() {
    const updatMod = [
      {
        id: '4760f4ee-d96d-4312-abb8-682687d72259',
        course_id: 'b207a999-c284-458b-864b-2205e4adf392',
      },
      {
        id: '4a9547b4-94a9-46b1-845b-b7fcfde1b440',
        course_id: 'b207a999-c284-458b-864b-2205e4adf392',
      },
      {
        id: '6167acd5-74eb-4ea3-a7c3-715bb1ed2cc5',
        course_id: 'b207a999-c284-458b-864b-2205e4adf392',
      },
      {
        id: '78e3d27a-281e-4393-8924-5f95096923e7',
        course_id: 'b207a999-c284-458b-864b-2205e4adf392',
      },
      {
        id: 'a228e205-5147-4591-a84c-fef9dccb4c58',
        course_id: 'b207a999-c284-458b-864b-2205e4adf392',
      },
    ];
    try {
      const savedModules = await Promise.all(
        updatMod.map(async (modulo) => {
          const { id, course_id } = modulo;

          const curs = await this.courseRepository.findOne({
            where: { id: course_id },
          });

          const mod = await this.moduleRepository.findOne({
            where: { id: id },
          });

          mod.course = curs;

          const updatedModule = await this.moduleRepository.update(id, mod);

          return updatedModule;
        }),
      );
      return savedModules;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
