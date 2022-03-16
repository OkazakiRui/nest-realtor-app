import { Injectable } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';

type GetHomesParam = {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  property_type: PropertyType;
};

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filter: GetHomesParam): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        property_type: true,
        number_of_bedrooms: true,
        number_of_bathrooms: true,
        // 画像を一枚だけ取得する
        images: {
          // key が url のみ取得する
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filter,
    });
    return homes.map((home) => {
      const fetchHome = { ...home, image: home.images[0].url };
      // images と image が存在しているので imagesプロパティ を削除する
      delete fetchHome.images;
      return new HomeResponseDto(fetchHome);
    });
  }
}
