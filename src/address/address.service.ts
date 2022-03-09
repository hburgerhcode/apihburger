import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LoginService } from 'src/login/login.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkNumber } from 'utils/checkNumber';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {

  constructor(private db: PrismaService, private login: LoginService) { }

  async isValidPerson(address_id: number, person_id: number) {

    person_id = checkNumber(person_id);

    const address = await this.findOne(checkNumber(address_id));

    if (address.person_id !== person_id) {

      throw new BadRequestException("Operação inválida.");

    }

    return true;
  }

  async findAll() {

    return this.db.address.findMany();
  }

  async findOne(id: number) {

    const address = await this.db.address.findUnique({
      where: {
        id: checkNumber(id),
      },
    });

    if (!address) {
      throw new BadRequestException("Não existe o endereço solicitado.");
    }

    return address;
  }

  async findMyAddress(address_id: number, user_id: number) {
    const person_id = await this.login.getPersonId(user_id);

    await this.isValidPerson(address_id, person_id);

    const address = await this.db.address.findFirst({
      where: {
        id: address_id,
        person_id
      }
    });

    return address;
  }

  async findByPerson(user_id: number) {

    const person_id = await this.login.getPersonId(user_id);

    return this.db.address.findMany({
      where: {
        person_id,
      }
    });
  }

  async create(user_id: number, data: CreateAddressDto) {

    const person_id = await this.login.getPersonId(user_id);

    if (isNaN(person_id)) {
      throw new NotFoundException("User not found.");
    }

    return this.db.address.create({
      data: {
        person_id,
        ...data,
      },
    });
  }

  async update(id: number, user_id: number, dataUpdate: UpdateAddressDto) {

    const person_id = await this.login.getPersonId(user_id);

    await this.isValidPerson(id, person_id);

    return this.db.address.update({
      where: {
        id,
      },
      data: dataUpdate,
    });
  }

  async delete(id: number, user_id: number) {

    const person_id = await this.login.getPersonId(user_id);

    await this.isValidPerson(id, person_id);

    return this.db.address.delete({
      where: {
        id,
      },
    });
  }
}