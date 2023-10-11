import { Client, LatLng, TravelMode } from '@googlemaps/google-maps-services-js';
import db from '../../config/mongo.js';

const client = new Client({});
/**
 * Geocoding is the process of converting human readable addresses (like "1600 Amphitheatre Parkway, Mountain View, CA") into geographic coordinates (like latitude 37.423021 and longitude -122.083739), which you can use to place markers on a map, or position the map.
 */
export async function geoCode(address: string = 'jamtara'): Promise<[string | null, string | null]> {
  try {
    const gcResponse = await client.geocode({
      params: { key: process.env.GOOGLE_MAPS_API_KEY!, address },
    });
    return [null, JSON.stringify(gcResponse.data.results[0])];
  } catch (error: any) {
    console.log(error);
    return [error.message, null];
  }
}

/** The term geocoding generally refers to translating a human-readable address into a location on a map. The process of doing the opposite, translating a location on the map into a human-readable address, is known as reverse geocoding. */
export async function revGeoCode(latlng: LatLng = [23.957, 86.817252]): Promise<[string | null, string | null]> {
  try {
    const rgcResponse = await client.reverseGeocode({
      params: { key: process.env.GOOGLE_MAPS_API_KEY!, latlng },
    });
    return [null, JSON.stringify(rgcResponse.data.results[0])];
  } catch (error: any) {
    console.log(error);
    return [error.message, null];
  }
}

export async function getDirection(origin: any = 'jamtara', destination: any = 'dhanbad', isPlaceIds = false): Promise<[string | null, string | null]> {
  try {
    const directions = await client.directions({
      params: {
        key: process.env.GOOGLE_MAPS_API_KEY!,
        origin: isPlaceIds ? `place_id:${origin}` : origin,
        destination: isPlaceIds ? `place_id:${destination}` : destination,
        mode: TravelMode.driving,
      },
    });

    // TODO: replace store from mongo to postgres
    await db.collection('maps').insertOne(directions.data);

    return [null, JSON.stringify(directions.data)];
  } catch (error: any) {
    console.log(error);
    return [error.message, null];
  }
}
