const fs = require('fs');

const data = fs.readFileSync('app/compare.tsx', 'utf8');

let result = data.replace(
  /const prices = vehicles\.map\(\(v\) => v\.priceBrl\);\n  const bestPrice = Math\.min\(\.\.\.prices\);\n  const worstPrice = Math\.max\(\.\.\.prices\);\n\n  const ratings = vehicles\.map\(\(v\) => v\.rating\);\n  const bestRating = Math\.max\(\.\.\.ratings\);\n  const worstRating = Math\.min\(\.\.\.ratings\);\n\n  \/\/ Helper function to figure out the color to return\n  const getStyleForMetric = \(val: number, best: number, worst: number\) => {/g,
  `const prices = vehicles.map((v) => v.priceBrl);
  const bestPrice = Math.min(...prices);
  const worstPrice = Math.max(...prices);

  const ratings = vehicles.map((v) => v.rating);
  const bestRating = Math.max(...ratings);
  const worstRating = Math.min(...ratings);

  const cityMetrics = vehicles.map(v => v.consumption.cityKmL).filter((v): v is number => v !== undefined);
  const bestCity = cityMetrics.length > 0 ? Math.max(...cityMetrics) : 0;
  const worstCity = cityMetrics.length > 0 ? Math.min(...cityMetrics) : 0;

  const hwyMetrics = vehicles.map(v => v.consumption.highwayKmL).filter((v): v is number => v !== undefined);
  const bestHwy = hwyMetrics.length > 0 ? Math.max(...hwyMetrics) : 0;
  const worstHwy = hwyMetrics.length > 0 ? Math.min(...hwyMetrics) : 0;

  const rangeMetrics = vehicles.map(v => v.consumption.rangeKm).filter((v): v is number => v !== undefined);
  const bestRange = rangeMetrics.length > 0 ? Math.max(...rangeMetrics) : 0;
  const worstRange = rangeMetrics.length > 0 ? Math.min(...rangeMetrics) : 0;

  // Helper function to figure out the color to return
  const getStyleForMetric = (val: number | undefined, best: number, worst: number) => {
    if (val === undefined) return styles.value;`
);

result = result.replace(
  /\{\(vehicle\.consumption\.cityKmL \|\| vehicle\.consumption\.highwayKmL\) \? \(\n                  <View style=\{styles\.section\}>\n                    <Text style=\{styles\.label\}>Consumo<\/Text>\n                    <Text style=\{styles\.value\}>\n                      \{vehicle\.consumption\.cityKmL \? \`\$\{vehicle\.consumption\.cityKmL\} km\/l \(C\)\` : ''\}\n                      \{vehicle\.consumption\.cityKmL && vehicle\.consumption\.highwayKmL \? ' • ' : ''\}\n                      \{vehicle\.consumption\.highwayKmL \? \`\$\{vehicle\.consumption\.highwayKmL\} km\/l \(E\)\` : ''\}\n                    <\/Text>\n                  <\/View>\n                \) : null\}\n\n                \{vehicle\.consumption\.rangeKm \? \(\n                  <View style=\{styles\.section\}>\n                    <Text style=\{styles\.label\}>Autonomia<\/Text>\n                    <Text style=\{styles\.value\}>\{vehicle\.consumption\.rangeKm\} km<\/Text>\n                  <\/View>\n                \) : null\}/g,
  `{(vehicle.consumption.cityKmL || vehicle.consumption.highwayKmL) ? (
                  <View style={styles.section}>
                    <Text style={styles.label}>Consumo</Text>
                    <Text style={styles.value}>
                      {vehicle.consumption.cityKmL ? (
                        <Text style={getStyleForMetric(vehicle.consumption.cityKmL, bestCity, worstCity)}>
                          {vehicle.consumption.cityKmL} km/l (C)
                        </Text>
                      ) : null}
                      {vehicle.consumption.cityKmL && vehicle.consumption.highwayKmL ? ' • ' : ''}
                      {vehicle.consumption.highwayKmL ? (
                        <Text style={getStyleForMetric(vehicle.consumption.highwayKmL, bestHwy, worstHwy)}>
                          {vehicle.consumption.highwayKmL} km/l (E)
                        </Text>
                      ) : null}
                    </Text>
                  </View>
                ) : null}

                {vehicle.consumption.rangeKm ? (
                  <View style={styles.section}>
                    <Text style={styles.label}>Autonomia</Text>
                    <Text style={[styles.value, getStyleForMetric(vehicle.consumption.rangeKm, bestRange, worstRange)]}>
                      {vehicle.consumption.rangeKm} km
                    </Text>
                  </View>
                ) : null}`
);

fs.writeFileSync('app/compare.tsx', result, 'utf8');
