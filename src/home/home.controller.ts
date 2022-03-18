import {
  HomeResponseDto,
  CreateHomeDto,
  UpdateHomeDto,
  InquireDto,
} from './dto/home.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { PropertyType, UserType } from '@prisma/client';
import { User, UserPayload } from 'src/user/decorator/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorator/roles.decorator';

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

  @Roles(UserType.REALTOR)
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserPayload) {
    return this.homeService.createHome(body, user.id);
  }

  @Roles(UserType.REALTOR)
  @Put('/:id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserPayload,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) throw new UnauthorizedException();

    return this.homeService.updateHomeById(id, body);
  }

  @Roles(UserType.REALTOR)
  @Delete('/:id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayload,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) throw new UnauthorizedException();

    return this.homeService.deleteHomeById(id);
  }

  @Roles(UserType.BUYER)
  @Post('/:id/inquire')
  inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserPayload,
    @Body() { message }: InquireDto,
  ) {
    return this.homeService.inquire(homeId, user, message);
  }
}
