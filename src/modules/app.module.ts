import { Module } from "@nestjs/common";
import { CoreModule } from "./@core/intex";
import { HTTP_PROVIDERS } from "./@core/providers";

@Module({
  imports: [CoreModule],
  controllers: [...HTTP_PROVIDERS.CONTROLLERS],
})
export class AppModule {}
