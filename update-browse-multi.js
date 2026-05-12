const fs = require('fs');

const data = fs.readFileSync('app/browse.tsx', 'utf8');

let result = data.replace(
  /const \[sortBy, setSortBy\] = useState<SortOptions>\("Nenhum"\);/g,
  `const [sortBys, setSortBys] = useState<SortOptions[]>([]);`
);

result = result.replace(
  /const sortOptions: SortOptions\[\] = \["Nenhum", "Menor Preço", "Maior Preço", "Maior Potência", "Maior Velocidade", "Melhor Aceleração", "Melhor Avaliação"\];\n\n  const filteredVehicles = useMemo\(\(\) => \{/g,
  `const sortOptions: SortOptions[] = ["Nenhum", "Menor Preço", "Maior Preço", "Maior Potência", "Maior Velocidade", "Melhor Aceleração", "Melhor Avaliação"];

  const toggleSortBy = (option: SortOptions) => {
    if (option === "Nenhum") {
      setSortBys([]);
      return;
    }
    
    setSortBys((prev) => {
      let next = [...prev];
      if (option === "Menor Preço") next = next.filter(o => o !== "Maior Preço");
      if (option === "Maior Preço") next = next.filter(o => o !== "Menor Preço");

      if (next.includes(option)) {
        return next.filter((o) => o !== option);
      } else {
        return [...next, option];
      }
    });
  };

  const filteredVehicles = useMemo(() => {`
);

result = result.replace(
  /if \(sortBy === "Menor Preço"\) \{\n      result\.sort\(\(a, b\) => a\.priceBrl - b\.priceBrl\);\n    \} else if \(sortBy === "Maior Preço"\) \{\n      result\.sort\(\(a, b\) => b\.priceBrl - a\.priceBrl\);\n    \} else if \(sortBy === "Maior Potência"\) \{\n      result\.sort\(\(a, b\) => b\.engine\.horsepowerCv - a\.engine\.horsepowerCv\);\n    \} else if \(sortBy === "Maior Velocidade"\) \{\n      result\.sort\(\(a, b\) => b\.performance\.topSpeedKmh - a\.performance\.topSpeedKmh\);\n    \} else if \(sortBy === "Melhor Aceleração"\) \{\n      result\.sort\(\(a, b\) => a\.performance\.zeroToHundredS - b\.performance\.zeroToHundredS\);\n    \} else if \(sortBy === "Melhor Avaliação"\) \{\n      result\.sort\(\(a, b\) => b\.rating - a\.rating\);\n    \}/g,
  `if (sortBys.length > 0) {
      result.sort((a, b) => {
        for (const sortOption of sortBys) {
          let diff = 0;
          if (sortOption === "Menor Preço") diff = a.priceBrl - b.priceBrl;
          else if (sortOption === "Maior Preço") diff = b.priceBrl - a.priceBrl;
          else if (sortOption === "Maior Potência") diff = b.engine.horsepowerCv - a.engine.horsepowerCv;
          else if (sortOption === "Maior Velocidade") diff = b.performance.topSpeedKmh - a.performance.topSpeedKmh;
          else if (sortOption === "Melhor Aceleração") diff = a.performance.zeroToHundredS - b.performance.zeroToHundredS;
          else if (sortOption === "Melhor Avaliação") diff = b.rating - a.rating;

          if (diff !== 0) return diff;
        }
        return 0;
      });
    }`
);

result = result.replace(
  /sortBy\]\);/g,
  `sortBys]);`
);


result = result.replace(
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
