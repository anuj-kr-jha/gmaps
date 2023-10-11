/* eslint-disable @typescript-eslint/ban-types */
import type { Socket } from 'socket.io';
import { geoCode, revGeoCode, getDirection as getDirections } from '../common/utils/maps.js';

type UserSocket = { socket: Socket; user?: { userId: string; email: string } };
type ICallBack = (...args: any[]) => {};

interface ILocation {
  lat: number;
  lng: number;
}
interface IGetPlaceIdParam {
  pickup: ILocation;
  destination: ILocation;
}

function isValidLocation(location: ILocation): boolean {
  const { lat, lng } = location;

  if (typeof lat === 'number' && typeof lng === 'number') {
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return true;
    }
  }

  return false;
}

export async function getPlaceId(this: UserSocket, payload: IGetPlaceIdParam, ack: ICallBack) {
  console.log('[getPlaceId] payload: ', payload);
  const { pickup, destination } = payload;
  if (!isValidLocation(pickup)) return ack({ status: false, message: 'Invalid pickup location', payload: {} });
  if (!isValidLocation(destination)) return ack({ status: false, message: 'Invalid destination location', payload: {} });

  const [e1, pickupData] = await revGeoCode([pickup.lat, pickup.lng]);
  const [e2, destinationData] = await revGeoCode([destination.lat, destination.lng]);
  if (e1 || e2 || !pickupData || !destinationData) {
    console.log('[getPlaceId] error: ', 'e1: ', e1, '\n\n', 'e2: ', e2);
    return ack({ status: false, message: 'Something went wrong', payload: {} });
  }
  ack({ status: true, message: 'success', payload: { pickup: JSON.parse(pickupData).place_id, destination: JSON.parse(destinationData).place_id } });
}

interface IGetDirectionParam {
  pickup: string;
  destination: string;
}

export async function getDirection(this: UserSocket, payload: IGetDirectionParam, ack: ICallBack) {
  console.log('[getDirection] payload: ', payload);
  const { pickup, destination } = payload;
  if (!pickup || !destination) return ack({ status: false, message: 'Invalid pickup or destination location', payload: {} });
  const [err, directionData] = await getDirections(pickup, destination, true);
  if (err || !directionData) {
    console.log('[getDirection] error: ', err);
    return ack({ status: false, message: 'Something went wrong', payload: {} });
  }
  return ack({ status: true, message: 'success', payload: { direction: JSON.parse(directionData) } });
}

export async function getGeoCode(this: UserSocket, payload: string, ack: ICallBack) {
  console.log('[getGeoCode] payload: ', payload);
  if (!payload) return ack({ status: false, message: 'Invalid payload', payload: {} });
  const [err, geoCodeData] = await geoCode(payload);
  if (err || !geoCodeData) {
    console.log('[getGeoCode] error: ', err);
    return ack({ status: false, message: 'Something went wrong', payload: {} });
  }
  return ack({ status: true, message: 'success', payload: { direction: JSON.parse(geoCodeData) } });
}
