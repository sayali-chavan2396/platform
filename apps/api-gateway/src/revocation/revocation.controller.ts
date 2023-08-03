import { Controller, Logger, Post, Body, UseGuards, Patch, Param, Get, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { CreateRevocationRegistryDto } from '../dtos/create-revocation-registry.dto';
import { RevocationService } from './revocation.service';
import { GetUser } from '../authz/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateRevocationRegistryUriDto } from '../dtos/update-revocation-registry.dto';

@ApiBearerAuth()
@Controller()
export class RevocationController {

    private readonly logger = new Logger('RevocationController');

    constructor(private readonly revocationService: RevocationService) { }

    // @UseGuards(AuthGuard('jwt'))
    // @Post('/revocation/create-registry')
    // @ApiTags('revocation-registry')
    // @ApiOperation({ summary: 'Creates a new revocation registry' })
    // @ApiResponse({ status: 201, description: 'Create Revocation Registry' })
    // createRevocationRegistry(
    //     @Body() createRevocationRegistryDto: CreateRevocationRegistryDto,
    //     @GetUser() user: any
    // ) {
    //     return this.revocationService.createRevocationRegistry(createRevocationRegistryDto, user);
    // }

    // @UseGuards(AuthGuard('jwt'))
    // @Post('/revocation/registry/update-uri')
    // @ApiTags('revocation-registry')
    // @ApiOperation({ summary: 'Update revocation registry with new public URI to the tails file.' })
    // @ApiResponse({ status: 201, description: 'Update revocation registry with new public URI to the tails file.' })
    // updateRevocationRegistryUri(
    //     @Body() updateRevocationRegistryUriDto: UpdateRevocationRegistryUriDto,
    //     @GetUser() user: any
    // ) {
    //     return this.revocationService.updateRevocationRegistryUri(updateRevocationRegistryUriDto, user);
    // }

    // @UseGuards(AuthGuard('jwt'))
    // @Get('/revocation/active-registry')
    // @ApiTags('revocation-registry')
    // @ApiQuery({ name: 'cred_def_id', required: true })
    // @ApiOperation({ summary: 'Get an active revocation registry by credential definition id' })
    // @ApiResponse({ status: 200, description: 'Get an active revocation registry by credential definition id' })
    // activeRevocationRegistry(
    //     @Query('cred_def_id') cred_def_id: string,
    //     @GetUser() user: any
    // ) {
    //     return this.revocationService.activeRevocationRegistry(cred_def_id, user);
    // }

    // @UseGuards(AuthGuard('jwt'))
    // @Post('/revocation/registry/publish')
    // @ApiQuery({ name: 'rev_reg_id', required: true })
    // @ApiTags('revocation-registry')
    // @ApiOperation({ summary: 'Publish a given revocation registry' })
    // @ApiResponse({ status: 201, description: 'Publish a given revocation registry' })
    // publishRevocationRegistry(
    //     @Query('rev_reg_id') revocationId: string,
    //     @GetUser() user: any
    // ) {
    //     return this.revocationService.publishRevocationRegistry(revocationId, user);
    // }

    // @UseGuards(AuthGuard('jwt'))
    // @Get('/revocation/registry')
    // @ApiTags('revocation-registry')
    // @ApiQuery({ name: 'rev_reg_id', required: true })
    // @ApiOperation({ summary: 'Get revocation registry by revocation registry id' })
    // @ApiResponse({ status: 200, description: 'Get revocation registry by revocation registry id' })
    // getRevocationRegistry(
    //     @Query() rev_reg_id: string,
    //     @GetUser() user: any
    // ) {
    //     return this.revocationService.getRevocationRegistry(rev_reg_id, user);
    // }
}