const fs = require('fs');

const data = fs.readFileSync('app/browse.tsx', 'utf8');

const result = data.replace(
  /renderItem=\{.*?<TouchableOpacity\n                    style=\{\[\n                      styles\.pillButton,\n                      sortBy === item && styles\.pillButtonActive,\n                    \]\}\n                    onPress=\{\(\) => setSortBy\(item as SortOptions\)\}\n                  >\n                    <Text\n                      style=\{\[\n                        styles\.pillText,\n                        sortBy === item && styles\.pillTextActive,\n                      \]\}\n                    >\n                      \{item\}\n                    <\/Text>\n                  <\/TouchableOpacity>\n                \)\}/g,
  `renderItem={({ item }) => {
                  const isActive = item === "Nenhum" ? sortBys.length === 0 : sortBys.includes(item as SortOptions);
                  return (
                    <TouchableOpacity
                      style={[
                        styles.pillButton,
                        isActive && styles.pillButtonActive,
                      ]}
                      onPress={() => toggleSortBy(item as SortOptions)}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          isActive && styles.pillTextActive,
                        ]}
                      >
                        {item} {isActive && item !== "Nenhum" ? \`(\${sortBys.indexOf(item as SortOptions) + 1})\` : ""}
                      </Text>
                    </TouchableOpacity>
                  );
                }}`
);

fs.writeFileSync('app/browse.tsx', result, 'utf8');
