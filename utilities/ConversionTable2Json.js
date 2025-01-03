import moment from "moment";

function parseValue(value, tipoDato) {
    if (tipoDato === "Date") {
        return new Date(value);
    } else if (tipoDato === "String") {
        // Si es un array de objetos con una propiedad 'value', extrae los valores
        if (Array.isArray(value) && typeof value[0] === "object" && value[0]?.value) {
            return value.map(item => item.value.toString());
        }

        // Si es un array de strings, retórnalo como está
        if (Array.isArray(value) && typeof value[0] === "string") {
            return value;
        }

        // Si es un string único, envuélvelo en un array
        if (typeof value === "string") {
            return [value];
        }

        // Si llega a este punto, intenta convertirlo en string y ponerlo en un array
        return [String(value)];
    } else if (tipoDato === "Boolean") {
        return value === "true" || value === true;
    } else if (tipoDato === "Number") {

        return parseFloat(value);
    }
    return value;
}

const buildQuery = (rule) => {
    const { Columnas, OperadorValor, DesdeValor, HastaValor, TipoDato } = rule;
    const desdeValorParsed = parseValue(DesdeValor, TipoDato);
    const hastaValorParsed = parseValue(HastaValor, TipoDato);
    // console.log(OperadorValor)
    let query = {};
    switch (OperadorValor) {
        case '=':
            query = { [Columnas]: desdeValorParsed };
            break;
        case '!=':
            query = { [Columnas]: { $ne: desdeValorParsed } };
            break;
        case 'in':
            query = { [Columnas]: { $in: desdeValorParsed } };
            break;
        case 'notIn':
            query = { [Columnas]: { $nin: desdeValorParsed } };
            break;
        case '<':
            query = { [Columnas]: { $lt: desdeValorParsed } };
            break;
        case '<=':
            query = { [Columnas]: { $lte: desdeValorParsed } };
            break;
        case '>':
            query = { [Columnas]: { $gt: desdeValorParsed } };
            break;
        case '>=':
            query = { [Columnas]: { $gte: desdeValorParsed } };
            break;
        case 'between':
            query = { [Columnas]: { $gte: desdeValorParsed, $lte: hastaValorParsed } };
            break;
        case 'notBetween':
            query = { [Columnas]: { $not: { $gte: desdeValorParsed, $lte: hastaValorParsed } } };
            break;
        case 'contains':
            query = { [Columnas]: { $regex: desdeValorParsed, $options: 'i' } };
            break;
        case 'beginsWith':
            query = { [Columnas]: { $regex: `^${desdeValorParsed}`, $options: 'i' } };
            break;
        case 'endsWith':
            query = { [Columnas]: { $regex: `${desdeValorParsed}$`, $options: 'i' } };
            break;
        case 'doesNotContain':
            query = { [Columnas]: { $not: { $regex: desdeValorParsed, $options: 'i' } } };
            break;
        case 'doesNotBeginWith':
            query = { [Columnas]: { $not: { $regex: `^${desdeValorParsed}`, $options: 'i' } } };
            break;
        case 'doesNotEndWith':
            query = { [Columnas]: { $not: { $regex: `${desdeValorParsed}$`, $options: 'i' } } };
            break;
        case 'null':
            query = { [Columnas]: { $eq: null } };
            break;
        case 'notNull':
            query = { [Columnas]: { $ne: null } };
            break;
        default:
            throw new Error(`Operador desconocido: ${OperadorValor}`);
    }

    return query;
};

export function buildAggregationPipeline(rules) {
    const logicalOperator = rules[0].OperadorInicial === "Y" ? "$and" : "$or";
    const mainQuery = [];
    const groupMap = {};

    rules.forEach(rule => {
        if (rule.TipoRegla === "GrupoRegla") {
            const { Grupo, OperadorLogico, PorCada } = rule;
            if (!groupMap[Grupo]) {
                groupMap[Grupo] = { operator: OperadorLogico === "Y" ? "$and" : "$or", rules: [], porCada: null };
            }
            if (PorCada !== null && PorCada !== undefined && PorCada !== "") {
                groupMap[Grupo].porCada = parseValue(PorCada, "Number");
            }
            groupMap[Grupo].rules.push(buildQuery(rule));
        } else if (rule.Agrupacion && rule.Agrupacion !== "") {
            const { Agrupacion, Columnas, OperadorAgrupacion, DesdeValorAgrupacion, HastaValorAgrupacion, PorCadaAgrupacion } = rule;
            const desdeValorAgrupacionParsed = parseValue(DesdeValorAgrupacion, "Number");
            const hastaValorAgrupacionParsed = parseValue(HastaValorAgrupacion, "Number");

            const matchStage = { $match: buildQuery(rule) };
            const groupStage = {
                $group: {
                    _id: `$${Agrupacion}`,
                    total: { $sum: "$PrecioProducto" }
                }
            };

            let havingCondition = {};
            switch (OperadorAgrupacion) {
                case '>=':
                    havingCondition = { total: { $gte: desdeValorAgrupacionParsed } };
                    break;
                case '>':
                    havingCondition = { total: { $gt: desdeValorAgrupacionParsed } };
                    break;
                case '<=':
                    havingCondition = { total: { $lte: desdeValorAgrupacionParsed } };
                    break;
                case '<':
                    havingCondition = { total: { $lt: desdeValorAgrupacionParsed } };
                    break;
                case '=':
                    havingCondition = { total: desdeValorAgrupacionParsed };
                    break;
                case 'between':
                    havingCondition = {
                        total: {
                            $gte: desdeValorAgrupacionParsed,
                            $lte: hastaValorAgrupacionParsed
                        }
                    };
                    break;
                case 'notBetween':
                    havingCondition = {
                        total: {
                            $not: {
                                $gte: desdeValorAgrupacionParsed,
                                $lte: hastaValorAgrupacionParsed
                            }
                        }
                    };
                    break;
                default:
                    throw new Error(`Operador de agrupación desconocido: ${OperadorAgrupacion}`);
            }

            const matchHaving = { $match: havingCondition };

            if (PorCadaAgrupacion !== null && PorCadaAgrupacion !== undefined && PorCadaAgrupacion !== "") {
                matchHaving.$match.PorCadaAgrupacion = { $ne: parseValue(PorCadaAgrupacion, "Number") };
            }

            mainQuery.push(matchStage);
            mainQuery.push(groupStage);
            mainQuery.push(matchHaving);
        } else {
            const query = buildQuery(rule);
            if (rule.PorCada !== null && rule.PorCada !== undefined && rule.PorCada !== "") {
                mainQuery.push({ ...query, PorCada: { $ne: parseValue(rule.PorCada, "Number") } });
            } else {
                mainQuery.push(query);
            }
        }
    });

    Object.keys(groupMap).forEach(groupKey => {
        const group = groupMap[groupKey];
        const groupQuery = { [group.operator]: group.rules };
        if (group.porCada !== null && group.porCada !== undefined && group.porCada !== "") {
            groupQuery[group.operator].push({ PorCada: { $ne: group.porCada } });
        }
        mainQuery.push(groupQuery);
    });

    return { [logicalOperator]: mainQuery };
}
