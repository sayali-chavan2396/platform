import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { toLowerCase, trim } from '@credebl/common/cast.helper';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
// import { IProofRequestAttribute } from '../interfaces/verification.interface';

class IProofRequestAttribute {
    @IsString()
    attributeName: string;

    @IsString()
    condition?: string;

    @IsString()
    value?: string;

    @IsString()
    credDefId?: string;

    @IsString()
    schemaId: string;
}

export class RequestProof {
    @ApiProperty()
    @Transform(({ value }) => trim(value))
    @Transform(({ value }) => toLowerCase(value))
    @IsNotEmpty({ message: 'connectionId is required.' })
    @MaxLength(36, { message: 'connectionId must be at most 36 character.' })
    connectionId: string;

    @ApiProperty({
        'example': [
            {
                attributeName: 'attributeName',
                condition: '>=',
                value: 'predicates',
                credDefId: '',
                schemaId: ''
            }
        ]
    })
    @IsArray({ message: 'attributes must be in array' })
    @IsObject({ each: true })
    @IsNotEmpty({ message: 'please provide valid attributes' })
    attributes: IProofRequestAttribute[];

    @ApiProperty()
    @IsOptional()
    comment: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: 'please provide orgId' })
    orgId: number;

    @IsString({ message: 'auto accept proof must be in string' })
    @IsNotEmpty({ message: 'please provide valid auto accept proof' })
    @IsOptional()
    autoAcceptProof: string;

    @IsString({ message: 'protocolVersion must be in string' })
    @IsNotEmpty({ message: 'please provide valid protocol version' })
    @IsOptional()
    protocolVersion: string;
}

export class OutOfBandRequestProof {
    @ApiProperty({
        'example': [
            {
                attributeName: 'attributeName',
                condition: '>=',
                value: 'predicates',
                credDefId: '',
                schemaId: ''
            }
        ]
    })
    @IsArray({ message: 'attributes must be in array' })
    @IsObject({ each: true })
    @IsNotEmpty({ message: 'please provide valid attributes' })
    attributes: IProofRequestAttribute[];

    @ApiProperty({ example: 'string' })
    @IsNotEmpty({ message: 'Please provide valid emailId' })
    @Transform(({ value }) => trim(value))
    @Transform(({ value }) => toLowerCase(value))
    @IsNotEmpty({ message: 'Email is required.' })
    @MaxLength(256, { message: 'Email must be at most 256 character.' })
    @IsEmail()
    emailId: string;
    
    @ApiProperty()
    @IsOptional()
    comment: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: 'please provide orgId' })
    orgId: number;

    @IsString({ message: 'autoAcceptProof must be in string' })
    @IsNotEmpty({ message: 'please provide valid auto accept proof' })
    @IsOptional()
    autoAcceptProof: string;

    @IsString({ message: 'protocol version must be in string' })
    @IsNotEmpty({ message: 'please provide valid protocol version' })
    @IsOptional()
    protocolVersion: string;
}
