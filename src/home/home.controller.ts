import { HomeResponseDto } from './dto/home.dto';
import { Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { PropertyType } from '@prisma/client';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    console.log({
      city,
      minPrice,
      maxPrice,
      propertyType,
    });

    return this.homeService.getHomes();
  }

  @Get('/:id')
  getHome() {
    return {};
  }

  @Post()
  createHome() {
    return {};
  }

  @Put('/:id')
  updateHome() {
    return {};
  }

  @Delete('/:id')
  deleteHome() {
    return;
  }
}
