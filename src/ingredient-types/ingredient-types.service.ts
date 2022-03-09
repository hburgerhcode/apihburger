import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkNumber } from 'utils/checkNumber';
import { CreateIngredientTypeDto } from './dto/create-ingredient-type.dto';
import { UpdateIngredientTypeDto } from './dto/update-ingredient-type.dto';

@Injectable()
export class IngredientTypesService {

  constructor(
    private db: PrismaService
  ){}

  //Auxiliar :
    isValidNumber(number, nome: string){
      number = Number(number)
      if(isNaN(number)) {
        throw new BadRequestException(`${nome} Inválido`)
      }
      return number
    }

    async isThereId(id: number) {
      id = checkNumber(id)

        const ingredientType = await this.db.ingredientType.findUnique({
          where: {
            id
          }
        })

        if(!ingredientType) {
          throw new NotFoundException("Ingredient Type Não Encontrado")
        }


      return true
    }

  //CREATE

  async create(data: CreateIngredientTypeDto) {
    
    data.repeatable = checkNumber(data.repeatable)

    return this.db.ingredientType.create({
      data
    })
  }

  //READ

  async findAll() {
    return this.db.ingredientType.findMany()
  }

  async findOne(id: number) {

    try {
      await this.isThereId(id)
    } catch (e) {
      throw new NotFoundException("Ingredient Type Não Encontrado")
    }

    return this.db.ingredientType.findUnique({
      where: {
        id
      }
    })
  }

  //UPDATE

  async update(id: number, data: UpdateIngredientTypeDto) {
    
    try {
      await this.isThereId(id)
    } catch (e) {
      throw new NotFoundException("Ingredient Type Não Encontrado")
    }
    


    data.repeatable = checkNumber(data.repeatable)

    return this.db.ingredientType.update({
      where: {
        id
      },
      data
    })
  }

  //DELETE
  async remove(id: number) {
    
    try {
      await this.isThereId(id)
    } catch (e) {
      throw new NotFoundException("Ingredient Type Não Encontrado")
    }

    return this.db.ingredientType.delete({
      where: {
        id
      }
    })
  }
}