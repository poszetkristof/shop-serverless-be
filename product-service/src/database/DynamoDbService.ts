import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

import { ProductDatabaseService } from "./ProductDatabaseService";
import type { BaseProduct, Product, ProductWithoutId } from "src/types/product";
import type { Stock } from "src/types/stock";
import { randomUUID } from "crypto";

class DynamoDbService implements ProductDatabaseService {
  private docClient: DynamoDBDocumentClient;

  constructor(private dynamoClient = new DynamoDBClient()) {
    this.docClient = DynamoDBDocumentClient.from(this.dynamoClient);
  }

  async find(): Promise<Product[]> {
    const commandProducts = new ScanCommand({ TableName: process.env.PRODUCTS_TABLE });
    const commandStocks = new ScanCommand({ TableName: process.env.STOCKS_TABLE });

    const products = await this.getItems<BaseProduct[]>(commandProducts)
    const stocks = await this.getItems<Stock[]>(commandStocks);

    return this.mapProductsWithStockCounts(products, stocks);
  }

  async findById(id: string): Promise<Product | null> {
    const commandProducts = new QueryCommand({
      TableName: process.env.PRODUCTS_TABLE,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': id }
    });

    const commandStocks = new QueryCommand({
      TableName: process.env.STOCKS_TABLE,
      KeyConditionExpression: 'product_id = :id',
      ExpressionAttributeValues: { ':id': id }
    });

    const product = await this.getItem<BaseProduct>(commandProducts);
    const stock = await this.getItem<Stock>(commandStocks);

    if (!product || !stock) {
      return null;
    }

    return { ...product, count: stock.count };
  }

  async save(product: ProductWithoutId): Promise<Product> {
    const { count, description, price, title } = product;
    const id = randomUUID();
    const baseProduct: BaseProduct = { id, description, price: +price, title };
    const stock: Stock = { product_id: id, count: +product.count };

    const commandProduct = new PutCommand({
      TableName: process.env.PRODUCTS_TABLE,
      Item: baseProduct,
    });

    const commandStock = new PutCommand({
      TableName: process.env.STOCKS_TABLE,
      Item: stock,
    });

    await this.docClient.send(commandProduct);
    await this.docClient.send(commandStock);

    return { ...baseProduct, count };
  }

  private async getItems<T>(command: ScanCommand): Promise<T> {
    const { Items } = await this.docClient.send(command);
    return (Items ?? []) as T;
  }

  private async getItem<T>(command: QueryCommand): Promise<T | undefined>{
    const items = (await this.docClient.send(command)).Items;
    
    return items?.[0] as T;
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
