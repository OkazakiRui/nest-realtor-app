import { HomeResponseDto } from './dto/home.dto';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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
    // minPrice, maxPrice どちらかが存在する場合
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: minPrice }),
            ...(maxPrice && { lte: maxPrice }),
          }
        : undefined;

    const filter = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { property_type: propertyType }),
    };

    return this.homeService.getHomes(filter);
  }

  @Get('/:id')
  getHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHomeById(id);
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
