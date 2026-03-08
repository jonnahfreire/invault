import { Injectable } from "@nestjs/common";

@Injectable()
export default class GetAllUsersUseCase {
  constructor(private readonly repository: any) {}

  async execute(): Promise<any[]> {
    return new Promise(() => []);
  }
}
