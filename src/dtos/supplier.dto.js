const { IsNotEmpty, IsOptional, IsString, IsEmail, MaxLength } = require('class-validator');

class CreateSupplierDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name;

    @IsEmail()
    @IsNotEmpty()
    email;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    phone;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    address;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    notes;
}

class UpdateSupplierDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name;

    @IsOptional()
    @IsEmail()
    email;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    address;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    notes;
}

module.exports = {
    CreateSupplierDto,
    UpdateSupplierDto
};
