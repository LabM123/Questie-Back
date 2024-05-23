import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UploadfileService } from '../uploadfile/uploadfile.service';
import slugify from 'slugify';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private coursesRepository: Repository<Course>,
    private readonly uploadfileService: UploadfileService,
  ) {}

  async getAllCourses(withDeleted: boolean = false) {
    try {
      //Select only title, id and lessons of each module
      const allCourses = await this.coursesRepository.find({
        withDeleted,
        select: {
          modules: {
            id: true,
            title: true,
            lessons: {
              id: true,
              title: true,
            },
          },
          categories: {
            id: true,
            name: true,
          },
        },
        relations: ['modules', 'modules.lessons', 'categories'],
      });

      return allCourses;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async getCourseById(id: string) {
    try {
      const foundedCourse = await this.coursesRepository.findOne({
        where: { id },
        select: {
          modules: {
            id: true,
            title: true,
            lessons: {
              id: true,
              title: true,
            },
          },
          categories: {
            id: true,
            name: true,
          },
        },
        relations: ['modules', 'modules.lessons', 'categories'],
      });
      if (!foundedCourse) throw new NotFoundException('Course not found');
      return foundedCourse;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async createCourse(
    createCourseDto: CreateCourseDto,
    files: {
      courseImg?: Express.Multer.File[];
      courseBgImg?: Express.Multer.File[];
    } | null,
  ) {
    try {
      if (
        !files ||
        !files.courseImg ||
        !files.courseBgImg ||
        !files.courseImg.length ||
        !files.courseBgImg.length
      )
        throw new BadRequestException(
          'Course image and background image are required',
        );

      const courseImgUrl = await this.uploadfileService.uploadFile(
        files.courseImg[0],
      );

      const courseBgImgUrl = await this.uploadfileService.uploadFile(
        files.courseBgImg[0],
      );

      const slug = `${slugify(createCourseDto.title, {
        lower: true,
        replacement: '-',
        locale: 'en',
      })}-${new Date().getTime()}`;

      const newCourse = await this.coursesRepository.save(
        this.coursesRepository.create({
          ...createCourseDto,
          image: courseImgUrl.url,
          bg_image: courseBgImgUrl.url,
          slug,
        }),
      );

      return newCourse;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async updateCourse(
    id: string,
    updateCourseDto: UpdateCourseDto,
    files: {
      courseImg?: Express.Multer.File[];
      courseBgImg?: Express.Multer.File[];
    } | null,
  ) {
    try {
      const foundCourse = await this.coursesRepository.findOne({
        where: { id },
      });
      if (!foundCourse) throw new NotFoundException('Course not found');

      if (files) {
        if (files.courseImg && files.courseImg.length) {
          foundCourse.image = (
            await this.uploadfileService.uploadFile(files.courseImg[0])
          ).url;
        }

        if (files.courseBgImg && files.courseBgImg.length)
          foundCourse.bg_image = (
            await this.uploadfileService.uploadFile(files.courseBgImg[0])
          ).url;
      }

      if (updateCourseDto.title) {
        const slugTimestamp = foundCourse.slug.split('-').pop();
        const slug = `${slugify(updateCourseDto.title, {
          lower: true,
          replacement: '-',
          locale: 'en',
        })}-${slugTimestamp}`;

        foundCourse.slug = slug;
      }

      await this.coursesRepository.update(id, {
        ...foundCourse,
        ...updateCourseDto,
      });

      return await this.coursesRepository.findOne({
        where: { id },
        loadRelationIds: true,
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteCourse(id: string) {
    try {
      const foundedCourse = await this.coursesRepository.findOne({
        where: { id },
      });
      if (!foundedCourse) throw new NotFoundException('Course not found');
      foundedCourse.deleted_at = new Date();
      await this.coursesRepository.update(id, foundedCourse);
      const deletedCourse = await this.coursesRepository.findOne({
        where: { id },
      });
      return deletedCourse;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async seeder() {
    /* const cursos = [
      /* {
        category: {
          name: "Cocina",
          image: "https://source.unsplash.com/random"
        },
        course: {
          title: 'Cocina Básica para Principiantes',
          headline: 'Domina los fundamentos de la cocina',
          description: 'Este curso te enseñará los conceptos básicos de la cocina, desde técnicas de corte hasta la preparación de platos sencillos. Ideal para aquellos que recién empiezan en el mundo culinario.',
          courseImgUrl: 'https://placehold.co/600x400.png',
          courseBgImgUrl: 'https://placehold.co/1000x200.png',
          slug: '',
          order: 9,
        }
      },
      {
        category: {
          name: "Música",
          image: "https://source.unsplash.com/random"
        },
        course: {
          title: 'Introducción a la Teoría Musical',
          headline: 'Comprende los fundamentos de la música',
          description: 'Este curso te proporcionará una base sólida en teoría musical, cubriendo aspectos como la lectura de partituras, el ritmo, y la armonía. Perfecto para aspirantes a músicos.',
          courseImgUrl: 'https://placehold.co/600x400.png',
          courseBgImgUrl: 'https://placehold.co/1000x200.png',
          order: 10,
        }
      },
      {
        category: {
          id: 5,
          name: "Fotografía",
          image: "https://source.unsplash.com/random"
        },
        course: {
          title: 'Fotografía Digital para Principiantes',
          headline: 'Captura momentos increíbles',
          description: 'Aprende los fundamentos de la fotografía digital, incluyendo el manejo de cámaras, la composición de imágenes y la edición básica. Ideal para quienes desean mejorar sus habilidades fotográficas.',
          courseImgUrl: 'https://placehold.co/600x400.png',
          courseBgImgUrl: 'https://placehold.co/1000x200.png',
          slug: '',
          order: 11,
        }
      },
      {
        category: {
          id: 6,
          name: "Matemáticas",
          image: "https://source.unsplash.com/random"
        },
        course: {
          title: 'Álgebra Básica',
          headline: 'Domina los conceptos fundamentales del álgebra',
          description: 'Este curso cubre los conceptos esenciales del álgebra, incluyendo ecuaciones, funciones y gráficas. Es perfecto para estudiantes que desean reforzar sus conocimientos en matemáticas.',
          courseImgUrl: 'https://placehold.co/600x400.png',
          courseBgImgUrl: 'https://placehold.co/1000x200.png',
          slug: '',
          order: 12,
        }
      },
      {
        category: {
          id: 7,
          name: "Maquillaje",
          image: "https://source.unsplash.com/random"
        },
        course: {
          title: 'Maquillaje para Principiantes',
          headline: 'Aprende técnicas básicas de maquillaje',
          description: 'Este curso te enseñará las técnicas básicas de maquillaje, desde la preparación de la piel hasta la aplicación de diferentes productos para lograr looks naturales y glamorosos.',
          courseImgUrl: 'https://placehold.co/600x400.png',
          courseBgImgUrl: 'https://placehold.co/1000x200.png',
          slug: '',
          order: 13,
        }
      },
      {
        category: {
          id: 8,
          name: "Diseño de interiores",
          image: "https://source.unsplash.com/random"
        },
        course: {
          title: 'Fundamentos del Diseño de Interiores',
          headline: 'Transforma tus espacios con estilo',
          description: 'Aprende los principios básicos del diseño de interiores, incluyendo la planificación de espacios, la selección de colores y la decoración. Ideal para quienes desean mejorar sus habilidades en la decoración de hogares.',
          courseImgUrl: 'https://placehold.co/600x400.png',
          courseBgImgUrl: 'https://placehold.co/1000x200.png',
          slug: '',
          order: 14,
        }
      }
    ]; */
    const cursos = [
      {
        title: "Cocina Básica para Principiantes",
        headline: "Domina los fundamentos de la cocina",
        description: "Este curso te enseñará los conceptos básicos de la cocina, desde técnicas de corte hasta la preparación de platos sencillos. Ideal para aquellos que recién empiezan en el mundo culinario.",
        image: "https://placehold.co/600x400.png",
        bg_image: "https://placehold.co/1000x200.png",
        slug: ""
      },
      {
        title: "Introducción a la Teoría Musical",
        headline: "Comprende los fundamentos de la música",
        description: "Este curso te proporcionará una base sólida en teoría musical, cubriendo aspectos como la lectura de partituras, el ritmo, y la armonía. Perfecto para aspirantes a músicos.",
        image: "https://placehold.co/600x400.png",
        bg_image: "https://placehold.co/1000x200.png",
        slug: ""
      },
      {
        title: "Fotografía Digital para Principiantes",
        headline: "Captura momentos increíbles",
        description: "Aprende los fundamentos de la fotografía digital, incluyendo el manejo de cámaras, la composición de imágenes y la edición básica. Ideal para quienes desean mejorar sus habilidades fotográficas.",
        image: "https://placehold.co/600x400.png",
        bg_image: "https://placehold.co/1000x200.png",
        slug: ""
      },
      {
        title: "Álgebra Básica",
        headline: "Domina los conceptos fundamentales del álgebra",
        description: "Este curso cubre los conceptos esenciales del álgebra, incluyendo ecuaciones, funciones y gráficas. Es perfecto para estudiantes que desean reforzar sus conocimientos en matemáticas.",
        image: "https://placehold.co/600x400.png",
        bg_image: "https://placehold.co/1000x200.png",
        slug: ""
      },
      {
        title: "Maquillaje para Principiantes",
        headline: "Aprende técnicas básicas de maquillaje",
        description: "Este curso te enseñará las técnicas básicas de maquillaje, desde la preparación de la piel hasta la aplicación de diferentes productos para lograr looks naturales y glamorosos.",
        image: "https://placehold.co/600x400.png",
        bg_image: "https://placehold.co/1000x200.png",
        slug: ""
      },
      {
        title: "Fundamentos del Diseño de Interiores",
        headline: "Transforma tus espacios con estilo",
        description: "Aprende los principios básicos del diseño de interiores, incluyendo la planificación de espacios, la selección de colores y la decoración. Ideal para quienes desean mejorar sus habilidades en la decoración de hogares.",
        image: "https://placehold.co/600x400.png",
        bg_image: "https://placehold.co/1000x200.png",
        slug: ""
      }
    ]
    
  

    
    console.log(cursos);
    

    try {
      cursos.forEach((curso) => {
        const { title } = curso;
        const slug = `${slugify(title, {
          lower: true,
          replacement: '-',
          locale: 'en',
        })}-${new Date().getTime()}`;
        curso.slug = slug; // Asignar el slug a la propiedad 'slug' de cada curso
      });

      const nuevos = await cursos.forEach((curso) => {
        console.log(curso);
        this.coursesRepository.save(this.coursesRepository.create(curso));
      });


      console.log(nuevos);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

}
