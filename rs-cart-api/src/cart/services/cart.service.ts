import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

import { Cart, CartQueryResult } from '../models';

@Injectable()
export class CartService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
  }

  async findByUserId(userId: string): Promise<Cart> {
    const client = await this.pool.connect();
    try {
      const res = await client.query<CartQueryResult>(`
        SELECT carts.*, cart_items.product_id, cart_items.count 
        FROM carts 
        LEFT JOIN cart_items ON carts.id = cart_items.cart_id 
        WHERE carts.user_id = $1
      `, [userId]);

      return res.rows.reduce((prev: Cart, { count, created_at, id, product_id, status, updated_at, user_id }) => {
        return !prev ? {
          id,
          created_at,
          updated_at,
          status,
          user_id,
          items: [{ product_id, count }]
        } : {
          ...prev,
          items: [...prev.items, { product_id, count }]
        };
      }, null);
    } catch (err) {
      console.log(`Error fetching carts with userId ${userId}`, err);
    } finally {
      client.release();
    }
  }

  async updateByUserId(userId: string, { status }: Cart): Promise<Cart> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const res = await client.query(`
        UPDATE carts 
        SET status = $1, updated_at = CURRENT_DATE 
        WHERE user_id = $2 
        RETURNING *
      `, [status, userId]);
      await client.query('COMMIT');
      return res.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      console.log(`Error updating cart for userId ${userId}`, err);
    } finally {
      client.release();
    }
  }

  async removeByUserId(userId: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const cartRes = await client.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      if (cartRes.rows.length > 0) {
        const cartId = cartRes.rows[0].id;
        await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
        await client.query('DELETE FROM carts WHERE id = $1', [cartId]);
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.log(`Error deleting cart for userId ${userId}`, err);
    } finally {
      client.release();
    }
  }
}
