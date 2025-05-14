import { createCanvas, CanvasRenderingContext2D } from 'canvas';
import fs from 'fs';
import path from 'path';
import * as GeoJSON from 'geojson';
import env from '~/env';
import { getLogger } from '~/index';
import type { JMAQuake } from '~/types';
import translate from '~/translate';
import { Language } from '~/types/translate';
import { prefectureMap } from '~/parsers/area';

// Map longitude and latitude to pixel coordinates
function mapCoordinates(
  lon: number,
  lat: number,
  width: number,
  height: number,
  bounds?: { minLon: number; maxLon: number; minLat: number; maxLat: number },
): [number, number] {
  // Define the map bounds (Japan)
  const minLon = bounds?.minLon ?? 122.0;
  const maxLon = bounds?.maxLon ?? 146.0;
  const minLat = bounds?.minLat ?? 24.0;
  const maxLat = bounds?.maxLat ?? 46.0;

  // Add padding to ensure the map is fully visible
  const paddingPercent = 0.05;
  const paddingX = width * paddingPercent;
  const paddingY = height * paddingPercent;

  // Map to canvas coordinates with padding
  const effectiveWidth = width - paddingX * 2;
  const effectiveHeight = height - paddingY * 2;

  // Calculate position with padding
  const x = paddingX + ((lon - minLon) / (maxLon - minLon)) * effectiveWidth;
  const y =
    height - paddingY - ((lat - minLat) / (maxLat - minLat)) * effectiveHeight;

  return [x, y];
}

// Get color for the intensity scale
function getIntensityColor(scale: number | undefined): string {
  if (scale === undefined) return env.MAP_INTENSITY_SCALE_1_COLOR;

  switch (scale) {
    case 10:
      return env.MAP_INTENSITY_SCALE_1_COLOR;
    case 20:
      return env.MAP_INTENSITY_SCALE_2_COLOR;
    case 30:
      return env.MAP_INTENSITY_SCALE_3_COLOR;
    case 40:
      return env.MAP_INTENSITY_SCALE_4_COLOR;
    case 45:
      return env.MAP_INTENSITY_SCALE_5_LOWER_COLOR;
    case 50:
      return env.MAP_INTENSITY_SCALE_5_UPPER_COLOR;
    case 55:
      return env.MAP_INTENSITY_SCALE_6_LOWER_COLOR;
    case 60:
      return env.MAP_INTENSITY_SCALE_6_UPPER_COLOR;
    case 70:
      return env.MAP_INTENSITY_SCALE_7_COLOR;
    default:
      return env.MAP_INTENSITY_SCALE_1_COLOR;
  }
}

// Draw the map legend
function drawLegend(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const legendX = width - 170;
  const legendY = height - 270;
  const boxSize = 20;
  const textX = legendX + boxSize + 10;
  const scales = [
    { scale: '1', color: env.MAP_INTENSITY_SCALE_1_COLOR },
    { scale: '2', color: env.MAP_INTENSITY_SCALE_2_COLOR },
    { scale: '3', color: env.MAP_INTENSITY_SCALE_3_COLOR },
    { scale: '4', color: env.MAP_INTENSITY_SCALE_4_COLOR },
    { scale: '5-', color: env.MAP_INTENSITY_SCALE_5_LOWER_COLOR },
    { scale: '5+', color: env.MAP_INTENSITY_SCALE_5_UPPER_COLOR },
    { scale: '6-', color: env.MAP_INTENSITY_SCALE_6_LOWER_COLOR },
    { scale: '6+', color: env.MAP_INTENSITY_SCALE_6_UPPER_COLOR },
    { scale: '7', color: env.MAP_INTENSITY_SCALE_7_COLOR },
  ];

  // Draw background for legend
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(legendX - 10, legendY - 10, 170, 270);
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(legendX - 10, legendY - 10, 170, 270);

  // Draw title
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Seismic Intensity', legendX, legendY + 16);

  // Draw scales
  ctx.font = '14px sans-serif';
  scales.forEach((item, index) => {
    const y = legendY + 45 + index * 25;
    // Draw color box
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, y - boxSize + 5, boxSize, boxSize);
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(legendX, y - boxSize + 5, boxSize, boxSize);

    // Draw scale text
    ctx.fillStyle = '#000000';
    ctx.fillText(`Intensity ${item.scale}`, textX, y);
  });
}

