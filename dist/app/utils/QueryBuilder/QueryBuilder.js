"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        const search = this.query.search;
        if (!search)
            return this;
        const searchTerm = {
            $or: searchableFields.map(field => ({
                [field]: { $regex: search, $options: "i" }
            }))
        };
        this.modelQuery = this.modelQuery.find(searchTerm);
        return this;
    }
    ;
}
exports.QueryBuilder = QueryBuilder;
;
