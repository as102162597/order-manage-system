import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ShipmentDto } from "src/dtos/shipment.dto";
import { ShipmentCoordinator } from "src/coordinators/shipment.coordinator";

@Controller('shipment')
export class ShipmentController {
    constructor(private readonly shipmentCoordinator: ShipmentCoordinator) {}

    @Post()
    async create(
        @Query('orderId', ParseIntPipe) orderId: number,
        @Body() shipmentDto: ShipmentDto
    ): Promise<void> {
        await this.shipmentCoordinator.create(orderId, shipmentDto);
    }

    @Get()
    async findOneByCode(@Query('code') code: string): Promise<ShipmentDto> {
        return this.shipmentCoordinator.findOneByCode(code);
    }

    @Get('count/deleted')
    async findDeletedPageCount(
        @Query('size', new DefaultValuePipe(1), ParseIntPipe) size: number
    ): Promise<number> {
        return this.shipmentCoordinator.findPageCount(size, true);
    }

    @Get('list/deleted')
    async listDeleted(
        @Query('size', ParseIntPipe) size: number,
        @Query('page', ParseIntPipe) page: number
    ): Promise<ShipmentDto[]> {
        return this.shipmentCoordinator.findBySizeAndPage(size, page, true);
    }

    @Get(':id')
    async findOneById(@Param('id', ParseIntPipe) id: number): Promise<ShipmentDto> {
        return this.shipmentCoordinator.findOneById(id);
    }

    @Put()
    async update(@Body() shipmentDto: Partial<ShipmentDto>): Promise<void> {
        await this.shipmentCoordinator.update(shipmentDto);
    }

    @Patch('restore/:id')
    async restoreOneById(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.shipmentCoordinator.restoreOneById(id);
    }

    @Delete(':id')
    async deleteOneById(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.shipmentCoordinator.deleteOneById(id);
    }

    @Delete('hard-delete/:id')
    async removeOneById(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.shipmentCoordinator.removeOneById(id);
    }
};
