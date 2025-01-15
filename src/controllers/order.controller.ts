import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { OrderDto } from "src/dtos/order.dto";
import { OrderCoordinator } from "src/coordinators/order.coordinator";

@Controller('order')
export class OrderController {
    constructor(private readonly orderCoordinator: OrderCoordinator) {}

    @Post()
    async create(@Body() orderDto: OrderDto): Promise<void> {
        await this.orderCoordinator.create(orderDto);
    }

    @Get()
    async findOneBySalesChannelAndCode(
        @Query('salesChannel') salesChannel: string,
        @Query('code') code: string
    ): Promise<OrderDto> {
        return this.orderCoordinator.findOneBySalesChannelAndCode(salesChannel, code);
    }

    @Get('count/deleted')
    async findDeletedPageCount(
        @Query('size', new DefaultValuePipe(1), ParseIntPipe) size: number
    ): Promise<number> {
        return this.orderCoordinator.findPageCount(size, true);
    }

    @Get('count')
    async findPageCount(
        @Query('size', new DefaultValuePipe(1), ParseIntPipe) size: number
    ): Promise<number> {
        return this.orderCoordinator.findPageCount(size);
    }

    @Get('list/deleted')
    async listDeleted(
        @Query('size', ParseIntPipe) size: number,
        @Query('page', ParseIntPipe) page: number
    ): Promise<OrderDto[]> {
        return this.orderCoordinator.findBySizeAndPage(size, page, true);
    }

    @Get('list')
    async list(
        @Query('size', ParseIntPipe) size: number,
        @Query('page', ParseIntPipe) page: number
    ): Promise<OrderDto[]> {
        return this.orderCoordinator.findBySizeAndPage(size, page);
    }

    @Get(':id')
    async findOneById(@Param('id') id: number): Promise<OrderDto> {
        return this.orderCoordinator.findOneById(id);
    }

    @Put()
    async update(@Body() orderDto: Partial<OrderDto>): Promise<void> {
        await this.orderCoordinator.update(orderDto);
    }

    @Patch('restore/:id')
    async restoreOneById(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.orderCoordinator.restoreOneById(id);
    }

    @Delete(':id')
    async deleteOneById(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.orderCoordinator.deleteOneById(id);
    }

    @Delete('hard-delete/:id')
    async removeOneById(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.orderCoordinator.removeOneById(id);
    }
};
