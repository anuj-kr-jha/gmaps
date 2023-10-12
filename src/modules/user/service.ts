import type { UpdateResult, WithId } from 'mongodb';
import { IUser } from './model.js';
import db from '../../config/mongo.js';
import helper from '../../common/utils/helper.js';

export async function createUser(user: Omit<IUser, 'userId'>): Promise<[string | null, WithId<IUser> | null]> {
  try {
    const payload = { userId: helper.uuid(), ...user };
    const res = await db.collection<IUser>('users').insertOne(payload);
    if (res.insertedId) return [null, { _id: res.insertedId, ...payload }];
    return ['failed to create user', null];
  } catch (err: any) {
    return [err.message, null];
  }
}

export async function getAllUser(): Promise<[string | null, WithId<IUser>[] | null]> {
  try {
    const res = await db.collection<IUser>('users').find().toArray();
    return [null, res];
  } catch (err: any) {
    return [err.message, null];
  }
}

export async function getUser(filter: Partial<Record<keyof IUser, any>>): Promise<[string | null, WithId<IUser> | null]> {
  try {
    const res = await db.collection<IUser>('users').findOne(filter);
    return [null, res];
  } catch (err: any) {
    return [err.message, null];
  }
}

export async function updateUser(userId: string, user: Partial<IUser>): Promise<[string | null, UpdateResult<IUser> | null]> {
  try {
    const res = await db.collection<IUser>('users').updateOne({ userId }, { $set: user });
    return [null, res];
  } catch (err: any) {
    return [err.message, null];
  }
}
