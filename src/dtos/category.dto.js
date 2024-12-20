const { IsNotEmpty, IsOptional, IsString, MaxLength } = require('class-validator');

class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description;
}

class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description;
}

module.exports = {
    CreateCategoryDto,
    UpdateCategoryDto
};