// Prefecture coordinates for intensity circles
const PREFECTURE_COORDINATES: Record<string, [number, number]> = {
  北海道: [143.0, 43.0],
  青森県: [140.7, 40.8],
  岩手県: [141.5, 39.7],
  宮城県: [140.9, 38.3],
  秋田県: [140.1, 39.7],
  山形県: [140.0, 38.5],
  福島県: [140.4, 37.7],
  茨城県: [140.5, 36.3],
  栃木県: [139.8, 36.7],
  群馬県: [139.0, 36.4],
  埼玉県: [139.6, 36.0],
  千葉県: [140.1, 35.6],
  東京都: [139.7, 35.7],
  神奈川県: [139.3, 35.4],
  新潟県: [139.0, 37.9],
  富山県: [137.2, 36.7],
  石川県: [136.8, 36.6],
  福井県: [136.2, 36.1],
  山梨県: [138.6, 35.6],
  長野県: [138.0, 36.2],
  岐阜県: [137.1, 35.8],
  静岡県: [138.4, 35.0],
  愛知県: [137.0, 35.2],
  三重県: [136.5, 34.7],
  滋賀県: [136.0, 35.2],
  京都府: [135.8, 35.0],
  大阪府: [135.5, 34.7],
  兵庫県: [135.0, 34.8],
  奈良県: [135.8, 34.4],
  和歌山県: [135.2, 34.0],
  鳥取県: [134.0, 35.5],
  島根県: [133.0, 35.0],
  岡山県: [134.0, 34.7],
  広島県: [132.5, 34.4],
  山口県: [131.5, 34.2],
  徳島県: [134.0, 34.0],
  香川県: [134.0, 34.3],
  愛媛県: [132.8, 33.8],
  高知県: [133.5, 33.5],
  福岡県: [130.4, 33.6],
  佐賀県: [130.1, 33.3],
  長崎県: [129.8, 32.7],
  熊本県: [130.7, 32.8],
  大分県: [131.6, 33.2],
  宮崎県: [131.4, 32.2],
  鹿児島県: [130.5, 31.5],
  沖縄県: [127.7, 26.5],
};

// Get Japan GeoJSON map data
async function getJapanGeoJSON(): Promise<GeoJSON.FeatureCollection> {
  try {
    // Path to the map data file (downloaded file)
    const geoJSONPath = path.join(process.cwd(), 'assets', 'japan.geojson');

    // If the file exists, read it
    if (fs.existsSync(geoJSONPath)) {
      const data = fs.readFileSync(geoJSONPath, 'utf8');
      return JSON.parse(data) as GeoJSON.FeatureCollection;
    }

    // If the file does not exist, log an error
    const logger = await getLogger();
    logger.error(`Japan GeoJSON file not found at ${geoJSONPath}`);

    // Return minimal data on error
    return {
      type: 'FeatureCollection',
      features: [],
    };
  } catch (error) {
    const logger = await getLogger();
    logger.error('Error loading Japan GeoJSON:', error);

    // Return minimal data on error
    return {
      type: 'FeatureCollection',
      features: [],
    };
  }
}

// Assign color to prefecture
function getPrefectureColor(
  prefCode: string | number | undefined,
  intensity?: number,
): string {
  // If intensity information is available, prioritize intensity color
  if (intensity !== undefined) {
    return getIntensityColor(intensity);
  }

  // If prefecture code is not available or not epicenter, return default color
  return env.MAP_JAPAN_COLOR;
}

