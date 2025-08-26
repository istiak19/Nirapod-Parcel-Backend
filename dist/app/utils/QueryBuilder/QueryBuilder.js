"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    constructor(modelQuery, query) {
        this.filters = {};
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
        // accumulate filters
        this.filters = Object.assign(Object.assign({}, this.filters), searchTerm);
        return this;
    }
    filter() {
        const excludeFields = ["search", "page", "limit"];
        for (const key of Object.keys(this.query)) {
            if (!excludeFields.includes(key)) {
                this.filters[key] = this.query[key];
            }
        }
        this.modelQuery = this.modelQuery.find(this.filters);
        return this;
    }
    pagination() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        if (!this.modelQuery.getFilter() || Object.keys(this.modelQuery.getFilter()).length === 0) {
            this.modelQuery = this.modelQuery.find(this.filters);
        }
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    meta(role, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 10;
            let total = 0;
            if (role === "Receiver" && userId) {
                total = yield this.modelQuery.model.countDocuments({ receiver: userId });
            }
            else if (role === "Sender" && userId) {
                total = yield this.modelQuery.model.countDocuments({ sender: userId });
            }
            else if (role === "Admin") {
                total = yield this.modelQuery.model.countDocuments({});
            }
            const totalPage = Math.ceil(total / limit);
            return { page, limit, totalPage, total };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
;
