import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

import { ProductDatabaseService } from "./ProductDatabaseService";
import type { BaseProduct, Product, ProductWithoutId } from "src/types/product";
import type { Stock } from "src/types/stock";

class DynamoDbService implements ProductDatabaseService {
  private docClient: DynamoDBDocumentClient;

  constructor(private dynamoClient = new DynamoDBClient()) {
    this.docClient = DynamoDBDocumentClient.from(this.dynamoClient);
  }

  async find(): Promise<Product[]> {
    const commandProducts = new ScanCommand({ TableName: process.env.PRODUCTS_TABLE });
    const commandStocks = new ScanCommand({ TableName: process.env.STOCKS_TABLE });

    const products = await this.getProducts(commandProducts);
    const stocks = await this.getStocks(commandStocks);

    return this.mapProductsWithStockCounts(products, stocks);
  }

  findById(_id: string): Promise<Product> {
    throw Error('not implemented');
  }

  save(_product: ProductWithoutId): Promise<Product> {
    throw Error('not implemented');
  }

  private async getProducts(command: ScanCommand): Promise<BaseProduct[]> {
    return this.getItems<BaseProduct[]>(command);
  }

  private async getStocks(command: ScanCommand): Promise<Stock[]> {
    return this.getItems<Stock[]>(command);
  }

  private async getItems<T>(command: ScanCommand): Promise<T> {
    const { Items } = await this.docClient.send(command);
    return Items as T;
  }

  private mapProductsWithStockCounts(products: BaseProduct[], stocks: Stock[]): Product[] {
    return products.map((product) => ({
        ...product,
        count: this.getStockCount(product, stocks),
    }));
  }

  private getStockCount(product: BaseProduct, stocks: Stock[]): number {
    return stocks.find(({ product_id }) => product.id === product_id)?.count ?? 0;
  }
}

export default new DynamoDbService();
