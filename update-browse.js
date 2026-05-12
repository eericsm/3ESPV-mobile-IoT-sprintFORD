const fs = require('fs');

const data = fs.readFileSync('app/browse.tsx', 'utf8');

let result = data.replace(
  /type SortOptions = "Nenhum" \| "Menor Preço" \| "Maior Preço" \| "Maior Potência" \| "Maior Velocidade";/g,
  `type SortOptions = "Nenhum" | "Menor Preço" | "Maior Preço" | "Maior Potência" | "Maior Velocidade" | "Melhor Aceleração" | "Melhor Avaliação";`
);

result = result.replace(
  /const sortOptions: SortOptions\[\] = \["Nenhum", "Menor Preço", "Maior Preço", "Maior Potência", "Maior Velocidade"\];/g,
  `const sortOptions: SortOptions[] = ["Nenhum", "Menor Preço", "Maior Preço", "Maior Potência", "Maior Velocidade", "Melhor Aceleração", "Melhor Avaliação"];`
);

result = result.replace(
  /\} else if \(sortBy === "Maior Velocidade"\) \{\n      result\.sort\(\(a, b\) => b\.performance\.topSpeedKmh - a\.performance\.topSpeedKmh\);\n    \}/g,
  `} else if (sortBy === "Maior Velocidade") {
      result.sort((a, b) => b.performance.topSpeedKmh - a.performance.topSpeedKmh);
    } else if (sortBy === "Melhor Aceleração") {
      result.sort((a, b) => a.performance.zeroToHundredS - b.performance.zeroToHundredS);
    } else if (sortBy === "Melhor Avaliação") {
      result.sort((a, b) => b.rating - a.rating);
    }`
);

fs.writeFileSync('app/browse.tsx', result, 'utf8');
