import { AbstractApiService } from "./abstract-api-service";

class ExamplesApi extends AbstractApiService {
  constructor() {
    super("/examples");
  }

  greetings = (name: string) => this.GET<{ message: string }>("/", { name });
}

export const examplesApi = new ExamplesApi();