// Draw polygon helper function
function drawPolygon(
  ctx: CanvasRenderingContext2D,
  coordinates: number[][][],
  width: number,
  height: number,
  properties?: any,
  intensity?: number,
  bounds?: { minLon: number; maxLon: number; minLat: number; maxLat: number },
): void {
  for (const ring of coordinates) {
    if (ring && ring.length > 0) {
      ctx.beginPath();

      // Start from the first point
      const [lon, lat] = ring[0];
      const [x, y] = mapCoordinates(lon, lat, width, height, bounds);
      ctx.moveTo(x, y);

      // Draw remaining points
      for (let i = 1; i < ring.length; i++) {
        const [lon, lat] = ring[i];
        const [x, y] = mapCoordinates(lon, lat, width, height, bounds);
        ctx.lineTo(x, y);
      }

      ctx.closePath();

      // Get prefecture code
      const prefCode =
        properties?.code || properties?.prefCode || properties?.id;

      // Assign color to prefecture
      ctx.fillStyle = getPrefectureColor(prefCode, intensity);
      ctx.fill();
      ctx.strokeStyle = '#404040';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
}

// Calculate map bounds based on earthquake points and epicenter
function calculateMapBounds(earthquake: JMAQuake): {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
} {
  // Default bounds for Japan
  let minLon = 122.0;
  let maxLon = 146.0;
  let minLat = 24.0;
  let maxLat = 46.0;

  // Points to track
  const coordinates: Array<[number, number]> = [];

  // Add epicenter if available
  if (
    earthquake.earthquake.hypocenter?.longitude !== undefined &&
    earthquake.earthquake.hypocenter?.latitude !== undefined
  ) {
    coordinates.push([
      earthquake.earthquake.hypocenter.longitude,
      earthquake.earthquake.hypocenter.latitude,
    ]);
  }

  // Add points from prefecture data
  earthquake.points.forEach((point) => {
    const pref = point.pref;
    const prefCoords = PREFECTURE_COORDINATES[pref];
    if (prefCoords) {
      coordinates.push(prefCoords);
    }
  });

  // No coordinates found, use default bounds
  if (coordinates.length === 0) {
    return { minLon, maxLon, minLat, maxLat };
  }

  // Find min/max coordinate values
  minLon = Math.min(...coordinates.map((c) => c[0]));
  maxLon = Math.max(...coordinates.map((c) => c[0]));
  minLat = Math.min(...coordinates.map((c) => c[1]));
  maxLat = Math.max(...coordinates.map((c) => c[1]));

  // Add padding to the bounds
  const lonPadding = (maxLon - minLon) * 0.2;
  const latPadding = (maxLat - minLat) * 0.2;

  minLon = Math.max(122.0, minLon - lonPadding);
  maxLon = Math.min(146.0, maxLon + lonPadding);
  minLat = Math.max(24.0, minLat - latPadding);
  maxLat = Math.min(46.0, maxLat + latPadding);

  // Ensure minimum area size for very close points
  if (maxLon - minLon < 5) {
    const midLon = (maxLon + minLon) / 2;
    minLon = midLon - 2.5;
    maxLon = midLon + 2.5;
  }

  if (maxLat - minLat < 5) {
    const midLat = (maxLat + minLat) / 2;
    minLat = midLat - 2.5;
    maxLat = midLat + 2.5;
  }

  return { minLon, maxLon, minLat, maxLat };
}

// Draw Japan map using GeoJSON
async function drawGeoJSONMap(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  earthquake?: JMAQuake,
  bounds?: { minLon: number; maxLon: number; minLat: number; maxLat: number },
): Promise<void> {
  try {
    // Get Japan GeoJSON data
    const japanGeoJSON = await getJapanGeoJSON();

    // Draw background
    ctx.fillStyle = '#e6f2ff'; // Light blue background
    ctx.fillRect(0, 0, width, height);

    // Identify the epicenter prefecture
    let epicenterPrefCode = 0;

    if (earthquake?.earthquake.hypocenter) {
      const { longitude, latitude } = earthquake.earthquake.hypocenter;
      if (longitude !== undefined && latitude !== undefined) {
        // Find the closest prefecture from the epicenter coordinates
        let closestPref = '';
        let minDistance = Number.MAX_VALUE;

        Object.entries(PREFECTURE_COORDINATES).forEach(
          ([prefName, [prefLon, prefLat]]) => {
            const distance = Math.sqrt(
              Math.pow(longitude - prefLon, 2) +
                Math.pow(latitude - prefLat, 2),
            );

            if (distance < minDistance) {
              minDistance = distance;
              closestPref = prefName;
            }
          },
        );

        // Convert prefecture name to prefecture code
        Object.keys(PREFECTURE_COORDINATES).forEach((name, index) => {
          if (name === closestPref) {
            epicenterPrefCode = index + 1;
          }
        });
      }
    }

    // Get intensity
    const maxScale = earthquake?.earthquake.maxScale;

    // Draw each feature of GeoJSON
    if (japanGeoJSON.features.length > 0) {
      // Draw each prefecture
      for (const feature of japanGeoJSON.features) {
        // Prefecture code or ID
        const properties = feature.properties || {};
        const prefCode = properties.code || properties.id;

        // If the prefecture is the epicenter, use intensity color, otherwise use default color
        const isEpicenterPref = prefCode === epicenterPrefCode;
        const intensity = isEpicenterPref ? maxScale : undefined;

        if (feature.geometry.type === 'Polygon') {
          drawPolygon(
            ctx,
            feature.geometry.coordinates,
            width,
            height,
            properties,
            intensity,
            bounds,
          );
        } else if (feature.geometry.type === 'MultiPolygon') {
          for (const polygon of feature.geometry.coordinates) {
            drawPolygon(
              ctx,
              polygon,
              width,
              height,
              properties,
              intensity,
              bounds,
            );
          }
        }
      }

      // Display source
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.fillText(
        env.MAP_ATTRIBUTION_TEXT || 'Map data: GeoJSON',
        15,
        height - 15,
      );
    } else {
      // If Japan cannot be drawn, fallback
      // Draw simple outline of Japan
      ctx.fillStyle = env.MAP_JAPAN_COLOR;
      ctx.fillRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 1;
      ctx.strokeRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);

      // Output fallback message to log
      const logger = await getLogger();
      logger.warn('Using fallback Japan outline - GeoJSON data not available');
    }
  } catch (error) {
    const logger = await getLogger();
    logger.error('Error drawing GeoJSON map:', error);

    // Fallback to draw simple map
    ctx.fillStyle = env.MAP_JAPAN_COLOR;
    ctx.fillRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    ctx.strokeRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
  }
}

export async function generateEarthquakeMap(
  earthquake: JMAQuake,
): Promise<Buffer | null> {
  try {
    if (!env.ENABLE_MAP_GENERATION) {
      return null;
    }

    const logger = await getLogger();

    // Create canvas
    const canvas = createCanvas(env.MAP_WIDTH, env.MAP_HEIGHT);
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = env.MAP_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, env.MAP_WIDTH, env.MAP_HEIGHT);

    // Calculate map bounds based on earthquake points
    const mapBounds = calculateMapBounds(earthquake);

    // Draw Japan map using GeoJSON (pass earthquake information)
    await drawGeoJSONMap(
      ctx,
      env.MAP_WIDTH,
      env.MAP_HEIGHT,
      earthquake,
      mapBounds,
    );

    // Draw epicenter if available
    if (earthquake.earthquake.hypocenter) {
      const { longitude, latitude } = earthquake.earthquake.hypocenter;
      if (longitude !== undefined && latitude !== undefined) {
        const [x, y] = mapCoordinates(
          longitude,
          latitude,
          env.MAP_WIDTH,
          env.MAP_HEIGHT,
          mapBounds,
        );

        // Draw epicenter text
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('Epicenter', x, y);

        // Draw magnitude if available
        if (earthquake.earthquake.hypocenter.magnitude !== undefined) {
          ctx.fillText(
            `M${formatNumericValue(earthquake.earthquake.hypocenter.magnitude.toFixed(1))}`,
            x,
            y + 20,
          );
        }
      }
    }

    // Draw points for each affected area
    earthquake.points.forEach((point) => {
      const pref = point.pref;
      const prefCoords = PREFECTURE_COORDINATES[pref];

      if (prefCoords) {
        const [prefLon, prefLat] = prefCoords;

        const [x, y] = mapCoordinates(
          prefLon,
          prefLat,
          env.MAP_WIDTH,
          env.MAP_HEIGHT,
          mapBounds,
        );
        ctx.fillStyle = '#000000';
        ctx.font = '12px sans-serif';

        // Get the Prefecture enum key for the current Japanese prefecture name
        const prefEnum = prefectureMap[pref];

        // Use translation if found, otherwise use original name
        const displayName = prefEnum
          ? translate('prefecture', prefEnum, Language.EN)
          : pref;

        ctx.fillText(displayName, x, y);
      }
    });

    // Draw legend
    drawLegend(ctx, env.MAP_WIDTH, env.MAP_HEIGHT);

    // Draw title and timestamp
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Earthquake Information', 20, 30);

    ctx.font = '16px sans-serif';
    // Format the time in English format
    const timeDate = new Date(earthquake.earthquake.time);
    const formattedTime = timeDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    ctx.fillText(`Time: ${formattedTime}`, 20, 60);

    if (earthquake.earthquake.maxScale !== undefined) {
      ctx.fillText(
        `Max Intensity: ${parseScale(earthquake.earthquake.maxScale)}`,
        20,
        85,
      );
    }

    // Generate the PNG buffer
    const buffer = canvas.toBuffer('image/png');
    logger.info('Generated earthquake map buffer');

    return buffer;
  } catch (error) {
    const logger = await getLogger();
    logger.error('Error generating earthquake map:', error);
    return null;
  }
}

// Helper function to convert JMA scale number to text
function parseScale(scale: number): string {
  switch (scale) {
    case 10:
      return '1';
    case 20:
      return '2';
    case 30:
      return '3';
    case 40:
      return '4';
    case 45:
      return '5-';
    case 50:
      return '5+';
    case 55:
      return '6-';
    case 60:
      return '6+';
    case 70:
      return '7';
    default:
      return 'Unknown';
  }
}

// Helper function to ensure numeric values are in English format
function formatNumericValue(value: string | number | undefined): string {
  if (value === undefined) return 'Unknown';

  // Convert to string if it's a number
  const strValue = typeof value === 'number' ? value.toString() : value;

  // Replace Japanese numerals and characters with English
  return strValue
    .replace(/０/g, '0')
    .replace(/１/g, '1')
    .replace(/２/g, '2')
    .replace(/３/g, '3')
    .replace(/４/g, '4')
    .replace(/５/g, '5')
    .replace(/６/g, '6')
    .replace(/７/g, '7')
    .replace(/８/g, '8')
    .replace(/９/g, '9')
    .replace(/．/g, '.')
    .replace(/約/g, 'approx. ')
    .replace(/km/g, 'km')
    .replace(/深さ/g, 'Depth: ');
}
