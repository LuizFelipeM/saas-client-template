import { AbstractService } from "./abstract.service";

class ExamplesService extends AbstractService {
  constructor() {
    super("/examples");
  }

  greetings = (name: string) => this.GET<{ message: string }>("/", { name });
}

export const examplesService = new ExamplesService();
