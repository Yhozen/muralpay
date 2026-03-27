
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;
}

export class CreateUserResponse {
    @IsUUID()
    id: string
    @IsEmail()
    email: string
    @IsNotEmpty()
    apiKey: string
}
