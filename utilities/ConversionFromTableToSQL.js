function parseSQLValue(value, tipoDato) {
    if (tipoDato === "String") {
        if (Array.isArray(value) && typeof value[0] === "object" && value[0]?.value) {
            // Extraer los valores si es un array de objetos con 'value'
            return value.map(item => `'${item.value}'`).join(", ");
        }

        if (Array.isArray(value)) {
            // Si es un array de strings, envolver cada string con comillas simples
            return value.map(item => `'${item}'`).join(", ");
        }

        // Si es un string único, envolverlo con comillas simples
        return `'${value}'`;
    } else if (tipoDato === "Number") {
        return value; // Los números se usan directamente
    }

    return value;
}

export function buildSQLQuery(rules, tableName = "ventas_b2b") {
    const conditions = rules.map(rule => {
        const { Columnas, OperadorValor, DesdeValor, HastaValor, TipoDato } = rule;

        switch (OperadorValor) {
            case "=":
                return `${Columnas} = ${parseSQLValue(DesdeValor, TipoDato)}`;
            case "!=":
                return `${Columnas} != ${parseSQLValue(DesdeValor, TipoDato)}`;
            case "in":
                return `${Columnas} IN (${parseSQLValue(DesdeValor, TipoDato)})`;
            case "notIn":
                return `${Columnas} NOT IN (${parseSQLValue(DesdeValor, TipoDato)})`;
            case "<":
                return `${Columnas} < ${parseSQLValue(DesdeValor, TipoDato)}`;
            case "<=":
                return `${Columnas} <= ${parseSQLValue(DesdeValor, TipoDato)}`;
            case ">":
                return `${Columnas} > ${parseSQLValue(DesdeValor, TipoDato)}`;
            case ">=":
                return `${Columnas} >= ${parseSQLValue(DesdeValor, TipoDato)}`;
            case "between":
                return `${Columnas} BETWEEN ${parseSQLValue(DesdeValor, TipoDato)} AND ${parseSQLValue(HastaValor, TipoDato)}`;
            case "notBetween":
                return `${Columnas} NOT BETWEEN ${parseSQLValue(DesdeValor, TipoDato)} AND ${parseSQLValue(HastaValor, TipoDato)}`;
            default:
                throw new Error(`Operador no soportado: ${OperadorValor}`);
        }
    });

    // Unir las condiciones con el operador lógico principal
    const logicalOperator = rules[0]?.OperadorLogico === "Y" ? "AND" : "OR";
    const whereClause = conditions.join(` ${logicalOperator} `);

    // return `SELECT *\nFROM ${tableName}\nWHERE ${whereClause};`;
    return `WHERE ${whereClause};`;
}

