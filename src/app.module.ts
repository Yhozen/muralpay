import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { loadConfiguration } from "./config/configuration";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [loadConfiguration],
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
