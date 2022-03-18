import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPayload } from 'src/user/decorator/user.decorator';
import { HomeResponseDto } from './dto/home.dto';

type GetHomesParam = {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  property_type: PropertyType;
};

type CreateHomeParams = {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: PropertyType;
  images: { url: string }[];
};

type UpdateHomeParams = {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  propertyType?: PropertyType;
};

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 全物件を取得します。filterObjectを渡すと絞り込みが出来ます
   * @date 2022-03-17
   * @param {GetHomesParam} filter
   * @returns {object[]} homeData[]
   */
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

    if (!homes.length) throw new NotFoundException();

    return homes.map((home) => {
      const fetchHome = { ...home, image: home.images[0].url };
      // images と image が存在しているので imagesプロパティ を削除する
      delete fetchHome.images;
      return new HomeResponseDto(fetchHome);
    });
  }

  /**
   * homeIdから物件の詳細情報を取得します
   * @date 2022-03-17
   * @param {number} homeId
   * @returns {object} homeData
   */
  async getHomeById(id: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findUnique({
      where: { id },
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        property_type: true,
        number_of_bedrooms: true,
        number_of_bathrooms: true,
        images: {
          select: {
            url: true,
          },
        },
        realtor: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) throw new NotFoundException();

    const fetchHome = {
      ...home,
      images: home.images.map((image) => image.url),
    };

    return new HomeResponseDto(fetchHome);
  }

  /**
   * userId名義で物件を作成します
   * @date 2022-03-17
   * @param {CreateHomeParams} :
   * @param {number} userId
   * @returns {object} createdHomeData
   */
  async createHome(
    {
      address,
      numberOfBedrooms,
      numberOfBathrooms,
      city,
      price,
      landSize,
      propertyType,
      images,
    }: CreateHomeParams,
    userId: number,
  ) {
    const home = await this.prismaService.home.create({
      data: {
        address,
        number_of_bedrooms: numberOfBedrooms,
        number_of_bathrooms: numberOfBathrooms,
        city,
        price,
        land_size: landSize,
        property_type: propertyType,
        realtor_id: userId,
      },
    });

    const homeImages = images.map((image) => {
      return { ...image, home_id: home.id };
    });

    await this.prismaService.image.createMany({ data: homeImages });

    return new HomeResponseDto(home);
  }

  /**
   * homeIdから物件を取得した物件を更新します
   * @date 2022-03-17
   * @param {number} homeId
   * @param {UpdateHomeParams} updateHomeParams
   * @returns {object} updatedHomeData
   */
  async updateHomeById(id: number, data: UpdateHomeParams) {
    const home = await this.prismaService.home.findUnique({ where: { id } });

    if (!home) throw new NotFoundException();

    const updatedHome = await this.prismaService.home.update({
      where: { id },
      data,
    });

    return new HomeResponseDto(updatedHome);
  }

  /**
   * homeIdの物件を削除する
   * @date 2022-03-17
   * @param {number} homeId
   * @returns {void}
   */
  async deleteHomeById(id: number) {
    await this.prismaService.image.deleteMany({ where: { home_id: id } });
    await this.prismaService.home.delete({ where: { id } });
  }

  /**
   * homeIdからrealtorのデータを取得する
   * @date 2022-03-17
   * @param {number} homeId
   * @returns {object} realtorData
   */
  async getRealtorByHomeId(id: number) {
    // homeに結びつくrealtorからユーザー情報を取得する
    const home = await this.prismaService.home.findUnique({
      where: { id },
      select: {
        realtor: {
          select: {
            name: true,
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) throw new NotFoundException();
    return home.realtor;
  }

  /**
   * buyerが物件にメッセージを追加することが出来ます
   * @date 2022-03-18
   * @param {number} homeId
   * @param {UserPayload}  buyer
   * @param {string}  message
   * @returns {object}
   */
  async inquire(homeId: number, buyer: UserPayload, message: string) {
    const realtor = await this.getRealtorByHomeId(homeId);
    return this.prismaService.message.create({
      data: {
        realtor_id: realtor.id,
        buyer_id: buyer.id,
        home_id: homeId,
        message,
      },
    });
  }
}
