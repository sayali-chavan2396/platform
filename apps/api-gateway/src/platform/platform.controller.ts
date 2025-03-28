import { BadRequestException, Controller, Get, HttpStatus, Logger, Param, Query, Res, UseFilters, UseGuards } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../dtos/apiResponse.dto';
import { GetAllSchemaByPlatformDto } from '../schema/dtos/get-all-schema.dto';
import { IUserRequestInterface } from '../interfaces/IUserRequestInterface';
import { User } from '../authz/decorators/user.decorator';
import { Response } from 'express';
import { ISchemaSearchPayload } from '../interfaces/ISchemaSearch.interface';
import { IResponse } from '@credebl/common/interfaces/response.interface';
import { ResponseMessages } from '@credebl/common/response-messages';
import { CustomExceptionFilter } from 'apps/api-gateway/common/exception-handler';
import { AuthGuard } from '@nestjs/passport';
import * as QRCode from 'qrcode';
import { CredDefSortFields, SchemaType, SortFields } from '@credebl/enum/enum';
import { GetAllPlatformCredDefsDto } from '../credential-definition/dto/get-all-platform-cred-defs.dto';
import { TrimStringParamPipe } from '@credebl/common/cast.helper';

@Controller('')
@UseFilters(CustomExceptionFilter)
export class PlatformController {
    constructor(private readonly platformService: PlatformService) { }

    private readonly logger = new Logger('PlatformController');

    /**
     * Retrieves all schemas available on the platform with optional filters and sorting.
     *
     * @param ledgerId The ID of the ledger.
     * @param schemaType Type of schema to filter results.
     * 
     * @returns A paginated list of schemas based on the provided criteria.
     */
    @Get('/platform/schemas')
    @ApiTags('schemas')
    @ApiOperation({
        summary: 'Get all schemas from platform.',
        description: 'Retrieves all schemas available on the platform'
    })
    @ApiQuery({
        name: 'sortField',
        enum: SortFields,
        required: false
      }) 
    @ApiQuery({
        name: 'schemaType',
        enum: SchemaType,
        required: false
      })    
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ApiResponseDto })
    async getAllSchema(
        @Query() getAllSchemaDto: GetAllSchemaByPlatformDto,
        @Res() res: Response,
        @User() user: IUserRequestInterface
    ): Promise<Response> {
        const { ledgerId, pageSize, searchByText, pageNumber, sorting, sortByValue, schemaType } = getAllSchemaDto;
        const schemaSearchCriteria: ISchemaSearchPayload = {
            ledgerId,
            pageNumber,
            searchByText,
            pageSize,
            sortField: sorting,
            sortBy: sortByValue,
            schemaType
        };
        const schemasResponse = await this.platformService.getAllSchema(schemaSearchCriteria, user);
        const finalResponse: IResponse = {
            statusCode: HttpStatus.OK,
            message: ResponseMessages.schema.success.fetch,
            data: schemasResponse
        };
        return res.status(HttpStatus.OK).json(finalResponse);
    }

/**
     * Retrieves all credential definitions available on the platform.
     * 
     * @returns A list of credential definitions and their details.
     */
    @Get('/platform/cred-defs')
    @ApiTags('credential-definitions')
    @ApiOperation({
        summary: 'Get all credential-definitions from platform.',
        description: 'Retrieves all credential definitions available on the platform'
    })
    @ApiQuery({
        name: 'sortField',
        enum: CredDefSortFields,
        required: false
      })    
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ApiResponseDto })
    async getAllCredDefs(
        @Query() getAllPlatformCredDefs: GetAllPlatformCredDefsDto,
        @Res() res: Response,
        @User() user: IUserRequestInterface
    ): Promise<Response> {
        const schemasResponse = await this.platformService.getAllPlatformCredDefs(getAllPlatformCredDefs, user);
        const finalResponse: IResponse = {
            statusCode: HttpStatus.OK,
            message: ResponseMessages.credentialDefinition.success.fetch,
            data: schemasResponse
        };
        return res.status(HttpStatus.OK).json(finalResponse);
    }

    /**
     * Retrieves all available ledgers from the platform.
     *
     * @returns A list of ledgers and their details.
     */
    @Get('/platform/ledgers')
    @ApiTags('ledgers')
    @ApiOperation({
        summary: 'Get all ledgers from platform.',
        description: 'Retrieves a list of all available ledgers on platform.'
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ApiResponseDto })
    async getAllLedgers(
        @Res() res: Response
    ): Promise<object> {
        const networksResponse = await this.platformService.getAllLedgers();

        const finalResponse: IResponse = {
            statusCode: HttpStatus.OK,
            message: ResponseMessages.ledger.success.fetch,
            data: networksResponse
        };
        return res.status(HttpStatus.OK).json(finalResponse);
    }

    /**
     * Retrieves the network URL associated with a specific ledger namespace.
     *
     * @param indyNamespace The namespace of the ledger.
     * @returns The network URL for the specified ledger.
     */
    @Get('/platform/network/url/:indyNamespace')
    @ApiTags('ledgers')
    @ApiOperation({
        summary: 'Get network url from platform.',
        description: 'Retrieves the network URL for a specified ledger namespace.'
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ApiResponseDto })
    async getNetwrkUrl(
        @Param('indyNamespace', TrimStringParamPipe) indyNamespace: string,
        @Res() res: Response
    ): Promise<Response> {
        if (!indyNamespace) {
            throw new BadRequestException(ResponseMessages.ledger.error.indyNamespaceisRequired);
        }
        const networksResponse = await this.platformService.getNetworkUrl(indyNamespace);

        const finalResponse: IResponse = {
            statusCode: HttpStatus.OK,
            message: ResponseMessages.ledger.success.fetchNetworkUrl,
            data: networksResponse
        };
        return res.status(HttpStatus.OK).json(finalResponse);
    }

    @Get('/invitation/:referenceId')
    @ApiOperation({
        summary: `Get shortening url by referenceId`,
        description: `Get shortening url by referenceId`
    })
    @ApiExcludeEndpoint()
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ApiResponseDto })
    async getShorteningUrlById(
        @Param('referenceId') referenceId: string,
        @Res() res: Response
    ): Promise<Response> {
        const shorteningUrlDetails = await this.platformService.getShorteningUrlById(referenceId);
        const finalResponse: IResponse = {
            statusCode: HttpStatus.OK,
            message: ResponseMessages.shorteningUrl.success.getshorteningUrl,
            data: shorteningUrlDetails
        };
        return res.status(HttpStatus.OK).json(finalResponse);
    }

    @Get('/invitation/qr-code/:referenceId')
    @ApiOperation({
        summary: `Get QR by referenceId`,
        description: `Get QR by referenceId`
    })
    @ApiExcludeEndpoint()
    @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ApiResponseDto })
    async getQrCode(
        @Param('referenceId') referenceId: string,
        @Res() res: Response
    ): Promise<void> {
        const url = `${process.env.API_GATEWAY_PROTOCOL}://${process.env.API_ENDPOINT}/invitation/${referenceId}`;
        // Generate QR code as a buffer
        const qrCodeBuffer = await QRCode.toBuffer(url);

        // Set response type to image/png
        res.type('image/png');

        // Send the QR code buffer as the response
        res.send(qrCodeBuffer);
    }
}
