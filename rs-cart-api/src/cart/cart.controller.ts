import { Controller, Get, Delete, Put, Body, Req, Post, HttpStatus, Query } from '@nestjs/common';

import { OrderService } from '../order';

import { CartService } from './services';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  @Get()
  async findUserCart(@Query('userId') userId: string) {
    const cart = await this.cartService.findByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart }
    }
  }

  @Put()
  async updateUserCart(@Query('userId') userId: string, @Body() body) {
    const cart = await this.cartService.updateByUserId(userId, body);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart }
    }
  }


  @Delete()
  async clearUserCart(@Query('userId') userId: string) {
    await this.cartService.removeByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  @Post('checkout')
  async checkout(@Query('userId') userId: string, @Body() body) {
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const { id: cartId, items } = cart;
    const order = await this.orderService.create({
      ...body,
      userId,
      cartId,
      items,
    });
    await this.cartService.removeByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }
}
