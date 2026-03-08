import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { InvaultAppModule } from "./invault.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }), InvaultAppModule],
})
export class AppModule {}
