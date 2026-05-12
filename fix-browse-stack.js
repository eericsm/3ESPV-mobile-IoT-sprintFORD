const fs = require('fs');

const data = fs.readFileSync('app/browse.tsx', 'utf8');

const result = data.replace(
  /<TouchableOpacity\n *style=\{\[\n *styles\.pillButton,\n *sortBy === item && styles\.pillButtonActive,\n *\]\}\n *onPress=\{\(\) => setSortBy\(item as SortOptions\)\}\n *>/gi,
  `<TouchableOpacity
                    style={[
                      styles.pillButton,
                      sortBys.includes(item as SortOptions) && styles.pillButtonActive,
                    ]}
                    onPress={() => toggleSortBy(item as SortOptions)}
                  >`
).replace(
  /<Text\n *style=\{\[\n *styles\.pillText,\n *sortBy === item && styles\.pillTextActive,\n *\]\}\n *>\n *\{item\}\n *<\/Text>/gi,
  `<Text
                      style={[
                        styles.pillText,
                        sortBys.includes(item as SortOptions) && styles.pillTextActive,
                      ]}
                    >
                      {item} {sortBys.includes(item as SortOptions) && item !== "Nenhum" ? \`(\${sortBys.indexOf(item as SortOptions) + 1})\` : ""}
                    </Text>`
);

fs.writeFileSync('app/browse.tsx', result, 'utf8');
