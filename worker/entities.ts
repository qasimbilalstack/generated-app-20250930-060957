import { IndexedEntity } from "./core-utils";
import type { Stall } from "@shared/types";
import { MOCK_STALLS } from "@shared/mock-data";
export class StallEntity extends IndexedEntity<Stall> {
  static readonly entityName = "stall";
  static readonly indexName = "stalls";
  static readonly initialState: Stall = {
    id: "",
    name: "",
    cuisine: "",
    category: "",
    description: "",
    imageUrl: "",
    rating: { average: 0, count: 0 },
    menu: []
  };
  static seedData = MOCK_STALLS;
}